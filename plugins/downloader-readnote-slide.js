// 💫 Name Fitur : downloader slide picture readnote 
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 

import { rednoteSlide } from '../library/librednote-slide.js'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('📸 Kirim link RedNote slide\n\nContoh:\n.redslide https://...')

  await m.react('⏳')

  try {
    let data = await rednoteSlide(text.trim())

    await m.react('📥')

    let msg =
`📸 *REDNOTE SLIDE DOWNLOADER*

📌 Title: ${data.title}
🔢 Total Slide: ${data.total}
🌐 Source: ${data.source}`

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m })

    // kirim gambar slide
    for (let img of data.images.slice(0, 15)) {
      await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: '🖼 RedNote Slide'
      }, { quoted: m })
    }

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    m.reply('❌ Gagal ambil slide RedNote (kemungkinan konten dynamic / private)')
  }
}

handler.help = ['redslide']
handler.tags = ['downloader']
handler.command = /^redslide$/i
handler.limit = true

export default handler