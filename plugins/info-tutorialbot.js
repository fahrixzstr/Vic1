let menu = async (m, { conn }) => {

let text = `
╔══════════════════════════════╗
║         TUTORIAL PEMAKAIAN BOT          ║
╚══════════════════════════════╝

┌─ 👤 USER PANEL
│ • .daftar → Register user
│ • .profile → Lihat profil
│ • .limit → Cek limit
└──────────────────────────────

┌─ 📖 MAIN MENU
│ • .menu → Semua fitur
│ • .tutorial → Cara pakai bot
│ • .owner → Kontak owner
└──────────────────────────────

┌─ 🧩 STICKER & MEDIA
│ • .brat → Sticker text
│ • .toimg → Sticker ke gambar
│ • .qc → Quote card
└──────────────────────────────

┌─ 🎬 DOWNLOADER
│ • .tiktok → Download TikTok
│ • .tt → Short link TikTok
│ • .play → Musik YouTube
└──────────────────────────────

┌─ 🎮 GAME SYSTEM
│ • .susunkata
│ • .tebakangka
│ • .rpg status
└──────────────────────────────

┌─ 🏦 ECONOMY (RPG)
│ • .bank
│ • .kerja
│ • .inventory
└──────────────────────────────

┌─ 🤖 AI & TOOLS
│ • .ai → Chat AI
│ • .removebg → Hapus background
│ • .ocr → Text scanner
└──────────────────────────────

┌─ ⚙️ SYSTEM
│ • Prefix : . / /
│ • Status : ONLINE 🟢
└──────────────────────────────

╔══════════════════════════════╗
║         ⚡ Powered by Victoria MD           ║
╚══════════════════════════════╝
`

await conn.sendMessage(m.chat, {
  text
}, { quoted: global.fkontak || m })

}

menu.help = ["menu", "dashboard"]
menu.tags = ["main"]
menu.command = /^(menu|dashboard)$/i

export default menu