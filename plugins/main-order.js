const orders = {
  '3': { name: '3 Day plus', price: 3000, type: 'plus', days: 3 },
  '7': { name: '7 Day plus', price: 10000, type: 'plus', days: 7 },
  '30': { name: '30 Day plus', price: 15000, type: 'plus', days: 30 },
  '60': { name: '60 Day plus', price: 30000, type: 'plus', days: 60 },
  '90': { name: '90 Day plus', price: 40000, type: 'plus', days: 90 },
  '365': { name: '365 Day plus', price: 115000, type: 'plus', days: 365 },

  'G7': { name: '7 Day Join Group', price: 2000, type: 'group', days: 7 },
  'G30': { name: '30 Day Join Group', price: 5000, type: 'group', days: 30 },
  'G365': { name: '365 Day Join Group', price: 80000, type: 'group', days: 365 },
};

// =========================
// GENERATE ORDER ID
// =========================
function makeID() {
  return 'VX-' + Date.now().toString(36).toUpperCase();
}

let handler = async (m, { conn, text }) => {
  try {

    const owner = (global.nomorOwner || '6285166637132')
      .replace(/[^0-9]/g, '') + '@s.whatsapp.net';

    // =========================
    // SHOW LIST
    // =========================
    if (!text) {
      let list = `╭━━〔 📦 VICTORIA ORDER 〕\n│\n`;

      for (let k in orders) {
        list += `├ ${k} → ${orders[k].name} | Rp ${orders[k].price.toLocaleString('id-ID')}\n`;
      }

      list += `│\n╰━━\nKetik: .order <kode>\nContoh: .order 7`;

      return m.reply(list);
    }

    // =========================
    // NORMALIZE CODE
    // =========================
    let code = text.trim().toUpperCase();
    let paket = orders[code];

    if (!paket) {
      return m.reply("❌ Kode paket tidak ditemukan.\nKetik .order untuk list");
    }

    // =========================
    // ORDER DATA
    // =========================
    let orderId = makeID();
    let time = new Date().toLocaleString("id-ID");

    let userNumber = m.sender.split("@")[0];

    let orderMsg = `
╭━━〔 📢 NEW ORDER VICTORIA MD 〕
│
├ 🆔 Order ID : ${orderId}
├ 👤 User     : ${m.pushName}
├ 📱 Number   : ${userNumber}
│
├ 📦 Package  : ${paket.name}
├ 💰 Price    : Rp ${paket.price.toLocaleString('id-ID')}
├ ⏳ Duration : ${paket.days} hari
├ 📂 Type     : ${paket.type}
│
├ 📅 Time     : ${time}
│
╰━━
⚡ Victoria MD Order System
`.trim();

    // =========================
    // USER MESSAGE
    // =========================
    await m.reply(`
✅ *ORDER DITERIMA*

🆔 ID: ${orderId}
📦 ${paket.name}
💰 Rp ${paket.price.toLocaleString('id-ID')}

📩 Silakan tunggu konfirmasi admin.
    `.trim());

    // =========================
    // SEND TO OWNER
    // =========================
    await conn.sendMessage(owner, {
      text: orderMsg
    });

  } catch (e) {
    console.log(e);
    m.reply("❌ Error sistem order");
  }
};

handler.help = ["order <kode>", "sewa <kode>", "plus <kode>"];
handler.tags = ["main"];
handler.command = /^(order|sewa|plus)$/i;

export default handler;