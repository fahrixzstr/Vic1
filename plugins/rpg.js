/*
📌 Nama Fitur: Dungeon RPG EXTREME
🏷️ Type : Plugin ESM
✍️ Convert & Upgrade By FahriXz
🌐 Channel: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
*/

import fs from 'fs'

const USER_DB = './user.json'
const DUNGEON_DB = './dungeon.json'

const SIZE = 10
const MAX_HP = 100
const BASE_ATK = 5

/* ================= UTIL ================= */
const load = (f, d = {}) => fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : d
const save = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2))

function getUsers() {
  return load(USER_DB, {})
}
function getDungeon() {
  return load(DUNGEON_DB, { map: {}, players: {} })
}

/* ================= CORE ================= */
const handler = async (m, { conn, args }) => {
  let users = getUsers()
  let dungeon = getDungeon()
  let id = m.sender.split('@')[0]
  let sub = args[0]?.toLowerCase()

  if (!users[id]) users[id] = { balance: 0, dungeons: {} }
  if (!users[id].dungeons) users[id].dungeons = {}

  /* ================= START ================= */
  if (sub === 'start') {
    if (users[id].dungeons.active) {
      return m.reply('⚠️ Kamu sudah di dungeon!')
    }

    let name = args[1]
    if (!name) return m.reply('Contoh: .dungeon start Hero')

    users[id].dungeons = {
      active: true,
      name,
      x: 0,
      y: 0,
      hp: MAX_HP,
      maxHp: MAX_HP,
      lvl: 1,
      xp: 0,
      gold: 0,
      inv: [],
      weapon: null,
      armor: null,
      kd: false,
      kdTurn: 0
    }

    dungeon.players[id] = {
      name,
      x: 0,
      y: 0,
      hp: MAX_HP,
      lvl: 1
    }

    save(USER_DB, users)
    save(DUNGEON_DB, dungeon)

    return m.reply(`🧭 *DUNGEON EXTREME STARTED!*
👤 Player: ${name}
📍 Position: (0,0)
❤️ HP: ${MAX_HP}`)
  }

  /* ================= STATUS ================= */
  if (sub === 'status') {
    let d = users[id].dungeons
    if (!d.active) return m.reply('❌ Kamu belum masuk dungeon')

    return m.reply(`
⚔️ *DUNGEON STATUS*

👤 Name : ${d.name}
❤️ HP : ${d.hp}/${d.maxHp}
⭐ Level : ${d.lvl}
✨ XP : ${d.xp}
💰 Gold : ${d.gold}
🎒 Item : ${d.inv.length}
`)
  }

  /* ================= MOVE ================= */
  if (sub === 'move') {
    let dir = args[1]
    let d = users[id].dungeons

    if (!d.active) return m.reply('❌ Belum start dungeon')
    if (!dir) return m.reply('Contoh: move north/east/south/west')

    let { x, y } = d

    if (dir === 'north') y--
    if (dir === 'south') y++
    if (dir === 'west') x--
    if (dir === 'east') x++

    x = Math.max(0, Math.min(SIZE - 1, x))
    y = Math.max(0, Math.min(SIZE - 1, y))

    d.x = x
    d.y = y

    dungeon.players[id].x = x
    dungeon.players[id].y = y

    save(USER_DB, users)
    save(DUNGEON_DB, dungeon)

    return m.reply(`📍 Kamu pindah ke (${x}, ${y})`)
  }

  /* ================= CHAT ROOM ================= */
  if (sub === 'chat') {
    let msg = args.slice(1).join(' ')
    if (!msg) return m.reply('Contoh: .dungeon chat halo')

    let d = users[id].dungeons
    let sameRoom = []

    for (let p in dungeon.players) {
      if (p !== id) {
        let pl = dungeon.players[p]
        if (pl.x === d.x && pl.y === d.y) {
          sameRoom.push(p)
        }
      }
    }

    if (!sameRoom.length) return m.reply('❌ Tidak ada player lain')

    for (let p of sameRoom) {
      conn.sendMessage(p + '@s.whatsapp.net', {
        text: `💬 CHAT DUNGEON
👤 ${d.name}: ${msg}`
      })
    }

    return m.reply(`📨 Chat terkirim ke ${sameRoom.length} player`)
  }

  /* ================= ATTACK SIMPLE ================= */
  if (sub === 'attack') {
    let d = users[id].dungeons
    if (!d.active) return m.reply('❌ Belum start dungeon')

    let dmg = BASE_ATK + (d.weapon ? 5 : 0)

    let enemy = {
      name: 'Monster Acak',
      hp: 20,
      dmg: 5
    }

    enemy.hp -= dmg
    d.hp -= enemy.dmg

    if (enemy.hp <= 0) {
      d.gold += 50
      d.xp += 10
      return m.reply(`⚔️ Kamu menang! +50 gold`)
    }

    if (d.hp <= 0) {
      d.kd = true
      d.kdTurn = 3
      return m.reply(`💀 Kamu KO! Tunggu bantuan / heal`)
    }

    save(USER_DB, users)
    save(DUNGEON_DB, dungeon)

    return m.reply(`⚔️ Hit!
❤️ HP kamu: ${d.hp}
👹 Enemy HP: ${enemy.hp}`)
  }

  /* ================= EXIT ================= */
  if (sub === 'exit') {
    users[id].dungeons = {}
    delete dungeon.players[id]

    save(USER_DB, users)
    save(DUNGEON_DB, dungeon)

    return m.reply('🚪 Kamu keluar dari dungeon')
  }

  return m.reply(`⚔️ Dungeon Commands:
.start <name>
.status
.move <dir>
.attack
.chat <msg>
.exit`)
}

handler.help = ['dungeon']
handler.tags = ['rpg']
handler.command = /^dungeon$/i

export default handler