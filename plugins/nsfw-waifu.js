let handler = async (m, { conn }) => {
  try {

    await m.react('✨')

    const res = await fetch('https://api.waifu.im/images?IsNsfw=True')
    const json = await res.json()

    if (!json.items || json.items.length === 0) {
      await m.react('❌')
      return m.reply('❌ Tidak ada gambar ditemukan.')
    }

    const img = json.items[0]

    if (!img.isNsfw) {
      await m.react('⚠️')
      return m.reply('❌ Gambar bukan NSFW.')
    }

    await conn.sendMessage(m.chat, {
      image: { url: img.url }
    }, { quoted: m })

    await m.react('🔥')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply('❌ Gagal mengambil gambar.')
  }
}

handler.help = ['waifunsfw']
handler.tags = ['nsfw']
handler.command = /^waifunsfw$/i
handler.group = false
handler.plus = true

export default handler
