const { Events } = require("discord.js")
const { MergePullRequest } = require("../service/api")
const { createSuccessMergeMessage, createFailMergeMessage, createWarningMergeMessage } = require("../util/create-merged-message")
const { Reaction, ReactionID } = require("../enum/reaction")

module.exports = (client) => {
    client.on(Events.MessageReactionAdd, async (reaction, user) => {

        const match = reaction.message.content.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
        if (!match) return
        const [_, owner, repo, pullNumber] = match

        try {
            if (user.bot) return
            if (reaction.message.channelId !== process.env.CODE_REVIEW_CHANNEL) return
            if (reaction.emoji.name !== Reaction.APPROVE) return
            if (user.id === reaction.message.author.id) return

            console.log(`Merging PR #${pullNumber} from ${owner}/${repo} as approved by ${user.tag}`)

            const loadingReaction = await reaction.message.react(`<:${Reaction.MERGING}:${ReactionID.MERGING}>`)

            try {
                const response = await MergePullRequest(owner, repo, pullNumber)

                await loadingReaction.remove()

                if (response.merged) {
                    await reaction.message.react(`<:${Reaction.MERGE_SUCCESS}:${ReactionID.MERGE_SUCCESS}>`)
                    const message = createSuccessMergeMessage(pullNumber, user)
                    await reaction.message.reply(message)
                } else {
                    await reaction.message.react(`<:${Reaction.FAILED}:${ReactionID.FAILED}>`)
                    const message = createFailMergeMessage(pullNumber, reaction.message.author, response.message)
                    await reaction.message.reply(message)
                }
            } catch (err) {
                await loadingReaction.remove()
                const message = createWarningMergeMessage(pullNumber, reaction.message.author, err.message)
                await reaction.message.reply(message)
            }
        } catch (err) {
            await reaction.message.react(`<:${Reaction.FAILED}:${ReactionID.FAILED}>`)
            const message = createFailMergeMessage(pullNumber, reaction.message.author, err.message)
            await reaction.message.reply(message)
        }
    })
}
