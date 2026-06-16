/*
📌 WM: FahriXz
🔗 Saluran: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
✍️ Upgrade By FahriXz
*/

let handler = async (m, { conn, command }) => {
    const user = global.db.data.users[m.sender] ||= {}

    // init default value biar aman
    if (!user.money) user.money = 0
    if (!user.lastbansos) user.lastbansos = 0

    let randomaku = Math.floor(Math.random() * 101)
    let randomkamu = Math.floor(Math.random() * 101)

    let cooldown = 3600000
    let elapsed = Date.now() - user.lastbansos
    let remaining = cooldown - elapsed

    if (user.money < 3000000) {
        return m.reply(
            `Kamu harus mempunyai *${toRupiah(3000000)} Money* ${global.rpg?.emoticon?.("money") || ""} untuk menggunakan fitur ini!`
        )
    }

    if (elapsed < cooldown) {
        return m.reply(`Silahkan menunggu *${clockString(remaining)}* untuk menggunakan *${command}* lagi`)
    }

    user.lastbansos = Date.now()

    if (randomaku > randomkamu) {
        user.money -= 3000000

        await conn.sendFile(
            m.chat,
            'https://telegra.ph/file/afcf9a7f4e713591080b5.jpg',
            'korupsi.jpg',
            `Kamu tertangkap setelah mencoba korupsi dana bansos 🕴️💰\n\nKamu didenda *${toRupiah(3000000)} Money*`,
            m
        )

    } else if (randomaku < randomkamu) {
        user.money += 3000000

        await conn.sendFile(
            m.chat,
            'https://telegra.ph/file/d31fcc46b09ce7bf236a7.jpg',
            'korupsi.jpg',
            `Kamu berhasil korupsi dana bansos 🕴️💰\n\nKamu mendapatkan *${toRupiah(3000000)} Money*`,
            m
        )

    } else {
        return m.reply(`Kamu gagal korupsi bansos dan berhasil melarikan diri 🏃`)
    }
}

handler.help = ['korupsi']
handler.tags = ['rpg']
handler.command = /^(bansos|korupsi)$/i
handler.register = true
handler.group = true
handler.rpg = true

export default handler

function clockString(ms) {
    if (ms <= 0) return "00:00:00"
    let h = Math.floor(ms / 3600000)
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}

const toRupiah = number =>
    parseInt(number || 0).toLocaleString().replace(/,/g, ".")