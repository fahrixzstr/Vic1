import moment from "moment-timezone";
import os from "os";
import process from "process";

moment.locale("id");

const THUMB = "./thumbnail.jpg";
const MENU_SOUND = global.menuAudio;

// =========================
// HELPERS SYSTEM INFO
// =========================
function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + " MB";
}

function getCPU() {
  const cpus = os.cpus();
  return `${cpus[0].model.split(" ")[0]} (${cpus.length} Core)`;
}

function getRAM() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  return `${formatBytes(used)} / ${formatBytes(total)}`;
}

function getServerType() {
  return `${os.platform()} (${os.type()})`;
}

// =========================
// NEW FEATURE SYSTEM (3 DAYS)
// =========================
const FEATURE_EXPIRY = 3 * 24 * 60 * 60 * 1000;

function getNewFeatures() {
  const features = global.newFeatures || [];

  return features.filter(f => {
    return (Date.now() - (f.addedAt || 0)) < FEATURE_EXPIRY;
  });
}

// =========================
// HANDLER
// =========================
let handler = async (m, { conn, text }) => {
  try {

    const who = m.sender;
    const user = global.db.data.users?.[who] || {};

    const botname = global.victoria || conn.user?.name || "VICTORIA MD";
    const owner = global.fahrixz || "Owner";

    const uptimeSec = process.uptime();
    const uptime = moment.utc(uptimeSec * 1000).format("HH:mm:ss");
    const date = moment().format("dddd, DD MMMM YYYY");
    const time = moment().format("HH:mm:ss");

    // =========================
    // USER INFO
    // =========================
    const limit = Number(user.limit) || 0;
    const xp = Number(user.exp || user.totalexp) || 0;
    const role = user.role || "Newbie";

    const status = user.plusTime && user.plusTime > Date.now()
      ? "PLUS"
      : "FREE";

    const mode = global.opts?.self ? "SELF" : "PUBLIC";

    // =========================
    // SYSTEM INFO
    // =========================
    const cpu = getCPU();
    const ram = getRAM();
    const server = getServerType();

    // =========================
    // PLUGIN SCANNER
    // =========================
    const plugins = Object.values(global.plugins || {}).filter(p => p && !p.disabled);

    const categories = {};
    let latestPluginTime = 0;

    for (const p of plugins) {
      const helps = Array.isArray(p.help) ? p.help : [p.help];
      const tags = Array.isArray(p.tags) ? p.tags : [p.tags];

      latestPluginTime = Math.max(latestPluginTime, p.lastUpdate || 0);

      for (let tag of tags) {
        if (!tag) continue;
        tag = tag.toLowerCase();

        if (!categories[tag]) categories[tag] = [];
        categories[tag].push(...helps);
      }
    }

    const arrayMenu = [...new Set(Object.keys(categories))].sort();

    // =========================
    // NEW FEATURES LIST
    // =========================
    const newFeatures = getNewFeatures();
    const featureText = newFeatures.length
      ? newFeatures.map(v => `✨ ${v.name}`).join("\n")
      : "No new features";

    // =========================
    // BUTTONS
    // =========================
    const rows = arrayMenu.map(v => ({
      title: `📂 ${v.toUpperCase()}`,
      description: `Menu kategori ${v}`,
      id: `.menu ${v}`
    }));

    // =========================
    // DASHBOARD TEXT
    // =========================
    const captionText = `
╭━━〔 🤖 VICTORIA DASHBOARD 〕

╭─ SYSTEM INFO
├ CPU    : ${cpu}
├ RAM    : ${ram}
├ TYPE   : ${os.arch()}
├ SERVER : ${server}
╰────────────

╭─ BOT INFO
├ NAMA   : ${botname}
├ RUNTIME: ${uptime}
├ UPTIME : ${uptime}
├ MODE   : ${mode}
├ DATE   : ${date}
├ TIME   : ${time}
╰────────────

╭─ USER INFO
├ USER   : @${who.split("@")[0]}
├ XP     : ${xp}
├ LIMIT  : ${limit}
├ STATUS : ${status}
├ ROLE   : ${role}
╰────────────

╭─ NEW FEATURES (3 DAYS)
${featureText}
╰────────────

⚡ Victoria MD System Dashboard
`.trim();

    // =========================
    // MAIN MENU
    // =========================
    if (!text || !categories[text.toLowerCase()]) {

      await conn.sendMessage(m.chat, {
        image: { url: THUMB },
        caption: captionText,
        mentions: [who],

        footer: "Victoria MD Menu System",

        buttons: [
          {
            buttonId: "menu_list",
            buttonText: { displayText: "📂 PILIH MENU" },
            type: 4,
            nativeFlowInfo: {
              name: "single_select",
              paramsJson: JSON.stringify({
                title: "📂 SELECT MENU CATEGORY",
                sections: [
                  {
                    title: `TOTAL MENU: ${arrayMenu.length}`,
                    rows
                  }
                ]
              })
            }
          },
          {
            buttonId: ".menu all",
            buttonText: { displayText: "✨ ALL MENU" },
            type: 1
          }
        ],

        headerType: 4
      }, { quoted: global.fkontak });

      if (MENU_SOUND) {
        await conn.sendFile(m.chat, MENU_SOUND, "menu.mp3", null, m, true, {
          type: "audioMessage",
          ptt: true
        });
      }

      return;
    }

    // =========================
    // CATEGORY MENU OUTPUT
    // =========================
    let out = [];
    const targets = text.toLowerCase() === "all"
      ? arrayMenu
      : [text.toLowerCase()];

    for (const tag of targets) {
      if (!categories[tag]) continue;

      out.push(`╭━━〔 ${tag.toUpperCase()} 〕`);

      for (const cmd of categories[tag]) {
        out.push(`├ .${cmd}`);
      }

      out.push(`╰━━`);
    }

    await conn.reply(m.chat, out.join("\n"), m);

  } catch (e) {
    console.log(e);
    m.reply("❌ menu error system");
  }
};

handler.command = /^(menu|help)$/i;
handler.tags = ["main"];
handler.help = ["menu"];

export default handler;