// CODE BY FAHRIXZ
// JOIN CH https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handler = async (m, { conn, text, quoted, mime }) => {
  try {

    if (!text) {
      throw `*Penggunaan salah!*\n\nContoh:\n.bcgc teks\n.bcgc teks (reply media)`;
    }

    let groups = Object.entries(await conn.groupFetchAllParticipating())
      .map(v => v[1].id);

    if (!groups.length) throw "❌ Tidak ada grup ditemukan";

    await m.reply(
      `🚀 *BROADCAST STARTED*\n\n📦 Total Grup: ${groups.length}\n⏳ Estimasi: ±${groups.length * 2} detik`
    );

    // =========================
    // PRELOAD MEDIA (FIX SPEED)
    // =========================
    let mediaBuffer;
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
    // LOOP BROADCAST SAFE
    // =========================
    for (let i = 0; i < groups.length; i++) {
      let id = groups[i];

      try {

        // dynamic delay biar tidak flood
        await sleep(1500 + Math.floor(Math.random() * 1000));

        let msgOptions = { quoted: fakeQuoted };

        if (mediaType === "image") {
          await conn.sendMessage(id, {
            image: mediaBuffer,
            caption: text
          }, msgOptions);

        } else if (mediaType === "video") {
          await conn.sendMessage(id, {
            video: mediaBuffer,
            caption: text
          }, msgOptions);

        } else {
          await conn.sendMessage(id, {
            text
          }, msgOptions);
        }

        success++;

      } catch (err) {
        console.log(`❌ Gagal ke grup ${id}:`, err);
        failed++;
      }
    }

    // =========================
    // RESULT REPORT
    // =========================
    await m.reply(`
╭━━〔 📢 BROADCAST FINISHED 〕
│
├ 📦 Total : ${groups.length}
├ ✅ Sukses : ${success}
├ ❌ Gagal  : ${failed}
│
╰━━
⚡ Victoria MD System
    `.trim());

  } catch (e) {
    console.log(e);
    m.reply("❌ Broadcast error:\n" + e.message);
  }
};

handler.help = ["bcgc <teks>"];
handler.tags = ["owner"];
handler.command = /^(bcgc|broadcast)$/i;
handler.owner = true;

export default handler;