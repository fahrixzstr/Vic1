    // CODE BY FAHRIXZ
    // FITUR RPG KURIR EXPEDISI 
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g    



let handler = async (m, { conn, usedPrefix, command }) => {

  let user = global.db.data.users[m.sender]

  user.money = user.money || 0
  user.exp = user.exp || 0
  user.lastkurir = user.lastkurir || 0

  let now = Date.now()
  let cd = 5 * 60 * 1000 // 5 menit cooldown

  if (now - user.lastkurir < cd) {
    let sisa = formatTime(cd - (now - user.lastkurir))
    return m.reply(`🚚 Kurir sedang istirahat

Tunggu: *${sisa}*`)
  }

  // =========================
  // EKSPEDISI LIST
  // =========================
  const ekspedisi = [
    { nama: 'J&T Express', min: 20000, max: 50000, risk: 10 },
    { nama: 'SPX (Shopee Express)', min: 15000, max: 40000, risk: 15 },
    { nama: 'JNE', min: 25000, max: 60000, risk: 8 },
    { nama: 'Ninja Xpress', min: 30000, max: 70000, risk: 12 }
  ]

  let paket = ekspedisi[Math.floor(Math.random() * ekspedisi.length)]

  let successChance = 100 - paket.risk
  let roll = rand(1, 100)

  user.lastkurir = now

  // =========================
  // GAGAL KIRIM
  // =========================
  if (roll > successChance) {

    let penalty = rand(5000, 20000)
    user.money = Math.max(0, user.money - penalty)

    return m.reply(`📦 PAKET GAGAL DIANTAR

🚚 Ekspedisi: ${paket.nama}
💥 Paket hilang / rusak di jalan

💸 Kamu rugi: -Rp ${penalty.toLocaleString()}

⚠️ Coba lagi nanti!`)
  }

  // =========================
  // SUKSES KIRIM
  // =========================
  let reward = rand(paket.min, paket.max)
  let exp = rand(20, 80)

  user.money += reward
  user.exp += exp

  let status = pick([
    'Delivered',
    'On the way',
    'Arrived at sorting center',
    'Successfully delivered'
  ])

  m.reply(`🚚 PAKET TERKIRIM!

📦 Ekspedisi: ${paket.nama}
📊 Status: ${status}

💰 +Rp ${reward.toLocaleString()}
✨ +${exp} EXP`)
}

handler.help = ['kurir']
handler.tags = ['rpg']
handler.command = /^(kurir|antarpaket|delivery)$/i
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

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function formatTime(ms) {
  let m = Math.floor(ms / 60000)
  let s = Math.floor(ms / 1000) % 60
  return `${m} menit ${s} detik`
}