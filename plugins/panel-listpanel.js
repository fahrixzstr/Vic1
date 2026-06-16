/*
📌 Nama Fitur: Cpanel Ultra Upgrade
🏷️ Type : Plugin ESM
*/

import fetch from 'node-fetch'
import '../config.js'

const handler = async (m, { conn }) => {
  try {
    const domain = global.domain
    const apikey = global.apikey
    const capikey = global.capikey || apikey

    const res = await fetch(`${domain}/api/application/servers`, {
      method: 'GET',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + apikey
      }
    })

    const json = await res.json()
    const servers = json?.data

    if (!servers?.length) {
      return m.reply("❌ Tidak ada server panel!")
    }

    const results = await Promise.all(
      servers.map(async ({ attributes: s }) => {
        let status = "OFFLINE"

        try {
          if (s?.uuid) {
            const shortUUID = s.uuid.split('-')[0]

            const r = await fetch(
              `${domain}/api/client/servers/${shortUUID}/resources`,
              {
                method: 'GET',
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + capikey
                }
              }
            )

            const rjson = await r.json()
            status = rjson?.attributes?.current_state || "UNKNOWN"
          }
        } catch {
          status = "OFFLINE"
        }

        return `
📡 ID : ${s?.id || "-"}
📦 Name : ${s?.name || "-"}
⚡ Status : ${status.toUpperCase()}
🧠 RAM : ${formatSize(s?.limits?.memory)}
⚙️ CPU : ${s?.limits?.cpu ? s.limits.cpu + "%" : "Unlimited"}
💾 Disk : ${formatSize(s?.limits?.disk)}
📅 Created : ${s?.created_at?.split("T")[0] || "-"}
────────────────────
`
      })
    )

    const text = `📦 *LIST SERVER PANEL*\n\n${results.join("\n")}`

    await conn.sendMessage(m.chat, { text }, { quoted: m })

  } catch (err) {
    console.log(err)
    m.reply("❌ Error:\n" + err.message)
  }
}

/* FORMAT SIZE */
function formatSize(mem) {
  if (!mem) return "Unlimited"
  if (mem >= 1024) return (mem / 1024).toFixed(1) + " GB"
  return mem + " MB"
}

handler.command = /^(listpanel|listp|listserver)$/i
handler.tags = ['panel']
handler.help = ['listpanel']
handler.owner = false
handler.plus = true

export default handler