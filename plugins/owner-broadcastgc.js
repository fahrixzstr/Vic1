// CODE BY FAHRIXZ
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (m, { conn, text, quoted, mime, prefix, command }) => {
  try {

    if (!text) {
      throw `*Penggunaan salah!*\n\nContoh:\n${prefix + command} teks\n(Reply media juga bisa)`;
    }

    // =========================
    // GET ALL CHATS
    // =========================
    let allChats = Object.keys(conn.chats || {});

    if (!allChats.length) {
      let groups = Object.entries(await conn.groupFetchAllParticipating())
        .map(v => v[1].id);

      allChats = [...groups];
    }

    // filter bot & status
    allChats = allChats.filter(v =>
      v && !v.includes('status@broadcast')
    );

    await m.reply(
      `📢 *BROADCAST STARTED*\n\n📦 Total Chat: ${allChats.length}`
    );

    // =========================
    // PRELOAD MEDIA (FIX SPEED)
    // =========================
    let mediaBuffer = null;
    let mediaType = "text";

    if (quoted) {
      if (/image/.test(mime)) {
        mediaBuffer = await quoted.download();
        mediaType = "image";
      } else if (/video/.test(mime)) {
        mediaBuffer = await quoted.download();
        mediaType = "video";
      }
    }

    const fakeQuoted = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        conversation: "Victoria MD Broadcast"
      }
    };

    let success = 0;
    let failed = 0;

    // =========================
    // LOOP ALL CHATS
    // =========================
    for (let i = 0; i < allChats.length; i++) {
      let id = allChats[i];

      try {

        // anti spam delay random
        await sleep(1200 + Math.floor(Math.random() * 1200));

        let options = { quoted: fakeQuoted };

        if (mediaType === "image") {
          await conn.sendMessage(id, {
            image: mediaBuffer,
            caption: text
          }, options);

        } else if (mediaType === "video") {
          await conn.sendMessage(id, {
            video: mediaBuffer,
            caption: text
          }, options);

        } else {
          await conn.sendMessage(id, {
            text
          }, options);
        }

        success++;

      } catch (err) {
        console.log(`❌ gagal ke ${id}`, err);
        failed++;
      }
    }

    // =========================
    // RESULT REPORT
    // =========================
    await m.reply(`
╭━━〔 📢 BROADCAST FINISHED 〕
│
├ 📦 Total Chat : ${allChats.length}
├ ✅ Sukses     : ${success}
├ ❌ Gagal      : ${failed}
│
╰━━
⚡ Victoria MD System
    `.trim());

  } catch (e) {
    console.log(e);
    m.reply("❌ Broadcast error:\n" + e.message);
  }
};

handler.help = ['bcchat <teks>'];
handler.tags = ['owner'];
handler.command = /^(bcchat|broadcastchat)$/i;
handler.owner = true;

export default handler;