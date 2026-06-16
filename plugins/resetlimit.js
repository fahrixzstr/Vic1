/*
📌 Nama Fitur: Reset Limit (Upgrade)
🏷️ Type : Plugin ESM
✍️ Convert By FahriXz
🌐 Saluran: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
*/

let handler = async (m, { conn, args }) => {
  let list = Object.entries(global.db.data.users)

  let lim = !args || !args[0]
    ? 25
    : isNumber(args[0])
      ? parseInt(args[0])
      : 25

  lim = Math.max(1, lim)

  // reset limit semua user
  for (let [user, data] of list) {
    if (!data) continue
    data.limit = lim
  }

  conn.reply(
    m.chat,
    `╭─❒ *RESET LIMIT BERHASIL*
│
├ ✔ Limit per user: *${lim}*
├ 👥 Total user: *${list.length}*
│
╰─❒ _FahriXz Bot System_`,
    m
  )
}

handler.help = ['resetlimit']
handler.tags = ['owner']
handler.command = /^(resetlimit)$/i
handler.owner = true

export default handler

function isNumber(x = 0) {
  x = parseInt(x)
  return !isNaN(x) && typeof x === 'number'
}