// 💫 Name Fitur : Fate Luck system
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 


let handler = async (m, { command }) => {
  let user = global.db.data.users[m.sender]

  if (!user.fate) {
    user.fate = {
      karma: 0,
      blessing: 0,
      curse: 0
    }
  }

  let f = user.fate

  if (command === "fate") {
    let roll = Math.random()

    if (roll > 0.7) {
      f.blessing += 1
      return m.reply("✨ Kamu mendapat blessing!")
    } else if (roll < 0.3) {
      f.curse += 1
      return m.reply("☠️ Kamu terkena curse!")
    } else {
      f.karma += 1
      return m.reply("⚖️ Nasib netral")
    }
  }

  if (command === "karma") {
    return m.reply(`
🔮 FATE STATUS

⚖️ Karma: ${f.karma}
✨ Blessing: ${f.blessing}
☠️ Curse: ${f.curse}
`)
  }
}

handler.help = ["fate", "karma"]
handler.tags = ["rpg"]
handler.command = /^(fate|karma)$/i
export default handler