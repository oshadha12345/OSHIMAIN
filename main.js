const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const { loadSession } = require("./oshiya")
const settings = require("./settings")
const { handleCommand } = require("./lib/handler")

async function startBot() {

    // 🔹 Load session
    await loadSession()

    const { state, saveCreds } = await useMultiFileAuthState("./lib")

    const sock = makeWASocket({
        logger: pino({ level: "silent" }),
        auth: state
    })

    sock.ev.on("creds.update", saveCreds)

    // 📩 messages
    sock.ev.on("messages.upsert", async (m) => {
        const msg = m.messages[0]
        if (!msg.message) return

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text

        if (!text) return

        await handleCommand(sock, msg, text, settings)
    })

    // 🔌 connection
    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update

        if (connection === "close") {
            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut

            if (shouldReconnect) {
                startBot()
            } else {
                console.log("❌ Logged out")
            }
        } else if (connection === "open") {
            console.log("✅ Bot Connected")
        }
    })
}

startBot()
