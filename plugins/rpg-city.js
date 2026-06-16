// 💫 Name Fitur : City Simulation
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type Plugin 

let handler = async (m, { conn, command, args }) => {
  let user = global.db.data.users[m.sender]
  if (!user.city) {
    user.city = {
      money: 1000,
      house: "kos",
      job: "pengangguran",
      tax: 0,
      property: []
    }
  }

  let city = user.city

  if (command === "city") {
    return m.reply(`
🏙️ *CITY SIMULATION*

💰 Uang: Rp${city.money}
🏠 Rumah: ${city.house}
💼 Pekerjaan: ${city.job}
🏦 Pajak: Rp${city.tax}
🏢 Properti: ${city.property.length ? city.property.join(", ") : "Belum punya"}

Perintah:
• .work
• .buyhouse
• .buyproperty
• .paytax
`)
  }

  if (command === "work") {
    let earn = Math.floor(Math.random() * 2000) + 500
    city.money += earn
    city.tax += Math.floor(earn * 0.1)

    return m.reply(`💼 Kamu bekerja dan mendapat Rp${earn}`)
  }

  if (command === "buyhouse") {
    if (city.money < 5000) return m.reply("❌ Uang tidak cukup")

    city.money -= 5000
    city.house = "rumah kecil"

    return m.reply("🏠 Kamu berhasil membeli rumah kecil!")
  }

  if (command === "buyproperty") {
    let list = ["toko", "ruko", "villa", "apartemen"]
    let pick = list[Math.floor(Math.random() * list.length)]
    let price = Math.floor(Math.random() * 8000) + 3000

    if (city.money < price) return m.reply("❌ Uang tidak cukup")

    city.money -= price
    city.property.push(pick)

    return m.reply(`🏢 Kamu membeli properti: ${pick}`)
  }

  if (command === "paytax") {
    if (city.money < city.tax) return m.reply("❌ Uang tidak cukup")

    city.money -= city.tax
    let paid = city.tax
    city.tax = 0

    return m.reply(`🏦 Pajak dibayar sebesar Rp${paid}`)
  }
}

handler.help = ["city", "work", "buyhouse", "buyproperty", "paytax"]
handler.tags = ["rpg"]
handler.command = /^(city|work|buyhouse|buyproperty|paytax)$/i
handler.register = true
export default handler