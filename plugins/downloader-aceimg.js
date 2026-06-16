// 💫 Name Fitur : downloader aceimg
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 


import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return m.reply(
`🖼️ ACEIMG Downloader

Contoh:
${usedPrefix}aceimg https://aceimg.com/xxxx`
  )

  await m.react('⏳')

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  async function extractImages(html) {
    let images = new Set()

    // 🔥 OG / META IMAGE
    let metaPatterns = [
      /property="og:image"\s*content="(.*?)"/gi,
      /name="twitter:image"\s*content="(.*?)"/gi
    ]

    for (let p of metaPatterns) {
      let match
      while ((match = p.exec(html)) !== null) {
        images.add(match[1])
      }
    }

    // 🧠 JSON / script image extraction
    let jsonMatch = html.match(/"image"\s*:\s*"([^"]+)"/g)
    if (jsonMatch) {
      jsonMatch.forEach(i => {
        let url = i.match(/"image"\s*:\s*"([^"]+)"/)?.[1]
        if (url) images.add(url)
      })
    }

    // 🔎 direct image scan
    let direct = html.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp)/gi)
    if (direct) {
      direct.forEach(i => images.add(i))
    }

    return [...images]
  }

  async function fetchPage(url) {
    for (let i = 0; i < 3; i++) {
      try {
        let res = await fetch(url, {
          headers: {
            'user-agent': 'Mozilla/5.0'
          }
        })
        let html = await res.text()
        if (html) return html
      } catch (e) {
        await sleep(1000)
      }
    }
    return null
  }

  try {
    let url = text.trim()

    let html = await fetchPage(url)
    if (!html) throw 'Gagal mengambil halaman'

    let images = await extractImages(html)

    if (!images.length) {
      await m.react('❌')
      return m.reply('❌ Tidak ada gambar ditemukan (proteksi aktif / struktur berubah)')
    }

    await m.react('📤')

    for (let img of images.slice(0, 10)) {
      try {
        await conn.sendMessage(m.chat, {
          image: { url: img },
          caption: `🖼️ ACEIMG RESULT\n🔗 ${img}`
        }, { quoted: m })

        await sleep(1200)
      } catch (e) {}
    }

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    m.reply('❌ ACEIMG ERROR\nLink tidak valid atau proteksi website aktif')
  }
}

handler.help = ['aceimg']
handler.tags = ['downloader']
handler.command = /^aceimg(dl)?$/i
handler.limit = false

export default handler