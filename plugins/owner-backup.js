// CODE BY FAHRIXZ
// own backup
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g

import fs from 'fs'
import archiver from 'archiver'
import path from 'path'

const handler = async (m, { conn }) => {
  try {

    const tmpDir = './tmp'
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }

    const date = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    const backupName = `Victoria-MD-Backup-${Date.now()}.zip`
    const backupPath = path.join(tmpDir, backupName)

    await m.reply('✨ Membuat backup sistem...')

    const output = fs.createWriteStream(backupPath)

    const archive = archiver('zip', {
      zlib: { level: 9 }
    })

    // =========================
    // ERROR HANDLING
    // =========================
    archive.on('warning', err => {
      if (err.code !== 'ENOENT') console.log('Archive warning:', err)
    })

    archive.on('error', err => {
      throw err
    })

    output.on('close', async () => {
      try {

        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2)

        let owner = global.fahrixz?.[0]?.[0]
          ? global.fahrixz[0][0] + '@s.whatsapp.net'
          : m.sender

        const caption = `
╭━━〔 📦 BACKUP SUCCESS 〕
│
├ 📁 File : ${backupName}
├ 📊 Size : ${sizeMB} MB
├ 📅 Date : ${date}
│
╰━━
⚡ Victoria MD System
        `.trim()

        // kirim ke chat
        await conn.sendMessage(m.chat, {
          document: fs.readFileSync(backupPath),
          fileName: backupName,
          mimetype: 'application/zip',
          caption
        }, { quoted: m })

        // kirim ke owner
        if (owner !== m.chat) {
          await conn.sendMessage(owner, {
            text: caption
          })
        }

        // delete file after send
        fs.unlinkSync(backupPath)

      } catch (err) {
        console.log(err)
        m.reply('❌ Gagal mengirim backup:\n' + err.message)
      }
    })

    archive.pipe(output)

    // =========================
    // CLEAN BACKUP TARGET
    // =========================
    archive.glob('**/*', {
      ignore: [
        'node_modules/**',
        'sessions/**',
        'tmp/**',
        '.git/**',
        '*.zip',
        backupName
      ]
    })

    archive.finalize()

  } catch (e) {
    console.log(e)
    m.reply('❌ Backup error:\n' + e.message)
  }
}

handler.help = ['backup']
handler.tags = ['owner']
handler.command = /^backup$/i
handler.owner = true

export default handler