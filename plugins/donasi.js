import fs from 'fs'

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    image: fs.readFileSync('./media/donasi.jpg'),
    caption:
`╭━━━〔 *SUPPORT DEVELOPER* 〕━━━⬣
┃ 💜 FahriXz Donation Center
┃
┃ 🙏 Terima kasih atas dukunganmu
┃ 💡 Donasi membantu pengembangan bot & system
┃
┃ 🚀 Benefit support:
┃ • Update fitur lebih cepat
┃ • Maintenance server
┃ • Pengembangan script baru
┃
┃ 📦 Metode donasi:
┃ 💳 QRIS / DANA
┃
┃ 📲 DANA: 085927713672
╰━━━━━━━━━━━━━━━━━━⬣

> “Support kecilmu = impact besar untuk system ini.”`,

    interactiveButtons: [
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: '📋 Copy Number DANA',
          id: '085927713672' // ganti dengan nomor DANA kamu
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '💳 QRIS',
          url: 'https://your-website.com/donasi',
          merchant_url: 'https://your-website.com/donasi'
        })
      },
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '📢 Channel Update',
          url: 'https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g',
          merchant_url: 'https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g'
        })
      }
    ],

    hasMediaAttachment: true
  })
}

handler.help = ['donasi', 'donate']
handler.tags = ['info']
handler.command = /^(donasi|donate)$/i
handler.limit = false

export default handler