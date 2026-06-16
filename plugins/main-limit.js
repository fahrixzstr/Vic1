let handler = async (m, { conn }) => {
  let who = m.isGroup
    ? m.mentionedJid?.[0] || m.sender
    : m.sender;

  let user = global.db.data.users?.[who];

  if (!user) return m.reply("❌ Pengguna tidak ditemukan di database.");

  const botNumber = conn.decodeJid(conn.user.id);

  // =========================
  // OWNER LIST NORMALIZATION
  // =========================
  const ownerList = (global.fahriown || []).map(v => {
    let num = Array.isArray(v) ? v[0] : v;
    return num.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  });

  const isOwner =
    m.fromMe ||
    ownerList.includes(who) ||
    who === botNumber;

  // =========================
  // PREMIUM CHECK (SAFE)
  // =========================
  const isPrems =
    isOwner ||
    (user.plusTime && new Date().getTime() < user.plusTime);

  // =========================
  // NAME SAFE
  // =========================
  const name = user.registered
    ? user.name
    : (await conn.getName(who) || "Unknown");

  // =========================
  // LIMIT SAFE VALUE
  // =========================
  const limitNow = Number(user.limit) || 0;
  const limitMax = 1000;

  // =========================
  // STATUS LOGIC CLEAN
  // =========================
  let status = "Free User";

  if (isOwner) {
    status = "Owner";
  } else if (isPrems) {
    status = "Plus User";
  } else if ((user.level || 0) > 999) {
    status = "Elite User";
  }

  // =========================
  // MESSAGE UI
  // =========================
  let msg = `
╭━━〔 🍓 VICTORIA MD LIMIT 〕
│
├ 👤 Name   : ${name}
├ 💢 Status : ${status}
│
├ ✨ Limit  : ${isPrems ? "♾ Unlimited" : `${limitNow} / ${limitMax}`}
│
╰━━
⚡ Victoria MD • User System
`.trim();

  await m.reply(msg);
};

handler.help = ["limit"];
handler.tags = ["xp"];
handler.command = /^limit$/i;
handler.register = false;

export default handler;