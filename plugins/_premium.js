let handler = m => m

handler.before = async function (m) {
    let user = db.data.users[m.sender]
    if (user.role === 'Pluss user' && user.plusTime < Date.now()) {
        user.role = 'Free user'
        user.plusTime = 0
        user.plus = false
    }
}

export default handler
