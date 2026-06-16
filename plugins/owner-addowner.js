// FITUR BY FAHRIXZ
// ADD OWNER NEW
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g

let handler = async (m, { conn, args, isOwner }) => {
  try {

    if (!isOwner) throw "❌ Hanya owner utama yang bisa pakai perintah ini!";
    if (!args[0]) throw "Contoh:\n.addowner 628xxx 1d";

    let number = args[0].replace(/[^0-9]/g, "");
    if (!number) throw "❌ Nomor tidak valid";

    let jid = number + "@s.whatsapp.net";

    // =========================
    // DURATION PARSE
    // =========================
    let duration = args[1] || "1d";

    let time = 0;

    if (duration.endsWith("d")) time = parseInt(duration) * 24 * 60 * 60 * 1000;
    else if (duration.endsWith("h")) time = parseInt(duration) * 60 * 60 * 1000;
    else if (duration.endsWith("m")) time = parseInt(duration) * 60 * 1000;
    else throw "❌ Format waktu salah (gunakan: 1d / 2h / 30m)";

    if (!global.tempOwners) global.tempOwners = [];

    // =========================
    // CHECK EXISTING
    // =========================
    let exists = global.tempOwners.find(v => v.id === number);
    if (exists) throw "❌ Nomor sudah jadi temporary owner";

    let expire = Date.now() + time;

    global.tempOwners.push({
      id: number,
      jid,
      expire
    });

    // =========================
    // AUTO REMOVE SYSTEM
    // =========================
    setTimeout(() => {
      global.tempOwners = global.tempOwners.filter(v => v.id !== number);
    }, time);

    // =========================
    // RESPONSE
    // =========================
    let msg = `
╭━━〔 👑 TEMP OWNER ADDED 〕
│
├ 📱 Number : ${number}
├ ⏳ Duration: ${duration}
├ 📅 Expire  : ${new Date(expire).toLocaleString("id-ID")}
│
╰━━
⚡ Temporary Owner System Active
`.trim();

    await conn.reply(m.chat, msg, m, {
      mentions: [jid]
    });

  } catch (e) {
    console.log(e);
    m.reply(e.toString());
  }
};

handler.help = ["addowner <nomor> <waktu>"];
handler.tags = ["owner"];
handler.command = /^addowner$/i;
handler.owner = true;

export default handler;