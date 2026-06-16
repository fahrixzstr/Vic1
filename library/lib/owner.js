import { OWNER_NUMBER } from "../config.js"

export const isOwner = (m) => {
  let sender = m.sender?.split("@")[0]
  return sender === OWNER_NUMBER
}