// 💫 Name Fitur : mcpdel downloader 
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 

import fetch from 'node-fetch'
import FormData from 'form-data'
import { fileTypeFromBuffer } from 'file-type'

const cache = new Map()

let handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) return m.reply(
`📥 MCPDEL DOWNLOADER 

Single:
${usedPrefix}mcpdel https://link.com

Batch:
${usedPrefix}mcpdel url1|url2|url3`
  )

  await m.react('⚡')

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  async function uploadCatbox(buffer) {
    const { ext } = (await fileTypeFromBuffer(buffer)) || {}
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, `file.${ext || 'bin'}`)

    let res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    })

    let txt = await res.text()
    return txt.startsWith('http') ? txt : null
  }

  async function extractVideo(html) {
    let patterns = [
      /"file"\s*:\s*"([^"]+)"/i,
      /"fileUrl"\s*:\s*"([^"]+)"/i,
      /"videoUrl"\s*:\s*"([^"]+)"/i,
      /"contentUrl"\s*:\s*"([^"]+)"/i,
      /source\s*src="(.*?)"/i,
      /og:video"\s*content="(.*?)"/i,
      /https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/i
    ]

    for (let p of patterns) {
      let m = html.match(p)
      if (m) return m[1] || m[0]
    }

    let all = html.match(/https?:\/\/[^\s"'<>]+/g)
    if (all) {
      return all.find(v =>
        v.includes('.mp4') ||
        v.includes('cdn') ||
        v.includes('video') ||
        v.includes('stream')
      )
    }

    return null
  }

  async function process(url) {
    if (cache.has(url)) return cache.get(url)

    let html = ''

    for (let i = 0; i < 3; i++) {
      try {
        let res = await fetch(url, {
          method: 'GET',
          redirect: 'follow',
          headers: {
            'user-agent': 'Mozilla/5.0'
          }
        })
        html = await res.text()
        if (html) break
      } catch (e) {
        await sleep(1000)
      }
    }

    if (!html) return null

    let video = await extractVideo(html)
    if (!video) return null

    // 🧠 QUALITY DETECTION (simple heuristic)
    let quality =
      video.includes('1080') ? '1080p' :
      video.includes('720') ? '720p' :
      video.includes('480') ? '480p' : 'unknown'

    cache.set(url, { video, quality })

    return { video, quality }
  }

  try {
    let inputs = text.split('|').map(v => v.trim())

    let results = []

    for (let url of inputs) {
      let data = await process(url)
      if (data) results.push({ url, ...data })
    }

    if (!results.length) {
      await m.react('❌')
      return m.reply('❌ VICTORIA: semua link gagal diproses')
    }

    for (let r of results) {
      let res = await fetch(r.video)
      let buffer = await res.arrayBuffer()

      let upload = await uploadCatbox(Buffer.from(buffer))

      await conn.sendMessage(m.chat, {
        video: { url: upload || r.video },
        caption:
`🚀 MCPDEL ULTRA PRO

🔗 Source: MCPDEL
🎥 Quality: ${r.quality}
☁️ Hosted: ${upload ? 'Catbox' : 'Direct'}
⚡ Status: OK`
      }, { quoted: m })

      await sleep(1500)
    }

    await m.react('✅')

  } catch (e) {
    console.log(e)
    await m.react('❌')
    m.reply('❌ VICTORIA ERROR\nSistem proteksi atau link tidak valid')
  }
}

handler.help = ['mcpdel']
handler.tags = ['downloader']
handler.command = /^mcpdel(ultra|pro|dl)?$/i
handler.limit = false

export default handler