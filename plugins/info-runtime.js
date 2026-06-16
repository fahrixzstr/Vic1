import os from 'os'

let handler = async (m, { conn }) => {
  try {
    let uptime = process.uptime()

    let days = Math.floor(uptime / 86400)
    let hours = Math.floor((uptime % 86400) / 3600)
    let minutes = Math.floor((uptime % 3600) / 60)
    let seconds = Math.floor(uptime % 60)

    let totalMem = os.totalmem()
    let freeMem = os.freemem()
    let usedMem = totalMem - freeMem

    let memPercent = ((usedMem / totalMem) * 100).toFixed(1)

    let cpuModel = os.cpus()[0].model
    let cores = os.cpus().length

    let caption = `
╔════════════════════════════╗
║        📊 *BOT DASHBOARD*             ║
╚════════════════════════════╝

┌─ ⏱ *SYSTEM UPTIME*
│ ${days}d ${hours}h ${minutes}m ${seconds}s
└────────────────────────────

┌─ 💻 *SYSTEM INFO*
│ OS        : ${os.platform()} ${os.release()}
│ Arch      : ${os.arch()}
│ NodeJS    : ${process.version}
│ CPU       : ${cpuModel}
│ Core      : ${cores}
└────────────────────────────

┌─ 🧠 *MEMORY USAGE*
│ Total RAM : ${(totalMem / 1024 / 1024).toFixed(0)} MB
│ Used RAM  : ${(usedMem / 1024 / 1024).toFixed(0)} MB
│ Free RAM  : ${(freeMem / 1024 / 1024).toFixed(0)} MB
│ Usage     : ${memPercent}%
└────────────────────────────

┌─ ⚙️ *PROCESS INFO*
│ PID       : ${process.pid}
│ Platform  : ${process.platform}
│ Status    : ONLINE 🟢
└────────────────────────────

╔════════════════════════════╗
║   🚀 *VICTORIA MD DASHBOARD*        ║
╚════════════════════════════╝
`.trim()

    await conn.sendMessage(
      m.chat,
      { text: caption },
      { quoted: global.fkontak || m }
    )

  } catch (e) {
    m.reply('⚠️ Dashboard error saat mengambil data system.')
  }
}

handler.help = ['runtime']
handler.tags = ['info']
handler.command = ['runtime']

export default handler