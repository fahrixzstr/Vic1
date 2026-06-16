// 💫 Name Fitur : Government Sistem
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 


let handler = async (m, { command, text }) => {
  let user = global.db.data.users[m.sender]

  if (!user.gov) {
    user.gov = {
      role: "citizen",
      votes: 0,
      tax: 10,
      corruption: 0,
      city: "neo-city"
    }
  }

  let g = user.gov

  if (command === "gov") {
    return m.reply(`
🏛️ GOVERNMENT SYSTEM

👤 Role: ${g.role}
🏙️ City: ${g.city}
🗳️ Votes: ${g.votes}
💰 Tax Rate: ${g.tax}%
⚠️ Corruption: ${g.corruption}%

Command:
.vote
.candidate
.settax <angka>
.audit
`)
  }

  if (command === "candidate") {
    if (g.role !== "citizen") return m.reply("❌ Kamu sudah pejabat")

    g.role = "candidate"
    return m.reply("🗳️ Kamu sekarang kandidat pemilu!")
  }

  if (command === "vote") {
    let target = text?.trim()
    if (!target) return m.reply("Contoh: .vote @user")

    g.votes += 1
    return m.reply("🗳️ Vote berhasil diberikan")
  }

  if (command === "settax") {
    let val = parseInt(text)
    if (!val) return m.reply("Masukkan angka")

    if (g.role !== "mayor" && g.role !== "president")
      return m.reply("❌ Hanya pejabat bisa set pajak")

    g.tax = val
    return m.reply(`💰 Pajak diubah jadi ${val}%`)
  }

  if (command === "audit") {
    let result = Math.random()

    if (result > 0.7) {
      g.corruption += 1
      return m.reply("⚠️ Audit menemukan indikasi korupsi!")
    }

    return m.reply("✅ Audit bersih")
  }
}

handler.help = ["gov", "candidate", "vote", "settax", "audit"]
handler.tags = ["rpg"]
handler.command = /^(gov|candidate|vote|settax|audit)$/i
export default handler