let handler = async (m, { conn, text }) => {
  try {

    if (!text) {
      throw "Format:\n.addlimit @user 1000\n.addlimit 628xxx 1000";
    }

    let users = global.db.data.users;

    let args = text.trim().split(/\s+/);
    let amount = Number(args[1]);

    if (!amount || isNaN(amount)) amount = 1000;

    if (amount <= 0) throw "❌ Jumlah limit tidak valid";
    if (amount > 100000) throw "❌ Maksimal penambahan limit 100000";

    let who;

    // =========================
    // TARGET DETECTION
    // =========================
    if (m.quoted) {
      who = m.quoted.sender;

    } else if (m.mentionedJid?.length) {
      who = m.mentionedJid[0];

    } else if (args[0]?.match(/\d{5,}/)) {
      let num = args[0].replace(/[^0-9]/g, "");
      who = num + "@s.whatsapp.net";
    }

    if (!who) throw "❌ Tag, reply, atau masukkan nomor user!";

    // =========================
    // INIT USER SAFE
    // =========================
    if (!users[who]) {
      users[who] = {
        limit: 0,
        exp: 0,
        level: 0
      };
    }

    let before = users[who].limit || 0;

    users[who].limit += amount;

    let after = users[who].limit;

    // =========================
    // RESPONSE
    // =========================
    let msg = `
╭━━〔 💰 VICTORIA LIMIT SYSTEM 〕
│
├ 👤 User : @${who.split("@")[0]}
├ ➕ Add  : +${amount}
├ 📊 Now  : ${after}
├ 📉 Prev : ${before}
│
╰━━
⚡ Limit System Updated
`.trim();

    await conn.reply(m.chat, msg, m, {
      mentions: [who]
    });

  } catch (e) {
    console.log(e);
    m.reply(e.toString());
  }
};

handler.help = ["addlimit @user <jumlah>"];
handler.tags = ["owner"];
handler.command = /^addlimit(user)?$/i;
handler.rowner = true;

export default handler;