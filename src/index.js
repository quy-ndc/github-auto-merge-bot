require("dotenv").config()
require("./server")
const MergePullRequest = require("./service/api").MergePullRequest
const createEmbedMessage = require("./util/create-embed-message").createEmbedMessage
const Reaction = require("./enum/reaction").Reaction
const ReactionID = require("./enum/reaction").ReactionID
const Color = require("./enum/color").Color

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
    console.log(`Reaction added: ${reaction.emoji.name}:${reaction.emoji.id}`)
    try {
        // User can't be a bot
        if (user.bot) return

        // Pull request is made in the correct channel
        if (reaction.message.channelId !== process.env.CODE_REVIEW_CHANNEL) return

        // Message is reacted with the correct reaction
        if (reaction.emoji.name !== Reaction.APPROVE) return

        // Reactor can't be the message's author
        if (user.id === reaction.message.author.id) return

        // Message must be a pull request link
        const match = reaction.message.content.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
        if (!match) return

        const [_, owner, repo, pullNumber] = match

        console.log(`Merging PR #${pullNumber} from ${owner}/${repo} as approved by ${user.tag}`)

        const loadingReaction = await reaction.message.react(`<:${Reaction.MERGING}:${ReactionID.MERGING}>`)

        try {
            const response = await MergePullRequest(owner, repo, pullNumber)

            if (response.merged) {
                await loadingReaction.remove()
                await reaction.message.react(`<:${Reaction.MERGE_SUCCESS}:${ReactionID.MERGE_SUCCESS}>`)
                const embed = createEmbedMessage(
                    Color.SUCCESS,
                    `Pull Request #${pullNumber} was merged successfully`,
                    `Merged by @${user.tag}`
                )
                await reaction.message.reply({ embeds: [embed] })
            } else {
                await loadingReaction.remove()
                await reaction.message.react(`<:${Reaction.FAILED}:${ReactionID.FAILED}>`)
                const embed = createEmbedMessage(
                    Color.FAIL,
                    `Pull Request #${pullNumber} failed to merged`,
                    `PR create by @${reaction.message.author.username}`
                )
                await reaction.message.reply({ embeds: [embed] })
            }
        } catch (err) {
            await loadingReaction.remove()
            await reaction.message.react(`<:${Reaction.WARNING}:${ReactionID.WARNING}>`)
            const embed = createEmbedMessage(
                Color.WARNING,
                `Pull Request #${pullNumber} ran into an error`,
                `Error: ${err.message}`
            )
            await reaction.message.reply({ embeds: [embed] })
        }
    } catch (err) {
        console.error("Error handling reaction:", err)
    }
})

client.login(process.env.DISCORD_BOT_TOKEN)