import { loadOwnerMenu } from "../library/libmenuLoader.js"
import { isOwner } from "../library/libowner.js"

let handler = async (m) => {
  if (!isOwner(m)) return m.reply("❌ Owner only")

  let cmds = loadOwnerMenu()

  let menuText = `
👑 OWNER MENU AUTO LOAD

📦 SYSTEM OWNER COMMANDS:

${cmds.length
  ? cmds.map(v => `➤ .${v}`).join("\n")
  : "❌ Tidak ada plugin owner ditemukan"}

────────────────────
⚙️ Auto Loaded Plugin System Active
  `.trim()

  m.reply(menuText)
}

handler.command = /^ownermenu|omenu$/i
handler.tags = ["owner"]

export default handler