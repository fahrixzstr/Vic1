import fs from "fs"
import path from "path"

export const loadOwnerMenu = () => {
  const pluginDir = "./plugins"
  const files = fs.readdirSync(pluginDir)

  let ownerCommands = []

  for (let file of files) {
    if (!file.endsWith(".js")) continue

    let filePath = path.join(pluginDir, file)
    let content = fs.readFileSync(filePath, "utf-8")

    // cari tag owner
    let hasOwnerTag = content.includes('tags: ["owner"]') || content.includes("tags: ['owner']")

    if (hasOwnerTag) {
      // ambil command
      let cmdMatch = content.match(/handler\.command\s*=\s*\/\^(.+?)\//)

      if (cmdMatch) {
        ownerCommands.push(cmdMatch[1])
      }
    }
  }

  return ownerCommands
}