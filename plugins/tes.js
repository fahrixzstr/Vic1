let handler = async (m, { conn }) => {
  let victoria = `
*「 🎸 Victoria FAS 」*

Hmph... apa sih, manggil-manggil Ryo segala... 🙄  
Yasudah, kalau kamu *beneran* butuh, ketik aja *.menu* ✨  

(Tapi jangan ganggu aku lagi latihan bass, ya...) 😏
`

  await conn.sendMessage(
    m.chat,
    {
      text: victoria,
      contextInfo: global.adReply.contextInfo
    },
    {
      quoted: global.fstatus
    }
  )
}

handler.customPrefix = /^(tes|bot|victoria|yamadabot|test)$/i
handler.command = new RegExp

export default handler