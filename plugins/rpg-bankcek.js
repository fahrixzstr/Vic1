/*
📌 Nama Fitur: Bank Info (Upgrade v3)
🏷️ Type : Plugin ESM
✍️ Upgrade By FahriXz
🔗 Saluran : https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
*/

const handler = async (m, { conn }) => {
  const who = m.mentionedJid?.[0]
    ? m.mentionedJid[0]
    : m.fromMe
      ? conn.user.jid
      : m.sender

  if (!global.db?.data?.users) global.db.data = { users: {} }

  global.db.data.users[who] ??= {
    money: 0,
    bank: 0,
    chip: 0,
    atm: 0,
    fullatm: 1000000,
    robo: 0,
    level: 0,
    registered: false,
    plusTime: 0,
    name: null
  }

  const user = global.db.data.users[who]

  const devs = (global.fahriown || [])
    .filter(([_, __, isDev]) => isDev)
    .map(([num]) => num.replace(/\D/g, '') + '@s.whatsapp.net')

  const owners = (global.fahriown || [])
    .filter(([_, __, isDev]) => !isDev)
    .map(([num]) => num.replace(/\D/g, '') + '@s.whatsapp.net')

  const isMods = devs.includes(who)
  const isOwner = m.fromMe || isMods || owners.includes(who)
  const isPlus = isOwner || (user.plusTime && Date.now() < user.plusTime)

  // 🔁 PREMIUM → PLUS (RULE)
  const status =
    isMods ? "Developer" :
    isOwner ? "Owner" :
    isPlus ? "Plus User" :
    user.level >= 1000 ? "Elite User" :
    "Free User"

  const progress = Math.min(
    100,
    Math.floor(((user.bank || 0) / (user.fullatm || 1)) * 100)
  )

  const name = user.name || conn.getName(who)

  const text = `
🏦 *BANK INFO*

👤 Name      : ${name}
📊 Status    : ${status}
🧾 Register  : ${user.registered ? "Yes" : "No"}

💰 Money     : ${toID(user.money)}
🏦 Bank      : ${toID(user.bank)} / ${toID(user.fullatm)}
📈 Progress   : ${progress}%

💳 ATM Level  : ${user.atm || 0}
🤖 Robo Level : ${user.robo || 0}
💠 Chip       : ${toID(user.chip)}
📊 Level      : ${user.level}

`.trim()

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      externalAdReply: {
        title: "BANK INFO SYSTEM",
        body: "FahriXz",
        mediaType: 1,
        renderLargerThumbnail: true,
        thumbnailUrl: "https://files.catbox.moe/c67nx0.jpg",
        sourceUrl: global.config?.website || "",
        mediaUrl: randomImg() + "BANK INFO"
      }
    }
  }, { quoted: m })
}

handler.help = ['bankcek']
handler.tags = ['rpg']
handler.command = /^(bankcek)$/i
handler.register = true
handler.group = true
handler.rpg = true

export default handler

// UTIL
function toID(n = 0) {
  return Number(n || 0).toLocaleString('id-ID')
}

function randomImg() {
  const img = [
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=water-logo&text=',
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=crafts-logo&text=',
    'https://flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=amped-logo&text='
  ]
  return img[Math.floor(Math.random() * img.length)]
}