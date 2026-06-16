/*
📌 Nama Fitur: Add EXP (Upgrade)
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

    const user = global.db.data.users[who]
    if (!user) return m.reply(`❌ User tidak ditemukan di database`)

    if (!args[1]) {
        return m.reply(`📌 Contoh penggunaan:\n.addexp @tag 500\n.addexp 62812xxxx 1000`)
    }

    let jumlah = parseInt(args[1])
    if (isNaN(jumlah) || jumlah <= 0) {
        return m.reply('❌ Jumlah EXP harus berupa angka valid.')
    }

    if (!user.exp) user.exp = 0
    user.exp += jumlah

    conn.reply(
        m.chat,
        `
✨ *EXP BERHASIL DITAMBAHKAN*

👤 Target : @${who.split('@')[0]}
➕ EXP +  : ${jumlah}
📊 Total  : ${user.exp}

${wm}
        `.trim(),
        m,
        { mentions: [who] }
    )
}

handler.help = ['addexp @user/nomor jumlah']
handler.tags = ['owner', 'rpg']
handler.command = /^addexp$/i
handler.rowner = true
handler.rpg = true

export default handler