// 💫 Name Fitur : Multiverse Mode
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 

let handler = async (m, { conn, command }) => {
  let user = global.db.data.users[m.sender]

  if (!user.multiverse) {
    user.multiverse = {
      world: "earth-1",
      portal: 0,
      item: []
    }
  }

  let mv = user.multiverse

  let worlds = {
    "earth-1": { name: "Earth Normal", rate: 1 },
    "earth-2": { name: "Earth Chaos", rate: 2 },
    "shadow-realm": { name: "Shadow Realm", rate: 3 },
    "sky-world": { name: "Sky World", rate: 2 }
  }

  if (command === "world") {
    let w = worlds[mv.world]

    return m.reply(`
🌌 *MULTIVERSE MODE*

🌍 Dunia: ${w.name}
⚡ Drop Rate: x${w.rate}
🌀 Portal: ${mv.portal}
🎒 Item: ${mv.item.length ? mv.item.join(", ") : "Kosong"}

Dunia tersedia:
• earth-1
• earth-2
• shadow-realm
• sky-world

Gunakan:
.worldchange <nama>
.portal
`)
  }

  if (command === "worldchange") {
    let target = (m.text || "").split(" ")[1]
    if (!worlds[target]) return m.reply("❌ Dunia tidak ditemukan")

    mv.world = target
    mv.portal += 1

    return m.reply(`🌀 Kamu berpindah ke ${worlds[target].name}`)
  }

  if (command === "portal") {
    let items = ["rare sword", "magic stone", "dark crystal", "heaven coin"]
    let dropRate = worlds[mv.world].rate

    let chance = Math.random() * 10
    if (chance < dropRate) {
      let item = items[Math.floor(Math.random() * items.length)]
      mv.item.push(item)

      return m.reply(`✨ Kamu menemukan item: ${item}`)
    } else {
      return m.reply("🌌 Portal kosong, tidak ada yang ditemukan")
    }
  }
}

handler.help = ["world", "worldchange", "portal"]
handler.tags = ["rpg"]
handler.command = /^(world|worldchange|portal)$/i
handler.register = true
export default handler