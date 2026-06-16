import { rednoteDL } from '../library/librednote.js'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('📱 Kirim link RedNote\n\nContoh:\n.rednote https://...')

  await m.react('⏳')

  try {
    let data = await rednoteDL(text.trim())

    await m.react('📤')

    let msg =
`📱 *REDNOTE DOWNLOADER*

📌 Title: ${data.title || '-'}
📝 Desc: ${data.description || '-'}
🧾 Content:
${data.content || '-'}

🖼 Images: ${data.images.length}
🎥 Videos: ${data.videos.length}`

    await conn.sendMessage(m.chat, { text: msg }, { quoted: m })

    // kirim gambar
    for (let img of data.images.slice(0, 5)) {
      await conn.sendMessage(m.chat, {
        image: { url: img },
        caption: '🖼 RedNote Image'
      }, { quoted: m })
    }

    // kirim video
    for (let vid of data.videos.slice(0, 2)) {
      await conn.sendMessage(m.chat, {
        video: { url: vid },
        caption: '🎥 RedNote Video'
      }, { quoted: m })
    }

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    m.reply('❌ Gagal mengambil data RedNote (kemungkinan konten private / JS render)')
  }
}

handler.help = ['rednote']
handler.tags = ['downloader']
handler.command = /^rednote$/i
handler.limit = true

export default handler