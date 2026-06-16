let handler = async (m, { conn }) => {
  try {

    let user = global.db.data.users[m.sender]

    // =========================
    // SAFE INIT USER
    // =========================
    if (!user) {
      global.db.data.users[m.sender] = {
        money: 0,
        limit: 0,
        level: 1,
        exp: 0
      }
      user = global.db.data.users[m.sender]
    }

    // =========================
    // APPLY CHEAT VALUES
    // =========================
    Object.assign(user, {
      money: 99999999999,
      limit: 9999,
      level: 232,
      exp: 99999999,

      sampah: 999999,
      potion: 999999,
      common: 999999,
      uncommon: 999999,
      mythic: 999999,
      legendary: 999999,

      diamond: 999999,
      poinxp: 999999,
      bank: 999999999
    })

    // =========================
    // RESPONSE
    // =========================
    await conn.reply(
      m.chat,
      `
╭━━〔 💰 CHEAT SUCCESS 〕
│
├ 💸 Money   : MAX
├ 🎯 Limit   : MAX
├ ⚡ Level   : 232
├ 📊 EXP     : MAX
│
╰━━
⚡ Victoria MD System
`.trim(),
      m
    )

  } catch (e) {
    console.log(e)
    m.reply('❌ Cheat error: ' + e.message)
  }
}

handler.command = /^(own-cheat|cheat-own|o-cheat|cit)$/i
handler.owner = true
handler.group = true

export default handler