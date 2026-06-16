let handler = async (m, { conn }) => {
  let users = Object.entries(global.db.data.users)
    .map(([jid, data]) => {
      return {
        jid,
        exp: data.exp || 0,
        level: data.level || 0,
        limit: data.limit || 0
      }
    })
    .sort((a, b) => {
      // prioritas XP, lalu level
      return (b.exp + b.level * 1000) - (a.exp + a.level * 1000)
    })
    .slice(0, 10)

  if (!users.length) return m.reply('❌ Data leaderboard kosong.')

  const badge = (i) => {
    if (i === 0) return '🥇 LEGEND'
    if (i === 1) return '🥈 ELITE'
    if (i === 2) return '🥉 PRO'
    return '⭐ USER'
  }

  const progressBar = (value, max) => {
    let percent = max ? value / max : 0
    let filled = Math.round(percent * 10)
    return '█'.repeat(filled) + '░'.repeat(10 - filled)
  }

  let maxExp = users[0]?.exp || 1

  let teks = `
╔════════════════════════════╗
║   🌍 *TOP GLOBAL LEADERBOARD*   ║
║   ⚡ XP • LEVEL • LIMIT SYSTEM   ║
╚════════════════════════════╝
`.trim()

  for (let i = 0; i < users.length; i++) {
    let u = users[i]
    let name = conn.getName(u.jid) || u.jid.split('@')[0]

    teks += `
┌─ RANK #${i + 1} ${badge(i)}
│ 👤 Name   : ${name}
│ ⚡ XP     : ${u.exp}
│ 📊 Level  : ${u.level}
│ 🎯 Limit  : ${u.limit}
│ 📈 XP Bar : ${progressBar(u.exp, maxExp)}
└────────────────────────────
`
  }

  teks += `
╔════════════════════════════╗
║   🧠 System : Global DB Rank   ║
║   🚀 Mode   : Live Tracking     ║
╚════════════════════════════╝
`.trim()

  await conn.sendMessage(
    m.chat,
    { text: teks },
    { quoted: global.fkontak || m }
  )
}

handler.help = ['topglobal']
handler.tags = ['info']
handler.command = /^topglobal$/i
handler.limit = false

export default handler