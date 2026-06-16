/*
📌 Nama Fitur: Cpanel 
🏷️ Type : Plugin ESM
⚠️ WM: FahriXz
📢 Channel: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
*/

import fetch from 'node-fetch'
import '../config.js'

const handler = async (m, { conn, text, args }) => {
  if (!text) {
    return m.reply(`❌ Contoh:\n.delpanel <id server>`)
  }

  const idTarget = Number(text.replace(/[^0-9]/g, ''))
  if (!idTarget) return m.reply('❌ ID server tidak valid!')

  try {
    await m.reply('🔍 Mengecek server...')

    // =========================
    // GET SERVER LIST
    // =========================
    const res = await fetch(`${global.domain}/api/application/servers`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + global.apikey
      }
    })

    const json = await res.json()
    const servers = json.data || []

    const server = servers.find(s => s.attributes.id === idTarget)

    if (!server) {
      return m.reply('❌ Server tidak ditemukan!')
    }

    const s = server.attributes

    // =========================
    // CONFIRMATION
    // =========================
    const confirmMsg = `
⚠️ *CONFIRM DELETE SERVER*

🆔 ID   : ${s.id}
📦 Name : ${s.name}

Ketik:
*YES ${s.id}* untuk hapus
*NO* untuk batal
`.trim()

    await m.reply(confirmMsg)

    // =========================
    // WAIT CONFIRM (simple system)
    // =========================
    conn.delpanelConfirm = conn.delpanelConfirm || {}

    conn.delpanelConfirm[m.sender] = {
      id: s.id,
      name: s.name,
      time: Date.now()
    }

    setTimeout(() => {
      delete conn.delpanelConfirm[m.sender]
    }, 30000)

  } catch (err) {
    m.reply('❌ Error: ' + err.message)
  }
}

// =========================
// SECOND HANDLER (CONFIRM)
// =========================
handler.before = async (m, { conn }) => {
  if (!conn.delpanelConfirm) return

  let data = conn.delpanelConfirm[m.sender]
  if (!data) return

  const text = m.text?.toUpperCase()

  if (text === 'NO') {
    delete conn.delpanelConfirm[m.sender]
    return m.reply('❎ Dibatalkan.')
  }

  if (text === `YES ${data.id}` || text === 'YES') {
    try {
      await m.reply('⏳ Menghapus server...')

      await fetch(`${global.domain}/api/application/servers/${data.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + global.apikey
        }
      })

      delete conn.delpanelConfirm[m.sender]

      // =========================
      // LOG OWNER (optional)
      // =========================
      const owner = global.fahrixz || null
      if (owner) {
        conn.sendMessage(owner + '@s.whatsapp.net', {
          text: `🗑️ Server dihapus:\n\nID: ${data.id}\nName: ${data.name}`
        })
      }

      return m.reply(`✅ Server *${data.name}* berhasil dihapus!`)
    } catch (e) {
      return m.reply('❌ Gagal delete: ' + e.message)
    }
  }
}

handler.command = /^delpanel$/i
handler.tags = ['panel']
handler.help = ['delpanel <id>']
handler.owner = true

export default handler