import fs from 'fs'

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: fs.readFileSync('./media/script.jpg'),
    caption:
`╭━━━〔 *FAHRI XZ STORE* 〕━━━⬣
┃ 🚀 Premium Script Available
┃
┃ 💻 Source Code Bot & System
┃ 🔐 Full Access & Update Support
┃ 📦 Instant Delivery via Website
┃
┃ 🛒 Semua script tersedia di website resmi
┃ 💡 Sistem otomatis + aman + update berkala
┃
┃ 📢 Join channel untuk update produk terbaru
╰━━━━━━━━━━━━━━━━━━⬣

> ⚡ “Build once, sell everywhere.”`,

    interactiveButtons: [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '🛒 Beli Script',
          url: 'https://your-website.com/store',
          merchant_url: 'https://your-website.com/store'
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '📢 Update Channel',
          url: 'https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g',
          merchant_url: 'https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g'
        })
      }
    ],

    hasMediaAttachment: true
  })
}

handler.help = ['script', 'sc']
handler.tags = ['info']
handler.command = /^(script|sc)$/i
handler.limit = false

export default handler