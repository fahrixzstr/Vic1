// 💫 Name Fitur : ai live photo
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 


import fs from "fs"
import path from "path"
import { exec } from "child_process"

const MIN_DURATION = 1.5

let handler = async (m, { conn }) => {
  let q = m.quoted || m
  let mime = (q.msg || q).mimetype || ""

  if (!mime.includes("video")) {
    return m.reply("❌ Kirim / reply video minimal 1.5 detik")
  }

  await m.react("⏳")

  let buffer = await q.download()

  let input = path.join("./tmp", Date.now() + "_in.mp4")
  let frame = path.join("./tmp", Date.now() + "_frame.jpg")
  let live = path.join("./tmp", Date.now() + "_live.mp4")
  let upscale = path.join("./tmp", Date.now() + "_2k.jpg")

  fs.writeFileSync(input, buffer)

  // =========================
  // 1. CEK DURASI VIDEO
  // =========================
  let getDuration = await new Promise((resolve, reject) => {
    exec(`ffprobe -i ${input} -show_entries format=duration -v quiet -of csv="p=0"`, (err, stdout) => {
      if (err) return reject(err)
      resolve(parseFloat(stdout))
    })
  })

  if (getDuration < MIN_DURATION) {
    fs.unlinkSync(input)
    return m.reply("❌ Minimal video 1.5 detik")
  }

  // =========================
  // 2. AMBIL FRAME UTAMA
  // =========================
  let cmdFrame = `
ffmpeg -i ${input} -vf "select=eq(n\\,10)" -q:v 2 ${frame}
`

  // =========================
  // 3. BUAT LIVE MOTION LOOP (60 FPS SIMULATION)
  // =========================
  let cmdLive = `
ffmpeg -i ${input} \
-vf "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmc=1,scale=1280:720" \
-c:v libx264 -crf 18 -preset slow ${live}
`

  // =========================
  // 4. UPSCALE FRAME KE 2K
  // =========================
  let cmdUpscale = `
ffmpeg -i ${input} \
-vf "select=eq(n\\,10),scale=2560:1440,unsharp=5:5:1.2" \
-q:v 1 ${upscale}
`

  // RUN ALL PROCESS
  exec(cmdFrame, () => {})
  exec(cmdUpscale, () => {})
  exec(cmdLive, async (err) => {
    if (err) {
      console.log(err)
      return m.reply("❌ Gagal generate live photo AI")
    }

    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(upscale),
      mimetype: "image/jpeg",
      fileName: "AI-LIVE-PHOTO-2K.jpg",
      caption: "📸 AI LIVE PHOTO (2K UPSCALE)"
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      document: fs.readFileSync(live),
      mimetype: "video/mp4",
      fileName: "AI-LIVE-MOTION-60FPS.mp4",
      caption: "🎞 LIVE MOTION (AI 60FPS SIMULATION)"
    }, { quoted: m })

    fs.unlinkSync(input)
    fs.unlinkSync(frame)
    fs.unlinkSync(live)
    fs.unlinkSync(upscale)

    await m.react("✅")
  })
}

handler.command = /^livephoto|ailive|motionphoto$/i
handler.tags = ["ai", "media"]
handler.help = ["livephoto"]
handler.limit = true

export default handler