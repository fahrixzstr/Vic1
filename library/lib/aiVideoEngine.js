// 💫 Name Fitur : ai vidio engine
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type LIB 

export const CINEMATIC_PRESET = {
  cinematic_dark: {
    name: "CINEMATIC DARK (Netflix Style)",
    vf: "minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:vsbmc=1,eq=contrast=1.2:saturation=1.1:brightness=-0.05,format=yuv420p",
    crf: 16
  },

  cinematic_warm: {
    name: "CINEMATIC WARM (Film Tone)",
    vf: "minterpolate=fps=60:mi_mode=mci,eq=contrast=1.1:saturation=1.25:gamma=1.05,curves=preset=vintage",
    crf: 17
  },

  anime_hd: {
    name: "ANIME HD AI STYLE",
    vf: "minterpolate=fps=60:mi_mode=mci,unsharp=5:5:1.5:5:5:0.0,eq=contrast=1.3:saturation=1.4",
    crf: 18
  },

  smooth_ultra: {
    name: "ULTRA SMOOTH MOTION AI",
    vf: "minterpolate=fps=120:mi_mode=mci:mc_mode=aobmc:vsbmc=1,unsharp=7:7:1.2",
    crf: 14
  },

  hdr_pro: {
    name: "HDR PRO CINEMATIC AI",
    vf: "minterpolate=fps=60,eq=contrast=1.4:saturation=1.3:gamma=1.1:brightness=0.02,format=yuv420p",
    crf: 12
  }
}