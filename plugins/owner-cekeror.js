// CODE BY FAHRIXZ
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g

import fs from 'fs'
import path from 'path'

let handler = async (m) => {
  try {

    const pluginFolder = './plugins'

    if (!fs.existsSync(pluginFolder)) {
      return m.reply('❌ Folder plugins tidak ditemukan!')
    }

    let files = fs.readdirSync(pluginFolder)
      .filter(v => v.endsWith('.js'))

    let errors = []
    let success = 0

    await m.reply(`🔍 Checking ${files.length} plugins...`)

    // =========================
    // PARALLEL SAFE CHECK
    // =========================
    await Promise.all(files.map(async (file) => {
      try {

        let filePath = path.resolve(pluginFolder, file)

        // cache bypass tapi lebih ringan
        let plugin = await import(`file://${filePath}?v=${Date.now()}`)

        let handler = plugin?.default

        // =========================
        // VALIDATION RULES
        // =========================
        if (!handler) {
          throw new Error('No default export found')
        }

        if (typeof handler !== 'function' && typeof handler !== 'object') {
          throw new Error('Export bukan function/object handler')
        }

        // kalau object plugin (Baileys style)
        if (typeof handler === 'object') {
          if (!handler.command && !handler.help && !handler.tags) {
            throw new Error('Handler tidak punya command/help/tags')
          }
        }

        // kalau function plugin (simple style)
        if (typeof handler === 'function') {
          // masih valid (boleh kosong command di attach nanti)
        }

        success++

      } catch (err) {
        errors.push(`❌ ${file} → ${err.message}`)
      }
    }))

    // =========================
    // RESULT REPORT
    // =========================
    let msg = `
╭━━〔 🧪 PLUGIN CHECK REPORT 〕
│
├ 📦 Total : ${files.length}
├ ✅ OK    : ${success}
├ ❌ Error : ${errors.length}
│
╰━━
`.trim()

    if (errors.length) {
      msg += `\n\n🚨 ERROR LIST:\n\n${errors.slice(0, 20).join('\n')}`
    } else {
      msg += `\n\n🎉 Semua plugin aman!`
    }

    m.reply(msg)

  } catch (e) {
    console.log(e)
    m.reply('❌ Checker error:\n' + e.message)
  }
}

handler.help = ['checkerror']
handler.tags = ['owner']
handler.command = /^checkerror$/i
handler.rowner = true

export default handler