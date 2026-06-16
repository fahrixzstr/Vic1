// CODE BY FAHRIXZ
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g


let handler = async (m, { conn, args }) => {
  try {

    // =========================
    // GET PLUS USERS
    // =========================
    let users = Object.entries(global.db.data.users || {})
      .filter(([_, v]) => v.plusTime && v.plusTime > Date.now())

      .map(([jid, v]) => ({
        jid,
        ...v
      }))

    // =========================
    // SORT BY EXPIRY
    // =========================
    users.sort((a, b) => a.plusTime - b.plusTime)

    let limit = args[0] ? Math.min(parseInt(args[0]), 50) : 10

    // =========================
    // LOADING EFFECT
    // =========================
    const loading = [
      '《██▒▒▒▒▒▒▒▒▒▒▒》10%',
      '《████▒▒▒▒▒▒▒▒▒》30%',
      '《███████▒▒▒▒▒▒》50%',
      '《██████████▒▒▒》70%',
      '《█████████████》100%',
      'LOADING COMPLETE...'
    ]

    let { key } = await conn.sendMessage(m.chat, { text: '_Loading Plus List_' })

    for (let i = 0; i < loading.length; i++) {
      await conn.sendMessage(m.chat, {
        text: loading[i],
        edit: key
      })
      await new Promise(r => setTimeout(r, 400))
    }

    // =========================
    // FORMAT OUTPUT
    // =========================
    let text = `
╭━━〔 👑 PLUS USER LIST 〕
│
├ 📦 Total Active : ${users.length}
├ 📄 Showing      : ${Math.min(limit, users.length)}
│
╰━━
`.trim()

    for (let i = 0; i < Math.min(limit, users.length); i++) {
      let u = users[i]

      let name = u.name || await conn.getName(u.jid)

      let remaining = u.plusTime - Date.now()

      text += `

┌─〔 ${i + 1} 〕
│ 👤 ${name}
│ 📱 ${u.jid.split('@')[0]}
│ ⏳ ${formatTime(remaining)}
└──────────────`
    }

    await conn.reply(m.chat, text, m)

  } catch (e) {
    console.log(e)
    m.reply('❌ Error: ' + e.message)
  }
}

handler.help = ['pluslist']
handler.tags = ['info']
handler.command = /^(cekplus|listplus|pluslist)$/i

export default handler

// =========================
// TIME FORMAT FIXED
// =========================
function formatTime(ms) {
  if (ms <= 0) return 'EXPIRED'

  let d = Math.floor(ms / 86400000)
  let h = Math.floor(ms / 3600000) % 24
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60

  return `${d}d ${h}h ${m}m ${s}s`
}