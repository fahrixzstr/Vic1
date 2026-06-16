import fs from 'fs'
import path from 'path'
const DB_PATH = path.join(process.cwd(), 'src', 'database')
const OWNER_FILE = path.join(DB_PATH, 'owner.json')
const plus_FILE = path.join(DB_PATH, 'plus.json')
const PARTNER_FILE = path.join(DB_PATH, 'partner.json')

const CACHE_TTL = 30000
const cache = { owners: null, ownerTs: 0, plus: null, plusTs: 0, partners: null, partnerTs: 0 }

function ensureDbPath() {
    if (!fs.existsSync(DB_PATH)) {
        fs.mkdirSync(DB_PATH, { recursive: true })
    }
}

function loadOwners() {
    const now = Date.now()
    if (cache.owners && (now - cache.ownerTs) < CACHE_TTL) return cache.owners
    ensureDbPath()
    if (!fs.existsSync(OWNER_FILE)) {
        fs.writeFileSync(OWNER_FILE, JSON.stringify({ owners: [] }, null, 2))
    }
    try {
        const data = JSON.parse(fs.readFileSync(OWNER_FILE, 'utf-8'))
        cache.owners = data.owners || []
        cache.ownerTs = now
        return cache.owners
    } catch {
        return []
    }
}

function saveOwners(owners) {
    ensureDbPath()
    fs.writeFileSync(OWNER_FILE, JSON.stringify({ owners, updatedAt: new Date().toISOString() }, null, 2))
    cache.owners = owners
    cache.ownerTs = Date.now()
}

function loadplus() {
    const now = Date.now()
    if (cache.plus && (now - cache.plusTs) < CACHE_TTL) return cache.plus
    ensureDbPath()
    if (!fs.existsSync(plus_FILE)) {
        fs.writeFileSync(plus_FILE, JSON.stringify({ plus: [] }, null, 2))
    }
    try {
        const data = JSON.parse(fs.readFileSync(plus_FILE, 'utf-8'))
        cache.plus = data.plus || []
        cache.plusTs = now
        return cache.plus
    } catch {
        return []
    }
}

function saveplus(plus) {
    ensureDbPath()
    fs.writeFileSync(plus_FILE, JSON.stringify({ plus, updatedAt: new Date().toISOString() }, null, 2))
    cache.plus = plus
    cache.plusTs = Date.now()
}

function loadPartners() {
    const now = Date.now()
    if (cache.partners && (now - cache.partnerTs) < CACHE_TTL) return cache.partners
    ensureDbPath()
    if (!fs.existsSync(PARTNER_FILE)) {
        fs.writeFileSync(PARTNER_FILE, JSON.stringify({ partners: [] }, null, 2))
    }
    try {
        const data = JSON.parse(fs.readFileSync(PARTNER_FILE, 'utf-8'))
        cache.partners = data.partners || []
        cache.partnerTs = now
        return cache.partners
    } catch {
        return []
    }
}

function savePartners(partners) {
    ensureDbPath()
    fs.writeFileSync(PARTNER_FILE, JSON.stringify({ partners, updatedAt: new Date().toISOString() }, null, 2))
    cache.partners = partners
    cache.partnerTs = Date.now()
}

function matchJid(cleanA, cleanB) {
    return cleanA === cleanB || cleanA.endsWith(cleanB) || cleanB.endsWith(cleanA)
}

function isOwner(jid) {
    if (!jid) return false
    const cleanJid = jid.replace(/@.+/g, '')
    if (!cleanJid) return false

    const owners = loadOwners()
    return owners.some(o => {
        if (typeof o === 'string') return matchJid(cleanJid, o.replace(/[^0-9]/g, ''))
        const ownerNum = (o.number || o.jid || '').replace(/[^0-9]/g, '')
        return matchJid(cleanJid, ownerNum)
    })
}

function isplus(jid) {
    if (!jid) return false
    const cleanJid = jid.replace(/@.+/g, '')
    if (!cleanJid) return false

    const plusList = loadplus()
    const user = plusList.find(p => {
        if (typeof p === 'string') return matchJid(cleanJid, p.replace(/[^0-9]/g, ''))
        const plusNum = (p.number || p.jid || '').replace(/[^0-9]/g, '')
        return matchJid(cleanJid, plusNum)
    })

    if (!user) return false
    if (typeof user === 'string') return true
    if (user.expiredAt && new Date(user.expiredAt) < new Date()) {
        removeplus(cleanJid)
        return false
    }
    return true
}

function isPartner(jid) {
    if (!jid) return false
    const cleanJid = jid.replace(/@.+/g, '')
    if (!cleanJid) return false

    const partnerList = loadPartners()
    const user = partnerList.find(p => {
        if (typeof p === 'string') return matchJid(cleanJid, p.replace(/[^0-9]/g, ''))
        const partnerNum = (p.number || p.jid || '').replace(/[^0-9]/g, '')
        return matchJid(cleanJid, partnerNum)
    })

    if (!user) return false
    if (typeof user === 'string') return true
    if (user.expiredAt && new Date(user.expiredAt) < new Date()) {
        removePartner(cleanJid)
        return false
    }
    return true
}

function addOwner(jid, name = 'Unknown') {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    if (isOwner(cleanJid)) return { success: false, message: 'Sudah menjadi owner' }

    const owners = loadOwners()
    owners.push({
        jid: cleanJid,
        number: cleanJid,
        name,
        addedAt: new Date().toISOString()
    })
    saveOwners(owners)
    return { success: true, message: 'Berhasil ditambahkan sebagai owner' }
}

function removeOwner(jid) {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    const owners = loadOwners()
    const index = owners.findIndex(o => o.number === cleanJid || o.jid === cleanJid)
    if (index === -1) return { success: false, message: 'Tidak ditemukan di daftar owner' }

    owners.splice(index, 1)
    saveOwners(owners)
    return { success: true, message: 'Berhasil dihapus dari owner' }
}

function addplus(jid, days = 30, name = 'Unknown') {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    const plusList = loadplus()

    const existing = plusList.findIndex(p => p.number === cleanJid || p.jid === cleanJid)
    const expiredAt = new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toISOString()

    if (existing !== -1) {
        const currentExpiry = new Date(plusList[existing].expiredAt || 0)
        const baseTime = currentExpiry > new Date() ? currentExpiry : new Date()
        plusList[existing].expiredAt = new Date(baseTime.getTime() + (days * 24 * 60 * 60 * 1000)).toISOString()
        plusList[existing].name = name || plusList[existing].name
        saveplus(plusList)
        return { success: true, message: `plus diperpanjang ${days} hari`, expiredAt: plusList[existing].expiredAt }
    }

    plusList.push({
        jid: cleanJid,
        number: cleanJid,
        name,
        addedAt: new Date().toISOString(),
        expiredAt
    })
    saveplus(plusList)
    return { success: true, message: `Berhasil ditambahkan sebagai plus ${days} hari`, expiredAt }
}

function removeplus(jid) {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    const plusList = loadplus()
    const index = plusList.findIndex(p => p.number === cleanJid || p.jid === cleanJid)
    if (index === -1) return { success: false, message: 'Tidak ditemukan di daftar plus' }

    plusList.splice(index, 1)
    saveplus(plusList)
    return { success: true, message: 'Berhasil dihapus dari plus' }
}

function addPartner(jid, days = 30, name = 'Unknown') {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    const partnerList = loadPartners()

    const existing = partnerList.findIndex(p => p.number === cleanJid || p.jid === cleanJid)
    const expiredAt = new Date(Date.now() + (days * 24 * 60 * 60 * 1000)).toISOString()

    if (existing !== -1) {
        const currentExpiry = new Date(partnerList[existing].expiredAt || 0)
        const baseTime = currentExpiry > new Date() ? currentExpiry : new Date()
        partnerList[existing].expiredAt = new Date(baseTime.getTime() + (days * 24 * 60 * 60 * 1000)).toISOString()
        partnerList[existing].name = name || partnerList[existing].name
        savePartners(partnerList)
        return { success: true, message: `Partner diperpanjang ${days} hari`, expiredAt: partnerList[existing].expiredAt }
    }

    partnerList.push({
        jid: cleanJid,
        number: cleanJid,
        name,
        addedAt: new Date().toISOString(),
        expiredAt
    })
    savePartners(partnerList)
    return { success: true, message: `Berhasil ditambahkan sebagai partner ${days} hari`, expiredAt }
}

function removePartner(jid) {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    const partnerList = loadPartners()
    const index = partnerList.findIndex(p => p.number === cleanJid || p.jid === cleanJid)
    if (index === -1) return { success: false, message: 'Tidak ditemukan di daftar partner' }

    partnerList.splice(index, 1)
    savePartners(partnerList)
    return { success: true, message: 'Berhasil dihapus dari partner' }
}

function getOwnerList() {
    return loadOwners()
}

function getplusList() {
    const plusList = loadplus()
    const now = new Date()
    return plusList.filter(p => {
        if (p.expiredAt && new Date(p.expiredAt) < now) {
            removeplus(p.number || p.jid)
            return false
        }
        return true
    })
}

function getplusInfo(jid) {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    const plusList = loadplus()
    return plusList.find(p => p.number === cleanJid || p.jid === cleanJid) || null
}

function getPartnerList() {
    const partnerList = loadPartners()
    const now = new Date()
    return partnerList.filter(p => {
        if (p.expiredAt && new Date(p.expiredAt) < now) {
            removePartner(p.number || p.jid)
            return false
        }
        return true
    })
}

function getPartnerInfo(jid) {
    const cleanJid = jid?.replace(/@.+/g, '') || ''
    const partnerList = loadPartners()
    return partnerList.find(p => p.number === cleanJid || p.jid === cleanJid) || null
}

export { loadOwners, saveOwners, loadplus, saveplus, loadPartners, savePartners, isOwner, isplus, isPartner, addOwner, removeOwner, addplus, removeplus, addPartner, removePartner, getOwnerList, getplusList, getplusInfo, getPartnerList, getPartnerInfo }