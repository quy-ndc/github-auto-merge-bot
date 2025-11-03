const { EmbedBuilder } = require("discord.js")

/**
 * Creates a standardized embed message
 * @param {string | number} color - Hex color (e.g., "#00ff00" or 0x00ff00)
 * @param {string} title - Title of embed message
 * @param {string} desc - Description of embed message
 * @returns {EmbedBuilder}
 */
function createEmbedMessage(color, title, desc) {
    const embed = new EmbedBuilder()
        .setColor(typeof color === "string" ? parseInt(color.replace("#", ""), 16) : color)
        .setTitle(title)
        .setDescription(desc)
        .setTimestamp()
        
    return embed
}

module.exports = { createEmbedMessage }
