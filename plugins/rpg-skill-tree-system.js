// 💫 Name Fitur : tree skill system
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 

let handler = async (m, { command }) => {
  let user = global.db.data.users[m.sender]

  if (!user.skill) {
    user.skill = {
      combat: 1,
      trading: 1,
      intelligence: 1,
      luck: 1,
      job: "pengangguran"
    }
  }

  let s = user.skill

  if (command === "skill") {
    return m.reply(`
🧬 SKILL TREE

⚔️ Combat: ${s.combat}
💰 Trading: ${s.trading}
🧠 Intelligence: ${s.intelligence}
🍀 Luck: ${s.luck}
💼 Job: ${s.job}

Upgrade:
.train
.evolve
`)
  }

  if (command === "train") {
    let type = ["combat", "trading", "intelligence", "luck"][Math.floor(Math.random() * 4)]
    s[type] += 1

    return m.reply(`📈 Skill ${type} naik +1`)
  }

  if (command === "evolve") {
    if (s.combat >= 5 && s.trading >= 5) {
      s.job = "manager"
    }
    if (s.intelligence >= 8) {
      s.job = "ceo"
    }

    return m.reply(`🔄 Job sekarang: ${s.job}`)
  }
}

handler.help = ["skill", "train", "evolve"]
handler.tags = ["rpg"]
handler.command = /^(skill|train|evolve)$/i
export default handler