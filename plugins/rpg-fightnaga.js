let handler = async (m, { conn, participants }) => {

  conn.fightnaga = conn.fightnaga || {}
  let user = global.db.data.users[m.sender]

  if (!user) return m.reply('User tidak ditemukan di database.')

  user.naga = user.naga || 1
  user.money = user.money || 0
  user.tiketcoin = user.tiketcoin || 0

  // =========================
  // ANTI DOUBLE FIGHT
  // =========================
  if (conn.fightnaga[m.sender]) {
    return m.reply('⚠️ Kamu masih dalam proses fight naga lain!')
  }

  // =========================
  // RANDOM OPPONENT (ANTI SELF & INVALID USER)
  // =========================
  let users = participants.map(u => u.id)

  let lawan = users[Math.floor(Math.random() * users.length)]

  while (
    !global.db.data.users[lawan] ||
    lawan === m.sender
  ) {
    lawan = users[Math.floor(Math.random() * users.length)]
  }

  let musuh = global.db.data.users[lawan]
  musuh.naga = musuh.naga || 1

  // =========================
  // DURASI FIGHT
  // =========================
  let duration = rand(5, 15)

  conn.fightnaga[m.sender] = true

  m.reply(`🐉 FIGHT DIMULAI!

${conn.getName(m.sender)} (🐉 ${user.naga})
VS
${conn.getName(lawan)} (🐉 ${musuh.naga})

⏳ Simulasi: ${duration} menit...`)

  await sleep(duration * 60 * 1000)

  // =========================
  // SIMULATION SYSTEM (BALANCED RNG)
  // =========================
  let scoreUser = 0
  let scoreEnemy = 0

  let pool = []

  for (let i = 0; i < user.naga; i++) pool.push(m.sender)
  for (let i = 0; i < musuh.naga; i++) pool.push(lawan)

  for (let i = 0; i < 10; i++) {
    let pick = pool[Math.floor(Math.random() * pool.length)]
    pick === m.sender ? scoreUser++ : scoreEnemy++
  }

  let diff = scoreUser - scoreEnemy

  // =========================
  // RESULT TEXT
  // =========================
  let baseReward = rand(15000, 50000)

  if (diff > 0) {

    let reward = baseReward * diff

    user.money += reward
    user.tiketcoin += 1

    m.reply(`🏆 KAMU MENANG!

🐉 ${conn.getName(m.sender)} [${scoreUser * 10}]
VS
🐉 ${conn.getName(lawan)} [${scoreEnemy * 10}]

💰 Reward: Rp ${reward.toLocaleString()}
🎟️ +1 Tiket Coin

🔥 Alasan: ${pick(winReason())}`)

  } else if (diff < 0) {

    let penalty = Math.abs(diff) * rand(50000, 100000)

    user.money = Math.max(0, user.money - penalty)
    user.tiketcoin += 1

    m.reply(`💀 KAMU KALAH!

🐉 ${conn.getName(m.sender)} [${scoreUser * 10}]
VS
🐉 ${conn.getName(lawan)} [${scoreEnemy * 10}]

💸 Denda: Rp ${penalty.toLocaleString()}
🎟️ +1 Tiket Coin

💀 Penyebab: ${pick(loseReason())}`)

  } else {

    m.reply(`⚖️ HASIL IMBANG!

Tidak ada yang menang.`)
  }

  delete conn.fightnaga[m.sender]
}

// =========================
// UTILITIES
// =========================

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms))
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function winReason() {
  return [
    'Strategi naga sempurna',
    'Latihan intensif',
    'Serangan kritikal',
    'Kekuatan dominan',
    'Skill kontrol tinggi'
  ]
}

function loseReason() {
  return [
    'Kurang latihan',
    'Naga lemah',
    'Strategi buruk',
    'Terlalu percaya diri',
    'Timing serangan salah'
  ]
}

handler.help = ['fightnaga']
handler.tags = ['game']
handler.command = /^(fightnaga)$/i
handler.group = true
handler.limit = true

export default handler