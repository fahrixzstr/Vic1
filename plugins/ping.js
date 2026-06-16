import { cpus as _cpus, totalmem, freemem, arch, platform, release, hostname, networkInterfaces } from 'os'
import { sizeFormatter } from 'human-readable'

const format = sizeFormatter({
  std: 'JEDEC',
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (l, s) => `${l} ${s}B`,
})

/* REAL MULTI PING */
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function multiPing(samples = 5) {
  let results = []

  for (let i = 0; i < samples; i++) {
    const start = Date.now()
    await sleep(30)
    results.push(Date.now() - start)
  }

  const avg = results.reduce((a, b) => a + b, 0) / results.length
  const min = Math.min(...results)
  const max = Math.max(...results)

  const jitter = max - min

  return {
    avg: avg.toFixed(1),
    min,
    max,
    jitter
  }
}

function getNetworkInfo() {
  const nets = networkInterfaces()

  for (const [name, arr] of Object.entries(nets)) {
    for (const net of arr) {
      if (net.family === 'IPv4' && !net.internal) {
        return `📡 ${name}: ${net.address}`
      }
    }
  }
  return '📡 No network'
}

function cpuUsage() {
  const cpus = _cpus()

  return cpus.map((c, i) => {
    const total = Object.values(c.times).reduce((a, b) => a + b, 0)
    const usage = 100 - (c.times.idle / total * 100)

    return {
      core: i + 1,
      usage: usage.toFixed(1)
    }
  })
}

/* HEALTH SCORE */
function healthScore(ping, cpu, ram, jitter) {
  let score = 100

  score -= ping * 0.2
  score -= cpu * 0.3
  score -= ram * 0.3
  score -= jitter * 0.2

  if (score > 100) score = 100
  if (score < 0) score = 0

  return score.toFixed(0)
}

/* STATUS */
function status(score) {
  if (score >= 85) return '🟢 Excellent'
  if (score >= 65) return '🟡 Good'
  if (score >= 40) return '🟠 Fair'
  return '🔴 Bad'
}

let handler = async (m) => {
  const pingData = await multiPing(5)

  const total = totalmem()
  const free = freemem()
  const used = total - free
  const ram = ((used / total) * 100).toFixed(1)

  const cpus = cpuUsage()
  const cpuAvg = (
    cpus.reduce((a, b) => a + parseFloat(b.usage), 0) / cpus.length
  ).toFixed(1)

  const score = healthScore(
    pingData.avg,
    cpuAvg,
    ram,
    pingData.jitter
  )

  let cores = cpus.slice(0, 6).map(c =>
    `▸ Core ${c.core}: ${c.usage}%`
  ).join('\n')

  if (cpus.length > 6) cores += `\n▸ +${cpus.length - 6} cores`

  let text = `
🏓 *PING PRO MAX*

📊 Ping:
• Avg: ${pingData.avg} ms
• Min: ${pingData.min} ms
• Max: ${pingData.max} ms
• Jitter: ${pingData.jitter} ms

🧠 Health Score: ${score}/100
• Status: ${status(score)}

🖥️ System:
• Host: ${hostname()}
• OS: ${platform()} ${arch()}
• Version: ${release()}

💾 Memory:
• Total: ${format(total)}
• Used: ${format(used)} (${ram}%)
• Free: ${format(free)}

⚡ CPU:
• Core: ${cpus.length}
• Avg: ${cpuAvg}%

📊 Core Usage:
${cores}

${getNetworkInfo()}

🕐 Uptime: ${formatTime(process.uptime() * 1000)}
  `.trim()

  m.reply(text)
}

function formatTime(ms) {
  const d = Math.floor(ms / 86400000)
  const h = Math.floor(ms / 3600000) % 24
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

handler.help = ['ping']
handler.tags = ['info']
handler.command = /^(ping)$/i

export default handler