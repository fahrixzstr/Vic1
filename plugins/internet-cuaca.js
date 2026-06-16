import fetch from "node-fetch";

// =========================
// CONFIG
// =========================
const CUACA_API = "https://weather.bmkg.go.id/api/presentwx/coord";
const WARNING_API = "https://cuaca.bmkg.go.id/api/v1/public/weather/warning";

// =========================
// WEATHER AI ENGINE
// =========================
function weatherRiskScore(data) {
  let score = 0;

  // hujan / awan
  if (data.tcc > 70) score += 25;
  if (data.hu > 80) score += 25;
  if (data.ws > 25) score += 25;
  if (data.t < 24) score += 10;

  return Math.min(score, 100);
}

// =========================
// RAIN PREDICTION (1–3 JAM)
// =========================
function rainPrediction(data) {
  let chance = 0;

  if (data.hu > 85) chance += 40;
  if (data.tcc > 75) chance += 30;
  if (data.ws > 20) chance += 10;
  if (data.t < 26) chance += 10;

  if (chance >= 70) return "Hujan lebat dalam 1–3 jam ⛈";
  if (chance >= 50) return "Hujan ringan–sedang dalam 1–3 jam 🌧";
  if (chance >= 30) return "Kemungkinan hujan lokal 🌦";
  return "Cuaca relatif cerah ☀";
}

// =========================
// STORM ALERT
// =========================
function stormAlert(data) {
  if (data.ws > 35 && data.hu > 80) {
    return "🚨 POTENSI BADAI / ANGIN KENCANG TERDETEKSI";
  }
  if (data.ws > 25 && data.tcc > 80) {
    return "⚠️ Cuaca tidak stabil, waspada angin kencang";
  }
  return "🌿 Kondisi cuaca normal";
}

// =========================
// SIMPLE HEATMAP INDONESIA (SIMULASI GRID)
// =========================
function heatmapSim(lat, lon, risk) {
  let zone =
    risk > 70 ? "🔴 Zona Risiko Tinggi" :
    risk > 40 ? "🟡 Zona Risiko Sedang" :
    "🟢 Zona Aman";

  return `${zone} (Lat: ${lat}, Lon: ${lon})`;
}

// =========================
// FETCH WEATHER
// =========================
async function getWeather(lat, lon) {
  let url = new URL(CUACA_API);
  url.search = new URLSearchParams({ lat, lon });

  let res = await fetch(url);
  if (!res.ok) throw new Error("Weather API error");

  return await res.json();
}

// =========================
// MAIN ENGINE
// =========================
let handler = async (m, { args }) => {
  try {
    if (!args[0]) return m.reply("Contoh: .geo-weather jakarta");

    // =========================
    // SIMPLE GEO (fallback static coords)
    // =========================
    let lat = -6.2;
    let lon = 106.8;

    const data = await getWeather(lat, lon);

    const w = data.data.cuaca;

    const risk = weatherRiskScore(w);
    const rain = rainPrediction(w);
    const storm = stormAlert(w);
    const heatmap = heatmapSim(lat, lon, risk);

    let msg = `
╭━━〔 🌍 VICTORIA MD GEO WEATHER AI 〕
│
├ 🌦 Cuaca : ${w.weather_desc}/${w.weather_desc_en}
├ 🌡 Suhu  : ${w.t}°C
├ 💧 Humid : ${w.hu}%
├ ☁ Cloud : ${w.tcc}%
├ 🌬 Wind  : ${w.ws} km/h
│
├ 🌧 Rain AI (1–3 jam):
│ ${rain}
│
├ ⛈ Storm AI:
│ ${storm}
│
├ 📊 Risk Score:
│ ${risk}/100
│
├ 🗺 Heatmap:
│ ${heatmap}
│
╰━━
Victoria MD • Geo Intelligence System
`.trim();

    await m.reply(msg);

  } catch (e) {
    m.reply("❌ Error Geo Weather AI: " + e.message);
  }
};

handler.help = ["geo-weather"];
handler.command = ["geo-weather"];
handler.tags = ["tools"];

export default handler;