import fetch from 'node-fetch';

let handler = async (m, { command }) => {
  try {

    // =========================
    // BASE API (AMAN)
    // =========================
    const base = (path) => `https://api.lolhuman.xyz${path}`;

    let url;

    switch (command) {
      case 'cnn': url = base('/api/news/cnn'); break;
      case 'cnn-ekonomi': url = base('/api/news/cnn/ekonomi'); break;
      case 'cnn-hiburan': url = base('/api/news/cnn/hiburan'); break;
      case 'cnn-internasional': url = base('/api/news/cnn/internasional'); break;
      case 'cnn-nasional': url = base('/api/news/cnn/nasional'); break;
      case 'cnn-olahraga': url = base('/api/news/cnn/olahraga'); break;
      case 'cnn-social': url = base('/api/news/cnn/social'); break;
      case 'cnn-teknologi': url = base('/api/news/cnn/teknologi'); break;
      case 'detik': url = base('/api/news/detik'); break;
      case 'jalantikus': url = base('/api/news/jalantikus'); break;
      case 'kumparan': url = base('/api/news/kumparan'); break;
      case 'liputan6': url = base('/api/news/liputan6'); break;
      case 'republika': url = base('/api/news/republika'); break;
      case 'nasional': url = base('/api/news'); break;
      default:
        return m.reply('❌ Command tidak valid');
    }

    // =========================
    // FETCH SAFETY
    // =========================
    let res = await fetch(url);
    if (!res.ok) throw new Error('API error');

    let json = await res.json();

    if (!json?.result?.length) {
      return m.reply('📰 Tidak ada berita ditemukan saat ini.');
    }

    let berita = json.result.slice(0, 5);

    // =========================
    // FORMAT VICTORIA STYLE
    // =========================
    let teks = `
╭━━〔 📰 VICTORIA MD NEWS 〕
│
`.trim();

    for (let b of berita) {
      teks += `
├ 🧾 ${b.title}
├ 🔗 ${b.link}
│
`;
    }

    teks += `╰━━
⚡ Victoria MD • News Center`;

    await m.reply(teks);

  } catch (e) {
    console.log(e);
    m.reply('❌ Gagal mengambil berita (API down / error)');
  }
};

handler.help = [
  'cnn','cnn-ekonomi','cnn-hiburan','cnn-internasional',
  'cnn-nasional','cnn-olahraga','cnn-social','cnn-teknologi',
  'detik','jalantikus','kumparan','liputan6','republika','nasional'
];

handler.tags = ['internet'];

handler.command = /^(cnn|cnn-ekonomi|cnn-hiburan|cnn-internasional|cnn-nasional|cnn-olahraga|cnn-social|cnn-teknologi|detik|jalantikus|kumparan|liputan6|republika|nasional)$/i;

handler.limit = true;

export default handler;