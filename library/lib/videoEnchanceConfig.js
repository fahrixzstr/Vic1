// 💫 Name Fitur : ENCHANCE VIDIO 
// 📌 Create By FahriXz
// 📣 Chanel WhatsApp: https://whatsapp.com/channel/0029Vb8C8TI545uvU3EaJ72g
// plugin creation date : June 16, 2026
// Type LIB

export const VIDEO_PRESET = {
  "480-30": {
    name: "480P AI UPSCALE FREE",
    fps: 30,
    premium: false,
    limit: 2,
    crf: 28
  },

  "720-30": {
    name: "720P HD FREE",
    fps: 30,
    premium: false,
    limit: 7,
    crf: 23
  },

  "730-60": {
    name: "730P ULTRA 60FPS PLUS",
    fps: 60,
    premium: true,
    limit: 3,
    crf: 20
  },

  "1080-30": {
    name: "1080P FULL HD FREE",
    fps: 30,
    premium: false,
    limit: 14,
    crf: 18
  },

  "1080-60": {
    name: "1080P 60FPS PLUS",
    fps: 60,
    premium: true,
    limit: 50,
    crf: 16
  },

  "2k-30": {
    name: "2K AI UPSCALE FREE (3 WEEKS ONCE)",
    fps: 30,
    premium: false,
    limit: 1, // special rule handled separately
    cooldown: 21 * 24 * 60 * 60 * 1000,
    crf: 16
  },

  "2k-60": {
    name: "2K 60FPS PLUS STANDARD",
    fps: 60,
    premium: true,
    limit: 70,
    crf: 14
  },

  "4k-30": {
    name: "4K 30FPS PLUS",
    fps: 30,
    premium: true,
    limit: 100,
    crf: 12
  },

  "4k-60": {
    name: "4K 60FPS PLUS STANDARD",
    fps: 60,
    premium: true,
    limit: 110,
    crf: 10
  },

  "8k-30": {
    name: "8K 30FPS PLUS",
    fps: 30,
    premium: true,
    limit: 115,
    crf: 10
  },

  "8k-60": {
    name: "8K 60FPS PLUS STANDARD",
    fps: 60,
    premium: true,
    limit: 120,
    crf: 9
  },

  "8k-120": {
    name: "8K 120FPS PLUS QUALITY",
    fps: 120,
    premium: true,
    limit: 125,
    crf: 8
  },

  "pro-30": {
    name: "PRO 30FPS PLUS",
    fps: 30,
    premium: true,
    limit: 100,
    crf: 11
  },

  "pro-60": {
    name: "PRO 60FPS PLUS STANDARD",
    fps: 60,
    premium: true,
    limit: 130,
    crf: 9
  },

  "pro-120": {
    name: "PRO 120FPS PLUS QUALITY",
    fps: 120,
    premium: true,
    limit: 150,
    crf: 7
  }
}