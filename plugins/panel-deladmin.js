/*
📌 Nama Fitur: Cpanel 
🏷️ Type : Plugin ESM
✍️ Convert By FahriXz
📢 Channel: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
*/

import fetch from 'node-fetch'
import '../config.js'

const handler = async (m, { conn, text, args, command }) => {
  if (!text) {
    return m.reply(
      `❌ Contoh penggunaan:\n\n*${command} <id_user_admin>*`
    )
  }

  const { domain, apikey } = global

  try {
    const cek = await fetch(`${domain}/api/application/users`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`
      }
    })

    const res = await cek.json()
    const users = res.data || []

    let target = users.find(
      e => e.attributes.id == args[0] && e.attributes.root_admin === true
    )

    if (!target) {
      return m.reply(
        '❌ Gagal menghapus akun!\nID tidak ditemukan atau bukan admin.'
      )
    }

    const idadmin = target.attributes.id
    const username = target.attributes.username

    const delusr = await fetch(`${domain}/api/application/users/${idadmin}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`
      }
    })

    if (!delusr.ok) {
      const err = await delusr.json()
      return m.reply(
        '❌ Gagal menghapus:\n' +
          JSON.stringify(err.errors?.[0] || err, null, 2)
      )
    }

    await m.reply(
      `✅ Berhasil menghapus admin panel:\n\n👤 *${username}*\n🆔 ID: ${idadmin}\n\nFahriXz • Panel System`
    )
  } catch (err) {
    m.reply('❌ Terjadi kesalahan: ' + err.message)
  }
}

handler.command = ['deladmin']
handler.tags = ['panel']
handler.help = ['deladmin <id_user_admin>']
handler.owner = true

export default handler