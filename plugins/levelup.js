import { canLevelUp, xpRange } from "../library/liblevelling.js";

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  let name = conn.getName(m.sender);

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
  // XP INFO
  // =========================
  let { min, xp, max } = xpRange(user.level, global.multiplier);
  let need = max - user.exp;

  // =========================
  // CHECK LEVEL UP
  // =========================
  let before = user.level;

  while (canLevelUp(user.level, user.exp, global.multiplier)) {
    user.level++;
  }

  let leveledUp = before !== user.level;

  // =========================
  // MESSAGE UI
  // =========================
  let msg = `
╭━━〔 🎮 VICTORIA MD LEVEL 〕
│
├ 👤 Name : ${name}
├ 📊 Level : ${user.level}
├ ⚡ EXP   : ${user.exp - min}/${xp}
├ 📉 Need  : ${need} EXP
│
╰━━
⚡ Victoria MD • RPG System
`.trim();

  // =========================
  // LEVEL UP NOTICE
  // =========================
  if (leveledUp) {
    await conn.reply(
      m.chat,
      `🎉 *LEVEL UP!*\n\n${name}\nLevel: ${before} ➜ ${user.level}`,
      m
    );
  } else {
    await conn.reply(m.chat, msg, m);
  }

  // =========================
  // PROFILE IMAGE
  // =========================
  await conn.sendFile(m.chat, pp, "profile.jpg", "🎮 Profile kamu", m);

  // delay biar rapi
  await new Promise((r) => setTimeout(r, 1500));
};

handler.help = ["levelup"];
handler.tags = ["xp"];
handler.command = /^levelup$/i;

export default handler;