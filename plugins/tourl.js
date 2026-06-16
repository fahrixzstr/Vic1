import { fileTypeFromBuffer } from 'file-type'
import FormData from 'form-data'
import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys'

async function fetchWithTimeout(url, options = {}, timeout = 7000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(id)
  }
}

// =====================
// TMPFILES UPLOADER
// =====================
async function uploadTmpfiles(buffer) {
  const { ext } = (await fileTypeFromBuffer(buffer)) || {}
  const form = new FormData()

  form.append('file', buffer, `file.${Date.now()}.${ext || 'bin'}`)

  const res = await fetchWithTimeout('https://tmpfiles.org/api/v1/upload', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  }, 7000)

  const json = await res.json().catch(() => null)
  const url = json?.data?.url

  if (!url) throw new Error('Tmpfiles gagal')

  const match = /https?:\/\/tmpfiles\.org\/(.*)/.exec(url)
  if (!match) throw new Error('Format tmpfiles invalid')

  return `https://tmpfiles.org/dl/${match[1]}`
}

// =====================
// CATBOX UPLOADER
// =====================
async function uploadCatbox(buffer) {
  const { ext } = (await fileTypeFromBuffer(buffer)) || {}
  const form = new FormData()

  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, `file.${ext || 'bin'}`)

  const res = await fetchWithTimeout('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  }, 7000)

  const text = (await res.text()).trim()

  if (!text.startsWith('https://')) throw new Error('Catbox gagal')

  return text
}

// =====================
// MAIN HANDLER
// =====================
let handler = async (m, { conn }) => {
  let q = m.quoted || m
  let mime = (q.msg || q).mimetype

  if (!mime) {
    await m.react('❌')
    return m.reply('Reply / kirim media dulu.')
  }

  let buffer = await q.download().catch(() => null)
  if (!buffer) {
    await m.react('❌')
    return m.reply('Gagal mengambil file.')
  }

  await m.react('⏳')

  let mimeType = (await fileTypeFromBuffer(buffer))?.mime || 'unknown'

  let tmp = null
  let catbox = null

  // safe upload (biar tidak crash kalau salah satu mati)
  try { tmp = await uploadTmpfiles(buffer) } catch (e) {}
  try { catbox = await uploadCatbox(buffer) } catch (e) {}

  if (!tmp && !catbox) {
    await m.react('❌')
    return m.reply('Semua uploader gagal, coba lagi nanti.')
  }

  await m.react('✅')

  const text = `
✅ *UPLOAD BERHASIL*

📂 Mime: ${mimeType}

☁️ Tmpfiles:
${tmp || '❌ gagal'}

♾️ Catbox:
${catbox || '❌ gagal'}

💡 Klik tombol untuk copy link
`.trim()

  let buttons = []

  if (tmp) {
    buttons.push({
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: "📋 Copy Tmpfiles",
        copy_code: tmp
      })
    })
  }

  if (catbox) {
    buttons.push({
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: "📋 Copy Catbox",
        copy_code: catbox
      })
    })
  }

  try {
    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: proto.Message.InteractiveMessage.Body.create({ text }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: global.wm || 'Uploader System'
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
              buttons
            })
          })
        }
      }
    }, {})

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    // fallback aman
    await conn.sendMessage(m.chat, { text }, { quoted: m })
  }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^tourl$/i
handler.limit = false

export default handler