import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone'

let wibh = moment.tz('Asia/Jakarta').format('HH')
let wibm = moment.tz('Asia/Jakarta').format('mm')
let wibs = moment.tz('Asia/Jakarta').format('ss')
let wktuwib = `${wibh} H ${wibm} M ${wibs} S`

let d = new Date(Date.now() + 3600000)
let locale = 'id'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

global.fahriown = [['6287895917725', 'Fahri', true]]
global.mods = []
global.plus = []
global.victoriaxfahrixz = '6285609949819'
global.fahrinr = '6287895917725'
global.nameown = 'ғᴀʜʀɪxᴢ'
global.version = '1.0'
global.autotyping = true
global.autorecording = false

global.readMore = readMore
global.fahrivic = 'FAHRI ANDRIAN SAPUTRA'
global.victoria = 'vɪᴄᴛᴏʀɪᴀ'
global.wm = 'ғᴀʜʀɪxᴢ'
global.watermark = global.wm

global.botdate = ` ⪡⪢  DATE: ${week} ${date}\n ⪡⪢  TIME: ${wktuwib}`
global.bottime = `TIME: ${wktuwib}`
global.stickpack = `vɪᴄᴛᴏʀɪᴀ ⌬\nPowered by ${global.victoria}\nwa.me/${global.victoriaxfahrixz}`
global.stickauth = 'ʙʏ ғᴀʜʀɪxᴢ'
global.week = `${week} ${date}`
global.wibb = wktuwib

global.sig = 'https://instagram.com/fhrandrnsptra'
global.sgh = '-'
global.sgc = '_'
global.sgw = '_'
global.sdc = '-'
global.sfb = ''
global.snh = ''

global.egg = "15"
global.nestid = "5"
global.loc = "1"
global.domain = "-"
global.apikey = "-"
global.capikey = "-"

global.qris = './assets/qris.jpg'
global.psaweria = '_'

global.menuThumb = './assets/thumbnail.jpg'
global.menuAudio = 'https://files.catbox.moe/ceywft.mp3'

global.chId = '120363427507227571@newsletter'
global.newsletterName = '「 VICTORIA MD 」'

global.dmenut = '━━═━━═〈'
global.dmenub = '┊♦'
global.dmenub2 = '┊'
global.dmenuf = '┗━━━═━━––––––♣'
global.dashmenu = '━━═━━═❏ DASHBOARD ❏═━━═━━'
global.cmenut = '❏━━═━━═━━『'
global.cmenuh = '』━━═━━'
global.cmenub = '┊♦ '
global.cmenuf = '┗━━━═━━––––––♣\n'
global.cmenua = '\n⌕ ❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘ ⌕\n'
global.pmenus = '♣'
global.htki = '━━═━━『'
global.htka = '』━━═━━'
global.lopr = 'Ⓟ'
global.lolm = 'Ⓛ'
global.htjava = '⪡⪢'
global.hsquere = ['⛶', '❏', '⪡⪢']

global.welcomeBg = 'https://cdn.nekohime.site/file/idOeNDdc.jpg'
global.goodbyeBg = 'https://cdn.nekohime.site/file/9EiSMCKy.jpg'

global.wait = '✨ Please Wait...'
global.eror = 'Error!'

global.APIs = {
  ryzen: 'https://api.ryzendesu.vip',
  faa: 'https://api-faa.my.id',
  lol: 'https://api.lolhuman.xyz',
  deline: 'https://api.deline.web.id'
}

global.APIKeys = {
  'https://api.lolhuman.xyz': 'ISI_APIKEY_KAMU'
}

global.flaaa2 = [
  "https://flamingtext.com/net-fu/proxy_form.cgi?...&text=",
  "https://flamingtext.com/net-fu/proxy_form.cgi?...&text=",
  "https://flamingtext.com/net-fu/proxy_form.cgi?...&text="
]

global.fla = [...global.flaaa2]

global.rpg = {
  emoticon(string) {
    string = string.toLowerCase()
    const emot = {
      level: '🧬',
      limit: '🌌',
      health: '❤️',
      exp: '✉️',
      money: '💵',
      potion: '🥤',
      diamond: '💎',
      sword: '⚔️',
      pickaxe: '⛏️',
      fishingrod: '🎣',
      wood: '🪵',
      rock: '🪨',
      dragon: '🐉',
      wolf: '🐺',
      cat: '🐈',
      dog: '🐕',
      ikan: '🐟',
      sapi: '🐄',
      ayam: '🐔',
      rumahsakit: '🏥'
    }

    let results = Object.keys(emot)
      .map(v => [v, new RegExp(v, 'gi')])
      .filter(v => v[1].test(string))

    if (!results.length) return ''
    return emot[results[0][0]]
  }
}

const file = fileURLToPath(import.meta.url)

watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("config.js updated"))
  import(`${file}?update=${Date.now()}`)
})