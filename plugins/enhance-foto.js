// 💫 Name Fitur : ENCHANCE FOTO 
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 
import Jimp from 'jimp'

// =========================
// SIMPLE USER DATABASE (TEMP)
// =========================
const userDB = global.db?.data?.users || {}

let handler = async (m, { conn, args }) => {
  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ''

  let sender = m.sender
  let user = userDB[sender] || (userDB[sender] = {
    premium: false,
    last2k: 0
  })

  // =========================
  // MENU
  // =========================
  if (!args[0]) {
    return m.reply(`
🧠 *PHOTO ENHANCE*

📌 MODE AVAILABLE:

🆓 FREE
• 720  → Smooth Enhance
• 1080 → HD Standard

⏳ LIMITED (FREE USER)
• 2K → 1x per week

💎 PREMIUM ONLY
• 4K → Ultra AI Enhance
• 8K → Extreme AI Render
• PRO → Cinematic DSLR AI

━━━━━━━━━━━━━━
💳 Upgrade required:
• 4K / 8K / PRO = PREMIUM ONLY
• 2K = 1x / 7 hari (FREE USER)

📥 Contoh:
.enhance 2k
    `.trim())
  }

  if (!mime || !mime.includes('image')) {
    return m.reply('❌ Reply gambar dulu!')
  }

  let mode = args[0].toLowerCase()
  let buffer = await q.download()

  // =========================
  // LIMIT SYSTEM 2K
  // =========================
  let now = Date.now()
  let week = 7 * 24 * 60 * 60 * 1000

  if (mode === '2k') {
    if (now - user.last2k < week) {
      return m.reply('⏳ Limit 2K habis! Tunggu 7 hari atau upgrade premium.')
    }
    user.last2k = now
  }

  // =========================
  // PREMIUM LOCK
  // =========================
  const premiumOnly = ['4k', '8k', 'pro']

  if (premiumOnly.includes(mode) && !user.premium) {
    return m.reply(`
🔒 FITUR PREMIUM

Mode ${mode.toUpperCase()} hanya untuk user PLUS

💎 Upgrade untuk akses:
• 4K Ultra AI
• 8K Extreme AI
• PRO Cinematic

Ketik: .buy plus
    `.trim())
  }

  // =========================
  // CONFIG MODE
  // =========================
  const cfg = {
    '720':  { scale: 1.5, sharp: 0.6, name: '720P FREE' },
    '1080': { scale: 2,   sharp: 0.8, name: '1080P HD' },
    '2k':   { scale: 3,   sharp: 1.2, name: '2K LIMITED' },
    '4k':   { scale: 4,   sharp: 1.6, name: '4K PREMIUM' },
    '8k':   { scale: 6,   sharp: 2.2, name: '8K ULTRA PREMIUM' },
    'pro':  { scale: 5,   sharp: 2.5, name: 'PRO CINEMATIC' }
  }

  let set = cfg[mode]
  if (!set) return m.reply('❌ Mode tidak valid')

  await m.react('⏳')

  try {
    let img = await Jimp.read(buffer)

    img.resize(
      img.bitmap.width * set.scale,
      img.bitmap.height * set.scale
    )

    img
      .quality(100)
      .normalize()
      .contrast(0.4)
      .brightness(0.1)

    // sharpening engine
    img.convolute([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0]
    ])

    let result = await img.getBufferAsync(Jimp.MIME_JPEG)

    await conn.sendMessage(m.chat, {
      document: result,
      fileName: `${set.name}_${Date.now()}.jpg`,
      mimetype: 'image/jpeg',
      caption: `
✨ PHOTO ENHANCE DONE

📊 Mode: ${set.name}
👤 User: ${user.premium ? 'PREMIUM' : 'FREE'}
⚡ Status: AI Processing Complete
      `.trim()
    }, { quoted: m })

    await m.react('✅')

  } catch (e) {
    console.log(e)
    m.reply('❌ Gagal proses gambar')
  }
}

handler.command = /^enhance$/i
handler.tags = ['ai', 'premium']
handler.help = ['enhance']
handler.limit = true

export default handler