require("dotenv").config()
const MergePullRequest = require("./service/api").MergePullRequest
const Reaction = require("./enum/reaction").Reaction
const ReactionID = require("./enum/reaction").ReactionID

const { Client, GatewayIntentBits, Events } = require('discord.js')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`)
})

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    try {
        // User can't be a bot
        if (user.bot) return

        // Pull request is made in the correct channel
        if (reaction.message.channelId !== process.env.CODE_REVIEW_CHANNEL) return

        // Message is reacted with the correct reaction
        if (reaction.emoji.name !== Reaction.APPROVE) return

        // Reactor can't be the message's author
        // if (user.id === reaction.message.author.id) return

        // Message must be a pull request link
        const match = reaction.message.content.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
        if (!match) return

        const [_, owner, repo, pullNumber] = match

        console.log(`Merging PR #${pullNumber} from ${owner}/${repo} as approved by ${user.tag}`)

        const loadingReaction = await reaction.message.react(`<:${Reaction.MERGING}:${ReactionID.MERGING}>`)

        setTimeout(async () => {
            await loadingReaction.remove()
        }, 1000)

        await reaction.message.react(`<:${Reaction.MERGE_SUCCESS}:${ReactionID.MERGE_SUCCESS}>`)

        // try {
        //     const response = await MergePullRequest(owner, repo, pullNumber)

        //     if (result.merged) {
        //         await reaction.message.react("✅")
        //         await reaction.message.reply(
        //             `✅ Successfully merged **PR #${pullNumber}** from **${repo}**.`
        //         )
        //     } else {
        //         await reaction.message.react("⚠️")
        //         await reaction.message.reply(
        //             `⚠️ Merge attempt failed for **PR #${pullNumber}**: ${result.message}`
        //         )
        //     }
        // } catch (err) {
        //     await reaction.message.react("❌")
        //     await reaction.message.reply(
        //         `❌ Failed to merge **PR #${pullNumber}**. Error: ${err.message}`
        //     )
        // }

    } catch (err) {
        console.error("Error handling reaction:", err)
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)