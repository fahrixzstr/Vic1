import fs from "fs"
import { isOwner } from "../library/libowner.js"

let handler = async (m, { args }) => {
  if (!isOwner(m)) return m.reply("❌ Owner only feature")

  if (!args[0]) return m.reply("❌ Nama plugin belum diisi")

  let name = args[0]
  let file = `./plugins/${name}.js`

  if (fs.existsSync(file)) {
    return m.reply("❌ Plugin sudah ada")
  }

  let template = `
let handler = async (m, { conn }) => {
  m.reply("Plugin ${name} aktif 🚀")
}

handler.command = /^${name}$/i
export default handler
`.trim()

  fs.writeFileSync(file, template)

  m.reply(`✅ Plugin dibuat:\n${file}`)
}

handler.command = /^createplugin$/i
export default handler