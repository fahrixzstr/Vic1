import axios from "axios";
import cheerio from "cheerio";
import moment from "moment-timezone";

// =========================
// FETCH WORLD TIME
// =========================
async function getWorldTime() {
  const url = "https://onlinealarmkur.com/world/id/";

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(data);
  let result = [];

  $(".flex.items-center.space-x-3").each((_, el) => {
    const flag = $(el).find(".avatar .text-2xl").text().trim();
    const city = $(el).find(".city-name").text().trim();
    const tz = $(el).find(".city-time").attr("data-tz");

    if (!tz) return;

    try {
      const time = moment().tz(tz).format("HH:mm");

      result.push({
        flag,
        city,
        tz,
        time,
        offset: moment().tz(tz).utcOffset()
      });
    } catch {}
  });

  return result;
}

// =========================
// HANDLER
// =========================
let handler = async (m) => {
  try {
    const data = await getWorldTime();

    if (!data.length) {
      return m.reply("❌ Tidak dapat mengambil data world time");
    }

    // sort by timezone offset
    data.sort((a, b) => a.offset - b.offset);

    let msg = `
╭━━〔 🌍 VICTORIA MD WORLD TIME 〕
│
`.trim();

    for (let d of data) {
      msg += `├ ${d.flag} ${d.city} : ${d.time}\n`;
    }

    msg += `╰━━
⚡ Victoria MD • Global Time System`;

    await m.reply(msg);

  } catch (e) {
    console.log(e);
    await m.reply("❌ Error World Time System");
  }
};

handler.help = ["worldtime", "waktuglobal"];
handler.command = ["worldtime", "waktuglobal"];
handler.tags = ["internet"];

export default handler;