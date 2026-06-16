import { generateWAMessageFromContent, proto } from '@adiwajshing/baileys'

const handler = async (m, { conn }) => {
  try {

    if (!m.isGroup) {
      return m.reply('❌ Fitur ini hanya bisa dipakai di grup.')
    }

    // safe react
    try {
      await m.react('🆔')
    } catch {}

    const id = m.chat

    const teks = `
╭━━〔 📌 GROUP INFO 〕
│
├ 🆔 Group ID :
│ ${id}
│
╰━━
⚡ Victoria MD System
`.trim()

    // =========================
    // INTERACTIVE MESSAGE
    // =========================
    const msg = generateWAMessageFromContent(m.chat, {
      interactiveMessage: proto.Message.InteractiveMessage.fromObject({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: teks
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: "Victoria MD"
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copy Group ID",
                copy_code: id
              })
            }
          ]
        })
      })
    }, {})

    // =========================
    // SAFE RELAY
    // =========================
    await conn.relayMessage(
      m.chat,
      msg.message,
      {
        messageId: msg.key.id
      }
    )

  } catch (e) {
    console.log(e)
    m.reply('❌ Gagal mengambil ID grup.')
  }
}

handler.help = ['cekidgc']
handler.tags = ['tools']
handler.command = /^cekid(gc|grup)?$/i
handler.owner = true

export default handler