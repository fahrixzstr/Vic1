let handler = async (m, { conn }) => {

  let user = global.db.data.users[m.sender]

  user.lastclaim = user.lastclaim || 0
  user.money = user.money || 0
  user.exp = user.exp || 0

  let now = Date.now()
  let cd = 45 * 60 * 1000 // 45 menit cooldown

  let timeLeft = cd - (now - user.lastclaim)

  if (now - user.lastclaim < cd) {
    return m.reply(`⏳ Lu udah ambil gaji hari ini.

Tunggu: *${formatTime(timeLeft)}* lagi`)
  }

  let money = 50000 + rand(0, 20000)
  let exp = rand(50, 150)

  user.money += money
  user.exp += exp
  user.lastclaim = now

  m.reply(`💰 GAJI BERHASIL DIAMBIL

+ Rp ${money.toLocaleString()}
+ ${exp} EXP`)
}

handler.help = ['gaji', 'gajian']
handler.tags = ['rpg']
handler.command = /^(gaji|gajian)$/i
handler.register = true
handler.group = true
handler.rpg = true

export default handler

// =========================
// UTILITIES
// =========================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatTime(ms) {
  if (ms <= 0) return '00:00:00'

  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}