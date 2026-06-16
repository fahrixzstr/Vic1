// 💫 Name Fitur : Bose Dungeon
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 



let boss = null

let handler = async (m, { command }) => {
  let user = global.db.data.users[m.sender]

  if (command === "boss") {
    if (!boss) {
      boss = {
        name: "Dark Dragon",
        hp: 1000,
        reward: 5000,
        damage: {}
      }

      return m.reply("🐉 Boss muncul: Dark Dragon!")
    }

    return m.reply(`🐉 Boss: ${boss.name}\n❤️ HP: ${boss.hp}`)
  }

  if (command === "attackboss") {
    if (!boss) return m.reply("❌ Tidak ada boss")

    let dmg = Math.floor(Math.random() * 200)
    boss.hp -= dmg

    boss.damage[m.sender] = (boss.damage[m.sender] || 0) + dmg

    if (boss.hp <= 0) {
      let winner = Object.entries(boss.damage).sort((a,b) => b[1]-a[1])[0]

      boss = null
      return m.reply(`🏆 Boss dikalahkan!\n🥇 Top Damage: ${winner[0]}`)
    }

    return m.reply(`⚔️ Kamu hit ${dmg} damage`)
  }
}

handler.help = ["boss", "attackboss"]
handler.tags = ["rpg"]
handler.command = /^(boss|attackboss)$/i
export default handler