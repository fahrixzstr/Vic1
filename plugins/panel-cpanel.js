// CODE BY FAHRIXZ
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g


import fetch from 'node-fetch'
import baileys from '@adiwajshing/baileys'
const { proto } = baileys
import '../config.js'

function generatePassword(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('')
}

const resourceMap = {
  '1gb': { ram: 1000, disk: 1000, cpu: 40 },
  '2gb': { ram: 2000, disk: 1000, cpu: 60 },
  '3gb': { ram: 3000, disk: 2000, cpu: 80 },
  '4gb': { ram: 4000, disk: 2000, cpu: 100 },
  '5gb': { ram: 5000, disk: 3000, cpu: 120 },
  '6gb': { ram: 6000, disk: 3000, cpu: 140 },
  '7gb': { ram: 7000, disk: 4000, cpu: 160 },
  '8gb': { ram: 8000, disk: 4000, cpu: 180 },
  '9gb': { ram: 9000, disk: 5000, cpu: 200 },
  '10gb': { ram: 10000, disk: 5000, cpu: 220 },
  'unlimited': { ram: 0, disk: 0, cpu: 0 },
  'unli': { ram: 0, disk: 0, cpu: 0 }
}

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text) {
      return m.reply(
        `❌ Format salah!\n\nContoh:\n.${command} username,628xxxx`
      )
    }

    let [usernameRaw, nom] = text.split(',').map(v => v?.trim())
    if (!usernameRaw) return m.reply('❌ Username tidak boleh kosong!')

    const username = usernameRaw.toLowerCase()
    const nomor = nom
      ? nom.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
      : m.chat

    const email = `${username}@gmail.com`
    const password = generatePassword()
    const name = username.charAt(0).toUpperCase() + username.slice(1) + ' Server'

    const { egg, nestid, loc, domain, apikey } = global
    const limit = resourceMap[command.toLowerCase()] || { ram: 0, disk: 0, cpu: 0 }

    // ======================
    // CREATE USER
    // ======================
    const userRes = await fetch(`${domain}/api/application/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`
      },
      body: JSON.stringify({
        email,
        username,
        first_name: name,
        last_name: 'Server',
        language: 'en',
        password
      })
    })

    const userJson = await userRes.json()
    if (userJson.errors) {
      return m.reply('❌ Error user:\n' + JSON.stringify(userJson.errors[0]))
    }

    const user = userJson.attributes

    // ======================
    // GET EGG DATA
    // ======================
    const eggRes = await fetch(`${domain}/api/application/nests/${nestid}/eggs/${egg}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apikey}`
      }
    })

    const eggJson = await eggRes.json()
    const startup_cmd = eggJson?.attributes?.startup || 'npm start'

    // ======================
    // CREATE SERVER
    // ======================
    const serverRes = await fetch(`${domain}/api/application/servers`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`
      },
      body: JSON.stringify({
        name,
        description: new Date().toLocaleString('id-ID'),
        user: user.id,
        egg: parseInt(egg),
        docker_image: 'ghcr.io/parkervcp/yolks:nodejs_20',
        startup: startup_cmd,
        environment: {
          INST: 'npm',
          USER_UPLOAD: '0',
          AUTO_UPDATE: '0',
          CMD_RUN: 'npm start'
        },
        limits: {
          memory: limit.ram,
          swap: 0,
          disk: limit.disk,
          io: 500,
          cpu: limit.cpu
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 5
        },
        deploy: {
          locations: [parseInt(loc)],
          dedicated_ip: false,
          port_range: []
        }
      })
    })

    const serverJson = await serverRes.json()
    if (serverJson.errors) {
      return m.reply('❌ Error server:\n' + JSON.stringify(serverJson.errors[0]))
    }

    const server = serverJson.attributes

    // ======================
    // OUTPUT
    // ======================
    const teks = `
📦 *PANEL BERHASIL DIBUAT*

🆔 Server ID : ${server.id}
👤 Username   : ${user.username}
🔐 Password   : ${password}
📅 Date       : ${new Date().toLocaleString('id-ID')}

⚙️ *SPEC*
• RAM : ${limit.ram ? limit.ram / 1000 + 'GB' : 'Unlimited'}
• DISK: ${limit.disk ? limit.disk / 1000 + 'GB' : 'Unlimited'}
• CPU : ${limit.cpu ? limit.cpu + '%' : 'Unlimited'}
• HOST: ${domain}

⚠️ Simpan data ini dengan aman!
`.trim()

    const msg = {
      text: teks,
      footer: 'Panel System • FahriXz',
      buttons: [
        { buttonId: `.copy ${user.username}`, buttonText: { displayText: '📋 Copy Username' }, type: 1 },
        { buttonId: `.copy ${password}`, buttonText: { displayText: '🔐 Copy Password' }, type: 1 }
      ]
    }

    await conn.sendMessage(nomor, msg, { quoted: m })

    await m.reply('✅ Panel berhasil dibuat & dikirim!')
  } catch (err) {
    console.error(err)
    m.reply('❌ Terjadi error:\n' + err.message)
  }
}

handler.command = /^(1gb|2gb|3gb|4gb|5gb|6gb|7gb|8gb|9gb|10gb|unli|unlimited)$/i
handler.tags = ['panel']
handler.help = ['panel <username,nomor>']
handler.owner = true
handler.plus = true

export default handler