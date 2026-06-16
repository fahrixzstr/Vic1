import { createHash } from "crypto";
import moment from "moment-timezone";

const REGEX = /^([\w\s]+)\s*,\s*(\d{1,3})$/i;

let handler = async (m, { text, usedPrefix, command, conn }) => {
  try {
    let user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {});

    let nameBot = conn.getName(m.sender);

    // =========================
    // TIME INFO (SIMPLIFIED)
    // =========================
    let date = new Date();
    let week = date.toLocaleDateString("id", { weekday: "long" });
    let fullDate = date.toLocaleDateString("id", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    let time = moment().tz("Asia/Jakarta").format("HH:mm:ss");

    // =========================
    // PROFILE PICTURE
    // =========================
    let pp;
    try {
      pp = await conn.profilePictureUrl(m.sender, "image");
    } catch {
      pp = "https://i.pinimg.com/564x/d4/17/75/d41775c2a051fe94269e71bdcbd240a5.jpg";
    }

    // =========================
    // CHECK REGISTERED
    // =========================
    if (user.registered) {
      let snOld = createHash("md5").update(m.sender).digest("hex");

      return m.reply(
        `❗ Kamu sudah terdaftar!\n\n🔐 SN: ${snOld}\n\nGunakan:\n${usedPrefix}unreg <SN>`
      );
    }

    // =========================
    // VALIDATE INPUT
    // =========================
    if (!text) {
      return m.reply(
        `📌 Format daftar:\n\n${usedPrefix + command} nama,umur\n\nContoh:\n${usedPrefix + command} Fahri,18`
      );
    }

    let match = text.match(REGEX);
    if (!match) {
      return m.reply("❌ Format salah!\nGunakan: nama,umur");
    }

    let [, name, ageStr] = match;
    name = name.trim();
    let age = parseInt(ageStr);

    if (!name) return m.reply("❌ Nama tidak boleh kosong");
    if (age < 5 || age > 100) return m.reply("❌ Umur tidak valid (5-100)");

    // =========================
    // GENERATE SN (MORE SECURE)
    // =========================
    let sn = createHash("sha256")
      .update(m.sender + Date.now().toString())
      .digest("hex")
      .slice(0, 12);

    // =========================
    // SAVE USER
    // =========================
    user.name = name;
    user.age = age;
    user.registered = true;
    user.regTime = Date.now();
    user.serial = sn;

    // =========================
    // UI MESSAGE
    // =========================
    let caption = `
╭━━〔 🎉 VICTORIA MD REGISTER 〕
│
├ 👤 Name : ${name}
├ 🎂 Age  : ${age}
├ 🔐 SN   : ${sn}
│
├ 📅 Date : ${week}, ${fullDate}
├ ⏰ Time : ${time}
│
╰━━
⚡ Welcome to Victoria MD System
`.trim();

    await conn.sendMessage(
      m.chat,
      {
        image: { url: pp },
        caption,
        footer: "Victoria MD • Account System",
        buttons: [
          {
            buttonId: ".menu",
            buttonText: { displayText: "📂 MENU" },
            type: 1
          },
          {
            buttonId: ".profile",
            buttonText: { displayText: "👤 PROFILE" },
            type: 1
          }
        ],
        headerType: 4
      },
      { quoted: m }
    );

  } catch (e) {
    console.log(e);
    m.reply("❌ Error sistem register");
  }
};

handler.help = ["daftar"];
handler.tags = ["main"];
handler.command = /^(daftar|verify|reg(ister)?)$/i;

export default handler;