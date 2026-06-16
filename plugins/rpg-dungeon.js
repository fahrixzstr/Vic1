//// CODE BY FAHRIXZ
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g


import fs from "fs"

const handler = async (m, { conn, usedPrefix, command, text }) => {
  conn.dungeon = conn.dungeon || {}
  conn.raid = conn.raid || {}
  conn.party = conn.party || {}
  conn.guildWar = conn.guildWar || {}

  global.db.data.guilds = global.db.data.guilds || {}

  const user = global.db.data.users[m.sender]
  if (!user) return m.reply("User tidak ditemukan")

  // =========================
  // INIT USER V90
  // =========================
  user.skill ||= { atk: 1, def: 1, hp: 1, crit: 0 }
  user.guild ||= ""
  user.partyId ||= ""
  user.permadeath ||= false
  user.money ||= 0
  user.exp ||= 0
  user.health ||= 100
  user.raidCooldown ||= 0
  user.lastDungeon ||= 0

  // =========================
  // COMMAND SPLIT
  // =========================
  const cmd = text?.split(" ")[0]

  // =========================
  // 🏰 GUILD SYSTEM V90
  // =========================
  if (cmd === "guildcreate") {
    if (user.guild) return m.reply("Kamu sudah punya guild")

    let id = "guild-" + Date.now()
    global.db.data.guilds[id] = {
      name: text.split(" ").slice(1).join(" ") || "NoName Guild",
      owner: m.sender,
      members: [m.sender],
      level: 1,
      exp: 0,
      warScore: 0,
      warStatus: "peace"
    }

    user.guild = id
    user.guildRole = "leader"

    return m.reply("🏰 Guild dibuat: " + global.db.data.guilds[id].name)
  }

  // =========================
  // ⚔️ GUILD WAR SYSTEM
  // =========================
  if (cmd === "guildwar") {
    let [g1, g2] = text.split(" ").slice(1)

    if (!global.db.data.guilds[g1] || !global.db.data.guilds[g2])
      return m.reply("Guild tidak valid")

    conn.guildWar[g1 + g2] = {
      g1,
      g2,
      score1: 0,
      score2: 0,
      state: "WAR"
    }

    return m.reply("⚔️ Guild War dimulai!")
  }

  // =========================
  // 🧑‍🤝‍🧑 PARTY SYSTEM
  // =========================
  if (cmd === "party") {
    let id = "party-" + Date.now()

    conn.party[id] = {
      leader: m.sender,
      members: [m.sender],
      buff: 1.1
    }

    user.partyId = id
    return m.reply("🧑‍🤝‍🧑 Party dibuat")
  }

  // =========================
  // 🧬 SKILL TREE V90
  // =========================
  if (cmd === "skill") {
    let type = text.split(" ")[1]

    let cost = 1000 * user.skill[type]

    if (user.money < cost) return m.reply("Money tidak cukup")

    user.money -= cost

    if (type === "atk") user.skill.atk++
    if (type === "def") user.skill.def++
    if (type === "hp") user.skill.hp++
    if (type === "crit") user.skill.crit += 5

    return m.reply(`🧬 ${type} upgraded`)
  }

  // =========================
  // 🛒 MARKET SYSTEM
  // =========================
  if (cmd === "shop") {
    return m.reply(`
🛒 MARKET V90
🗡 Sword - 5000
🥼 Armor - 7000
💊 Potion - 1000
🧬 Skill Reset - 20000
`)
  }

  // =========================
  // 🐉 RAID BOSS V90
  // =========================
  if (cmd === "raid") {
    let raid = Object.values(conn.raid).find(r => r.players.length < 20)

    if (!raid) {
      raid = {
        id: "raid-" + Date.now(),
        hp: 150000,
        phase: 1,
        players: [],
        loot: { exp: 8000, money: 15000 }
      }

      conn.raid[raid.id] = raid
    }

    if (raid.players.includes(m.sender))
      return m.reply("Sudah ikut raid")

    if (Date.now() < user.raidCooldown)
      return m.reply("Cooldown raid")

    raid.players.push(m.sender)

    m.reply(`🐉 Raid Boss HP: ${raid.hp} | Players ${raid.players.length}/20`)

    if (raid.players.length >= 20) startRaidV90(conn, raid, m.chat)

    return
  }

  // =========================
  // 🏰 DUNGEON V90
  // =========================
  let id = "dungeon-" + Date.now()

  const map = getMapV90()
  const difficulty = Math.floor(Math.random() * 3) + 1

  const room = {
    id,
    map,
    difficulty,
    players: [m.sender],
    state: "WAITING",
    reward: {
      money: rand(2000, 8000) * difficulty,
      exp: rand(1000, 4000) * difficulty
    }
  }

  conn.dungeon[id] = room

  m.reply(`🏰 Dungeon V90 Created
📍 Map: ${map}
⚔️ Difficulty: ${difficulty}`)

  setTimeout(() => {
    if (conn.dungeon[id]) {
      startDungeonV90(conn, conn.dungeon[id], m.chat)
    }
  }, 10000)
}

// =========================
// 🐉 RAID V90 ENGINE (PHASE SYSTEM)
// =========================
async function startRaidV90(conn, raid, chat) {
  raid.state = "FIGHT"

  let interval = setInterval(() => {
    let dmg = raid.players.length * rand(80, 150)

    raid.hp -= dmg

    if (raid.hp < 100000 && raid.phase === 1) {
      raid.phase = 2
    }

    if (raid.hp < 50000 && raid.phase === 2) {
      raid.phase = 3
    }

    if (raid.hp <= 0) {
      clearInterval(interval)
      endRaidV90(conn, raid, chat)
    }
  }, 2000)
}

async function endRaidV90(conn, raid, chat) {
  const users = global.db.data.users

  for (let p of raid.players) {
    let u = users[p]
    if (!u) continue

    u.exp += raid.loot.exp
    u.money += raid.loot.money
    u.raidCooldown = Date.now() + 3600000
  }

  await conn.sendMessage(chat, {
    text: "🐉 RAID BOSS DEFEATED!"
  })

  delete conn.raid[raid.id]
}

// =========================
// 🏰 DUNGEON V90 ENGINE
// =========================
async function startDungeonV90(conn, room, chat) {
  const users = global.db.data.users

  let base = room.difficulty * rand(20, 80)

  for (let p of room.players) {
    let u = users[p]
    if (!u) continue

    let aiDmg = enemyAI(room.difficulty, u.skill.atk)

    u.health -= aiDmg.dmg + base

    if (u.health <= 0 && u.permadeath) {
      u.money = 0
      u.exp = 0
      u.guild = ""
    }

    u.exp += room.reward.exp
    u.money += room.reward.money
    u.lastDungeon = Date.now()
  }

  await conn.sendMessage(chat, {
    text: `🏰 Dungeon Clear!\n📍 Map: ${room.map}`
  })

  delete conn.dungeon[room.id]
}

// =========================
// 🧠 AI SYSTEM V90
// =========================
function enemyAI(level, atk) {
  let base = level * 25
  let crit = Math.random() < 0.2

  let dmg = base - atk * 2

  if (crit) dmg *= 2

  return { dmg: dmg < 0 ? 5 : dmg }
}

// =========================
// 🗺️ MAP SYSTEM
// =========================
function getMapV90() {
  const maps = [
    "🌲 Cursed Forest",
    "🏜 Sand Temple Ruins",
    "❄ Frozen Abyss",
    "🌋 Volcano Core",
    "🏰 Dark Ancient Castle"
  ]
  return maps[Math.floor(Math.random() * maps.length)]
}

// =========================
// UTIL
// =========================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

handler.help = [
  "dungeon",
  "raid",
  "guildcreate",
  "guildwar",
  "party",
  "skill",
  "shop"
]

handler.tags = ["rpg"]
handler.command = /^(dungeon|raid|guildcreate|guildwar|party|skill|shop)$/i
handler.rpg = true
handler.group = true

export default handler