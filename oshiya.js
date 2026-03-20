const fs = require("fs-extra")
const settings = require("./settings")

const path = "./lib/creds.json"

async function loadSession() {
    try {
        if (fs.existsSync(path)) {
            console.log("✅ Session already exists")
            return
        }

        const base64 = settings.SESSION

        if (!base64 || base64 === "PUT_YOUR_BASE64_HERE") {
            console.log("❌ SESSION not found in settings.js")
            return
        }

        const buffer = Buffer.from(base64, "base64")

        await fs.outputFile(path, buffer)

        console.log("✅ creds.json created")
    } catch (err) {
        console.log("❌ Session error:", err)
    }
}

module.exports = { loadSession }
