import fetch from 'node-fetch'

let handler = {}

handler.before = async function (m, { conn }) {

  if (!m.text) return
  if (m.fromMe) return

  const ownerJid = '6287895917725@s.whatsapp.net'

  // =========================
  // ONLY OWNER TRIGGER
  // =========================
  if (m.sender !== ownerJid) return

  // =========================
  // SIMPLE AI MODE (OWNER ONLY)
  // =========================
  let prompt = m.text.toLowerCase()

  // optional: filter command bot supaya tidak ganggu
  if (prompt.startsWith('.') || prompt.startsWith('/') || prompt.startsWith('!')) return

  try {

    // =========================
    // SIMPLE AI RESPONSE ENGINE
    // =========================
    let res = await fetch('https://api.nekosapi.com/v3/text?text=' + encodeURIComponent(m.text))
    let json = await res.json().catch(() => null)

    let aiText = json?.response || json?.message

    // fallback kalau API gagal
    if (!aiText) {
      aiText = ownerFallback(m.text)
    }

    await conn.sendMessage(m.chat, {
      text: ` OWNER MODE ACTIVE

${aiText}

 Victoria AI System`
    }, { quoted: m })

  } catch (e) {
    console.log('Owner AI error:', e)

    await conn.sendMessage(m.chat, {
      text: `OWNER MODE

Victoria lagi offline AI API, tapi tetap standby untukmu boss.

Kamu bilang: "${m.text}"`
    }, { quoted: m })
  }
}

export default handler

// =========================
// FALLBACK AI (OFFLINE LOGIC)
// =========================
function ownerFallback(text) {

  let responses = [
    `Victoria dengar perintahmu: "${text}"`,
    `Mode owner aktif, aku siap bantu.`,
    `Victoria sistem merespon: "${text}"`,
    `Perintah diterima boss.`,
    `Victoria sedang memproses instruksi kamu...`
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}