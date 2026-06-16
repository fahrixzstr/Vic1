let handler = async (m, { conn }) => {
  const nomorown = global.fahriown?.[0]
  if (!nomorown) return m.reply('❗ Nomor owner belum diset di config.js')

  const nomorBot = conn.user?.jid?.split('@')[0]
  if (!nomorBot) return m.reply('❗ Nomor bot tidak ditemukan')

  const idOwner = nomorown.toString().replace(/\D/g, '')
  const idBot = nomorBot.toString().replace(/\D/g, '')

  let namaOwner = 'Owner'
  let namaBot = 'Bot'

  try {
    namaOwner = await conn.getName(idOwner + '@s.whatsapp.net')
  } catch {}

  try {
    namaBot = await conn.getName(conn.user.jid)
  } catch {}

  await conn.sendContactArray(m.chat, [
    [
      idOwner,
      namaOwner,
      '💌 Owner Bot',
      'ɴᴏᴛ ғᴀᴍᴏᴜs',
      'Dick',
      '🇮🇩 Indonesia',
      '📍 i don\'t know',
      '👤 ᴏᴡɴᴇʀ ʙᴏᴛ'
    ],
    [
      idBot,
      namaBot,
      '🎈 ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ',
      '📵 ᴅᴏɴᴛ sᴘᴀᴍ/ᴄᴀʟʟ ᴍᴇ 😢',
      'ɴᴏᴛʜɪɴɢ',
      '🇮🇩 Indonesia',
      '📍 i don\'t know',
      'ʜᴀɴʏᴀ ʙᴏᴛ ʙɪᴀsᴀ ʏᴀɴɢ ᴋᴀᴅᴀɴɢ sᴜᴋᴀ ᴇʀᴏʀ ☺'
    ]
  ])

  await m.reply('ᴍʏ ᴏᴡɴᴇʀ ᴅᴏɴᴛ sᴘᴀᴍ ᴏʀ ʏᴏᴜ ᴡɪʟʟ ʙᴇ ʙʟᴏᴄᴋᴇᴅ')
}

handler.help = ['owner', 'creator']
handler.tags = ['info']
handler.command = /^(owner|creator)$/i

export default handler