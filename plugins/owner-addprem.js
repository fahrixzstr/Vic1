// CODE BY FAHRIXZ
// ADD PREM
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {

    if (!args.length) {
      throw `Contoh:\n${usedPrefix + command} 30 628xxx\n${usedPrefix + command} del 628xxx`;
    }

    let action = command.toLowerCase();

    let nomor;
    let hari = null;

    // =========================
    // PARSE INPUT SAFE
    // =========================
    if (action.includes("del") || action.includes("hapus") || action === "-p") {
      nomor = args[0];

    } else {
      if (args.length < 2) throw `Contoh:\n${usedPrefix + command} 30 628xxx`;

      hari = args[0];
      nomor = args[1];
    }

    nomor = nomor.replace(/[^0-9]/g, "");
    if (!nomor || nomor.length < 10) throw "❌ Nomor tidak valid";

    let who = nomor + "@s.whatsapp.net";

    // =========================
    // INIT USER SAFE
    // =========================
    if (!global.db.data.users[who]) {
      global.db.data.users[who] = {
        name: await conn.getName(who).catch(() => "Unknown"),
        limit: 10,
        exp: 0,
        level: 0,
        register: false,
        plus: false,
        plusTime: 0
      };
    }

    let user = global.db.data.users[who];
    let now = Date.now();

    // =========================
    // ADD PLUS
    // =========================
    if (!action.includes("del") && !action.includes("hapus") && action !== "-p") {

      if (String(hari).toLowerCase() === "permanen") {
        user.plus = true;
        user.plusTime = -1; // lebih aman dari Infinity

        return conn.sendMessage(m.chat, {
          text: `
╭━━〔 ⭐ PLUS SYSTEM 〕
│
├ 👤 User : ${nomor}
├ 💎 Status : PERMANENT PLUS
│
╰━━
⚡ Victoria MD System
          `.trim()
        });
      }

      hari = Number(hari);

      if (!hari || isNaN(hari)) throw "❌ Hari harus angka";

      if (hari > 3650) throw "❌ Maksimal 3650 hari";

      let ms = hari * 24 * 60 * 60 * 1000;

      // =========================
      // SAFE EXPIRY LOGIC
      // =========================
      if (!user.plusTime || user.plusTime < now || user.plusTime === -1) {
        user.plusTime = now + ms;
      } else {
        user.plusTime = user.plusTime + ms;
      }

      user.plus = true;

      return conn.sendMessage(m.chat, {
        text: `
╭━━〔 ⭐ PLUS ADDED 〕
│
├ 👤 User : ${nomor}
├ 🕒 Durasi : ${hari} hari
├ 📅 Expire : ${new Date(user.plusTime).toLocaleString("id-ID")}
│
╰━━
⚡ Victoria MD System
        `.trim()
      });
    }

    // =========================
    // REMOVE PLUS
    // =========================
    user.plus = false;
    user.plusTime = 0;

    return conn.sendMessage(m.chat, {
      text: `
╭━━〔 ⚠️ PLUS REMOVED 〕
│
├ 👤 User : ${nomor}
├ 📅 Time : ${new Date().toLocaleString("id-ID")}
│
╰━━
⚡ Victoria MD System
      `.trim()
    });

  } catch (e) {
    console.log(e);
    m.reply(e.toString());
  }
};

handler.help = ["addplus <hari> <nomor>", "delplus <nomor>"];
handler.tags = ["owner"];
handler.command = /^(add|tambah|\+|del|hapus|-p)$/i;
handler.owner = true;

export default handler;