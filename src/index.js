require("dotenv").config()
require("./server")
const { client } = require("./client")

require("./listeners/merge-pull-request")(client)

client.once("clientReady", () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.login(process.env.DISCORD_BOT_TOKEN)