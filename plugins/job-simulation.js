// 💫 Name Fitur : job simulation
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 









let handler = async (m, { command, text }) => {
  let user = global.db.data.users[m.sender]

  if (!user.job) {
    user.job = {
      role: "pengangguran",
      salary: 0,
      exp: 0
    }
  }

  let j = user.job

  if (command === "job") {
    return m.reply(`
🧑‍💼 JOB SYSTEM

💼 Role: ${j.role}
💰 Salary: ${j.salary}
📊 EXP: ${j.exp}

Command:
.apply
.work
.promote
`)
  }

  if (command === "apply") {
    let jobs = ["kurir", "kasir", "programmer", "manager"]
    let pick = jobs[Math.floor(Math.random() * jobs.length)]

    j.role = pick
    j.salary = Math.floor(Math.random() * 3000) + 1000

    return m.reply(`📄 Kamu diterima sebagai ${pick}`)
  }

  if (command === "work") {
    let earn = j.salary + Math.floor(Math.random() * 500)

    j.exp += 1

    return m.reply(`💼 Kamu kerja dan dapat Rp${earn}`)
  }

  if (command === "promote") {
    if (j.exp < 5) return m.reply("❌ EXP kurang")

    j.salary += 1000
    j.exp = 0

    return m.reply("📈 Kamu dipromosikan!")
  }
}

handler.help = ["job", "apply", "work", "promote"]
handler.tags = ["rpg"]
handler.command = /^(job|apply|work|promote)$/i
export default handler