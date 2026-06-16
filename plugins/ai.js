let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    await m.react('✨')
    return m.reply(
      `Masukkan teks.\n\nContoh:\n${usedPrefix}${command} lagi ngapain?`,
      null,
      { quoted: global.fvn }
    )
  }

  try {
    await m.react('✨')

    const prompt = encodeURIComponent(
      `Kamu adalah Victoria AI, asisten utama dari Victoria MD.

Kepribadianmu tenang, cerdas, ramah, dan profesional.
Jawablah dengan bahasa Indonesia yang santai, jelas, dan mudah dipahami.
Sesekali boleh menggunakan humor ringan jika sesuai konteks.
Selalu berusaha membantu pengguna dengan cepat dan akurat.

Aturan :

- Berikan jawaban yang relevan dan langsung ke inti.
- Tetap sopan kepada semua pengguna.
- Jika tidak mengetahui sesuatu, katakan dengan jujur.
- Gunakan gaya percakapan yang natural seperti teman yang pintar dan membantu.
- Hindari penggunaan emoji berlebihan.
- Utamakan solusi yang praktis dan mudah diterapkan.

Identitas:
Nama: Victoria AI
Platform: Victoria MD
Developer: Fahri Andrian Saputra.`
    )

    const query = encodeURIComponent(text)
    const url = `https://api.deline.web.id/ai/openai?text=${query}&prompt=${prompt}`

    const res = await fetch(url)
    const json = await res.json()

    if (!json?.status) {
      return m.reply(
        'Hmm… kayaknya lagi nggak jalan.',
        null,
        { quoted: global.fvn }
      )
    }

    await m.reply(json.result, null, { quoted: global.fvn })
  } catch (e) {
    await m.reply(
      'Lagi error. Nanti aja.',
      null,
      { quoted: global.fvn }
    )
  }
}

handler.help = ['ai <teks>']
handler.tags = ['ai']
handler.command = /^ai$/i
handler.limit = true
handler.register = true

export default handler
