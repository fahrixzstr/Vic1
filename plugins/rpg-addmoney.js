/*
📌 Nama Fitur: Add Money (Upgrade)
🏷️ Type : Plugin ESM
✍️ Convert & Upgrade By FahriXz
🔗 Saluran : https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
*/

let handler = async (m, { conn, args }) => {
    const wm = "FahriXz | https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g"

    const who = m.mentionedJid?.[0]
        ? m.mentionedJid[0]
        : args[0]
            ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'
            : m.sender

    if (!global.db?.data?.users) global.db.data = { users: {} }

    if (!global.db.data.users[who]) {
        global.db.data.users[who] = { money: 0 }
    }

    const user = global.db.data.users[who]

    if (!args[1]) {
        return m.reply(`📌 Contoh penggunaan:\n.addmoney @tag 10000\n.addmoney 62812xxxx 5000`)
    }

    let jumlah = parseInt(args[1])
    if (isNaN(jumlah) || jumlah <= 0) {
        return m.reply('❌ Jumlah harus berupa angka valid.')
    }

    if (!user.money) user.money = 0
    user.money += jumlah

    conn.reply(
        m.chat,
        `
💵 *MONEY BERHASIL DITAMBAHKAN*

👤 Target : @${who.split('@')[0]}
➕ Money  : ${jumlah}
💰 Total  : ${user.money}

${wm}
        `.trim(),
        m,
        { mentions: [who] }
    )
}

handler.help = ['addmoney @user/nomor jumlah']
handler.tags = ['owner', 'rpg']
handler.command = /^addmoney$/i
handler.rowner = true
handler.rpg = true

export default handler