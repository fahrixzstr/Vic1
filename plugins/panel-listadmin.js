/*
📌 Nama Fitur: Cpanel 
🏷️ Type : Plugin ESM (Upgrade v2)
⚠️ WM: FahriXz
📢 Channel: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
*/

import fetch from 'node-fetch'
import '../config.js'

const handler = async (m, { conn, text }) => {
  const domain = global.domain
  const apikey = global.apikey

  try {
    const res = await fetch(`${domain}/api/application/users`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apikey
      }
    })

    const json = await res.json()
    const users = json.data || []

    let admins = users
      .map(u => u.attributes)
      .filter(u => u.root_admin === true)

    if (!admins.length) {
      return m.reply('❌ Tidak ada admin panel ditemukan.')
    }

    // =========================
    // FILTER SEARCH (optional)
    // =========================
    if (text) {
      const keyword = text.toLowerCase()
      admins = admins.filter(a =>
        String(a.id).includes(keyword) ||
        (a.first_name || '').toLowerCase().includes(keyword)
      )
    }

    if (!admins.length) {
      return m.reply('❌ Admin tidak ditemukan dengan keyword itu.')
    }

    let teks = `👑 *LIST ADMIN PANEL (UPGRADE v2)*\n\n`
    teks += `📊 Total Admin: ${admins.length}\n\n`

    const buttons = []

    for (const a of admins) {
      const status = a.username ? '🟢 ACTIVE' : '🟡 UNKNOWN'

      teks += `📡 ID   : ${a.id}\n`
      teks += `👤 Nama : ${a.first_name || '-'}\n`
      teks += `📅 Date : ${a.created_at ? a.created_at.split('T')[0] : '-'}\n`
      teks += `⚡ Status: ${status}\n`
      teks += `──────────────────\n`

      buttons.push({
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: `Copy ID ${a.id}`,
          copy_code: String(a.id)
        })
      })
    }

    teks += `\nFahriXz • Panel System`

    await conn.sendMessage(m.chat, {
      text: teks.trim(),
      footer: 'Admin Panel Control',
      buttons: buttons.slice(0, 5) // biar tidak terlalu banyak tombol
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    m.reply('❌ Error:\n' + err.message)
  }
}

handler.command = /^listadmin$/i
handler.tags = ['panel']
handler.help = ['listadmin [search]']
handler.owner = false
handler.plus = true

export default handler