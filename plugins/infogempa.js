import fetch from "node-fetch";

// =========================
// CONFIG
// =========================
const API_URL = "https://api.siputzx.my.id/api/info/bmkg";
const INTERVAL = 60 * 1000;

// WhatsApp Channel ID (opsional)
const CHANNEL_ID = "120363427507227571@newsletter";

// AI KEY (optional)
const OPENAI_KEY = process.env.OPENAI_KEY;
const GEMINI_KEY = process.env.GEMINI_KEY;

// =========================
// FETCH GEMPA
// =========================
async function getGempa() {
  let res = await fetch(API_URL);
  let json = await res.json();
  return json.data.auto.Infogempa.gempa;
}

// =========================
// ALERT ENGINE
// =========================
function getAlert(mag) {
  if (mag >= 7) return { level: "BAHAYA", emoji: "🚨", score: 100 };
  if (mag >= 6) return { level: "SANGAT WASPADA", emoji: "🔴", score: 80 };
  if (mag >= 5) return { level: "WASPADA", emoji: "⚠️", score: 60 };
  if (mag >= 4) return { level: "RINGAN", emoji: "🟡", score: 40 };
  return { level: "AMAN", emoji: "🌿", score: 20 };
}

// =========================
// GEO INTELLIGENCE (SIMPLIFIED)
// =========================
function geoImpact(mag) {
  if (mag >= 7) {
    return "Radius dampak berpotensi >300km (kerusakan luas mungkin terjadi)";
  } else if (mag >= 6) {
    return "Radius dampak sekitar 100–300km (guncangan kuat terasa)";
  } else if (mag >= 5) {
    return "Radius dampak sekitar 50–100km (getaran jelas terasa)";
  } else {
    return "Radius dampak lokal <50km (getaran ringan)";
  }
}

// =========================
// GOOGLE MAPS
// =========================
function mapLink(coords) {
  return `https://www.google.com/maps?q=${coords}`;
}

// =========================
// AI ENGINE (Aftershock + Impact)
// =========================
async function aiEngine(gempa) {
  let prompt = `
Analisis gempa berikut:

Magnitudo: ${gempa.Magnitude}
Wilayah: ${gempa.Wilayah}
Kedalaman: ${gempa.Kedalaman}
Koordinat: ${gempa.Coordinates}

Berikan:
1. Dampak singkat ke manusia & bangunan
2. Risiko aftershock (rendah/sedang/tinggi)
3. Saran keselamatan singkat
Jawaban ringkas saja.
`;

  try {
    // OPENAI
    if (OPENAI_KEY) {
      let res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }]
        })
      });

      let json = await res.json();
      return json.choices?.[0]?.message?.content || "AI tidak merespon.";
    }

    // GEMINI
    if (GEMINI_KEY) {
      let res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      let json = await res.json();
      return json.candidates?.[0]?.content?.parts?.[0]?.text || "AI gagal.";
    }

    return "AI tidak aktif.";
  } catch {
    return "AI error system.";
  }
}

// =========================
// BROADCAST WA ONLY
// =========================
async function sendWA(conn, text, thumb) {
  let groups = await conn.groupFetchAllParticipating();
  let ids = Object.keys(groups);

  for (let id of ids) {
    try {
      await conn.sendMessage(id, {
        text,
        contextInfo: {
          externalAdReply: {
            title: "Victoria MD • BMKG ALERT",
            body: "Real-time Disaster Notification",
            thumbnailUrl: thumb,
            sourceUrl: "https://bmkg.go.id",
            mediaType: 1
          }
        }
      });
    } catch {}
  }
}

// =========================
// MAIN ENGINE
// =========================
export async function startVictoriaBMKG(conn) {
  let lastKey = null;

  setInterval(async () => {
    try {
      let g = await getGempa();

      let key = g.Tanggal + g.Jam;
      if (key === lastKey) return;
      lastKey = key;

      let mag = parseFloat(g.Magnitude);
      let alert = getAlert(mag);

      let geo = geoImpact(mag);
      let maps = mapLink(g.Coordinates);

      let ai = await aiEngine(g);

      let thumb = g.Shakemap
        ? `https://data.bmkg.go.id/DataMKG/TEWS/${g.Shakemap}`
        : "https://bmkg.go.id/asset/img/logo/logo-bmkg.png";

      let msg = `
╭━━〔 ${alert.emoji} INFO GEMPA 〕
│
├ 📍 Lokasi : ${g.Wilayah}
├ 🌋 Magnitudo : ${g.Magnitude}
├ 📏 Kedalaman : ${g.Kedalaman}
├ 🔔 Status : ${alert.level}
├ 📊 Severity Score : ${alert.score}/100
│
├ 🌍 GEO IMPACT :
│ ${geo}
│
├ 🗺 Maps : ${maps}
│
├ 🧠 AI ANALYSIS :
${ai}
│
╰━━
Victoria MD • Disaster Intelligence System
`.trim();

      // =========================
      // SEND TO ALL GROUPS ONLY
      // =========================
      await sendWA(conn, msg, thumb);

    } catch (e) {
      console.log("[BMKG PRO ERROR]", e.message);
    }
  }, INTERVAL);
}