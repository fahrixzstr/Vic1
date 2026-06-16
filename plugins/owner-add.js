import fetch from "node-fetch";

const { getBinaryNodeChild, getBinaryNodeChildren } =
  (await import("@adiwajshing/baileys")).default;

let handler = async (m, { conn, text, participants }) => {
  try {

    if (!text) return m.reply("❌ Masukkan nomor!\nContoh: .oadd 628xxx,628xxx");

    let groupParticipants = participants?.map(u => u.id) || [];

    // =========================
    // CLEAN INPUT NUMBERS
    // =========================
    let inputNumbers = text
      .split(",")
      .map(v => v.replace(/[^0-9]/g, ""))
      .filter(v => v.length > 5 && v.length < 20)
      .filter(v => !groupParticipants.includes(v + "@s.whatsapp.net"));

    if (!inputNumbers.length) {
      return m.reply("❌ Tidak ada nomor valid untuk ditambahkan.");
    }

    // =========================
    // VALIDATE WHATSAPP
    // =========================
    let users = (await Promise.all(
      inputNumbers.map(async v => {
        let jid = v + "@s.whatsapp.net";
        let res = await conn.onWhatsApp(jid);
        return res?.[0]?.exists ? jid : null;
      })
    )).filter(Boolean);

    if (!users.length) return m.reply("❌ Semua nomor tidak terdaftar WhatsApp.");

    // =========================
    // ADD REQUEST VIA IQ
    // =========================
    const response = await conn.query({
      tag: "iq",
      attrs: {
        type: "set",
        xmlns: "w:g2",
        to: m.chat
      },
      content: users.map(jid => ({
        tag: "add",
        attrs: {},
        content: [
          {
            tag: "participant",
            attrs: { jid }
          }
        ]
      }))
    });

    // =========================
    // THUMBNAIL SAFE
    // =========================
    let pp;
    try {
      pp = await conn.profilePictureUrl(m.chat, "image");
    } catch {
      pp = null;
    }

    let jpegThumbnail = pp
      ? await (await fetch(pp)).buffer()
      : Buffer.alloc(0);

    // =========================
    // HANDLE RESPONSE
    // =========================
    const add = getBinaryNodeChild(response, "add");
    const participant = getBinaryNodeChildren(add, "participant");

    for (const user of participant || []) {
      if (user.attrs?.error == 403) {
        let jid = user.attrs.jid;
        let content = getBinaryNodeChild(user, "add_request");

        let code = content?.attrs?.code;
        let exp = content?.attrs?.expiration;

        let msg = `📩 Mengundang @${jid.split("@")[0]} via invite link...`;

        await m.reply(msg, null, {
          mentions: conn.parseMention(msg)
        });

        if (code && exp) {
          await conn.sendGroupV4Invite(
            m.chat,
            jid,
            code,
            exp,
            await conn.getName(m.chat),
            "Invitation to join group",
            jpegThumbnail
          );
        }
      }
    }

    // =========================
    // SUCCESS MESSAGE
    // =========================
    await m.reply(
      `✅ Berhasil memproses ${users.length} user ke group`
    );

  } catch (e) {
    console.log(e);
    m.reply("❌ Error system add user");
  }
};

handler.help = ["oadd <nomor>", "o+"];
handler.tags = ["owner"];
handler.command = /^(oadd|o\+)$/i;

handler.owner = true;
handler.group = true;
handler.botAdmin = true;

export default handler;