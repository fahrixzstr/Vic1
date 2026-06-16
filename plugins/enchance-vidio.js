// 💫 Name Fitur : ENCHANCE VIDIO 
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { VIDEO_PRESET } from "../library/libvideoEnhanceConfig.js"

const db = global.db?.data?.users || {}

let handler = async (m, { conn, args }) => {
  let user = db[m.sender] || (db[m.sender] = {
    premium: false,
    limit: {},
    last2kFree: 0
  })

  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ""

  if (!args[0]) {
    let list = Object.keys(VIDEO_PRESET).map(v => `• ${v}`).join("\n")

    return m.reply(`
🎬 *VIDEO AI ENHANCE SYSTEM*

📌 FORMAT:
.resvid <mode>

📊 AVAILABLE MODE:
${list}

━━━━━━━━━━━━━━
🆓 FREE vs 💎 PLUS SYSTEM ACTIVE
    `)
  }

  if (!mime.includes("video")) return m.reply("❌ Reply video dulu")

  let mode = args[0].toLowerCase()
  let cfg = VIDEO_PRESET[mode]

  if (!cfg) return m.reply("❌ Mode tidak ditemukan")

  // =========================
  // LIMIT SYSTEM
  // =========================
  let used = user.limit[mode] || 0

  // special 2k free rule
  if (mode === "2k-30" && !user.premium) {
    let now = Date.now()
    let week = cfg.cooldown

    if (user.last2kFree && now - user.last2kFree < week) {
      return m.reply("⏳ 2K FREE masih cooldown 3 minggu. Upgrade PLUS untuk akses.")
    }

    user.last2kFree = now
  }

  if (used >= cfg.limit) {
    return m.reply(`❌ Limit habis untuk mode ${mode}\nLimit: ${cfg.limit}`)
  }

  // premium lock
  if (cfg.premium && !user.premium) {
    return m.reply(`
🔒 MODE PLUS REQUIRED

${cfg.name}

Upgrade untuk akses:
• FPS tinggi (60 - 120)
• 4K - 8K rendering
• PRO cinematic AI
    `)
  }

  let buffer = await q.download()

  let input = path.join("./tmp", Date.now() + "_in.mp4")
  let output = path.join("./tmp", Date.now() + "_out.mp4")

  fs.writeFileSync(input, buffer)

  await m.react("⏳")

  let cmd = `
ffmpeg -i ${input} \
-vf "scale=iw*1.5:ih*1.5,unsharp=5:5:1.0,fps=${cfg.fps}" \
-c:v libx264 -crf ${cfg.crf} -preset slow \
${output}
`

  exec(cmd, async (err) => {
    if (err) return m.reply("❌ Gagal render video")

    let result = fs.readFileSync(output)

    user.limit[mode] = used + 1

    await conn.sendMessage(m.chat, {
      video: result,
      caption: `
🎬 VIDEO AI ENHANCE DONE

📊 MODE: ${cfg.name}
⚡ FPS: ${cfg.fps}
📉 LIMIT USED: ${user.limit[mode]}/${cfg.limit}
💎 STATUS: ${user.premium ? "PLUS USER" : "FREE USER"}
      `.trim()
    }, { quoted: m })

    fs.unlinkSync(input)
    fs.unlinkSync(output)

    await m.react("✅")
  })
}

handler.command = /^resvid|videoup|videoenhance$/i
handler.help = ["resvid"]
handler.tags = ["ai", "premium"]
handler.limit = true

export default handler