module.exports = {
    name: "alive",

    async execute(sock, msg, args) {
        await sock.sendMessage(msg.key.remoteJid, {
            text: "🤖 Bot is Alive & Running!"
        })
    }
}
