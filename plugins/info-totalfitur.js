let handler = async (m, { conn }) => {
  try {
    let plugins = Object.values(global.plugins)

    // =========================
    // TOTAL FITUR & COMMAND
    // =========================
    let totalFitur = plugins.filter(v => v.help && v.tags && !v.disabled).length

    let totalCommand = plugins
      .map(v => v.command)
      .filter(v => v)
      .map(v => Array.isArray(v) ? v.length : 1)
      .reduce((a, b) => a + b, 0)

    // =========================
    // FEATURE BREAKDOWN
    // =========================
    let tags = {}

    plugins.forEach(v => {
      if (v.tags) {
        let t = Array.isArray(v.tags) ? v.tags : [v.tags]
        t.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1
        })
      }
    })

    // =========================
    // MOST USED COMMAND
    // =========================
    let stats = global.db.data.stats || {}

    let topUsed = Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    let uptime = process.uptime()
    let h = Math.floor(uptime / 3600)
    let m = Math.floor((uptime % 3600) / 60)
    let s = Math.floor(uptime % 60)

    // =========================
    // DASHBOARD UI
    // =========================
    let teks = `
╔════════════════════════════╗
║   📊 *BOT ANALYTICS PANEL*   ║
╚════════════════════════════╝

┌─ ⚙️ *SYSTEM INFO*
│ 🔧 Fitur      : ${totalFitur}
│ 📖 Command    : ${totalCommand}
│ ⏱ Uptime      : ${h}h ${m}m ${s}s
└────────────────────────────

┌─ 📂 *FEATURE BREAKDOWN*
${Object.entries(tags).map(([k, v]) => `│ ${k.padEnd(10)} : ${v}`).join('\n')}
└────────────────────────────

┌─ 🔥 *MOST USED COMMAND*
${topUsed.length ? topUsed.map((v, i) => `│ ${i + 1}. ${v[0]} → ${v[1]}x`).join('\n') : '│ No data'}
└────────────────────────────
`.trim()

    await conn.sendMessage(
      m.chat,
      { text: teks },
      { quoted: global.fkontak || m }
    )

  } catch (e) {
    m.reply('❌ Error analytics system.')
  }
}

handler.help = ['analytics']
handler.tags = ['info']
handler.command = /^analytics$/i

export default handler