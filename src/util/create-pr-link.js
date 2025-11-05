require("dotenv").config()

/**
 * Creates a clickable pull request link for Discord
 * @param {number|string} pullNumber - The PR number
 * @returns {string} A formatted markdown link (e.g. [#42](https://github.com/user/repo/pull/42))
 */

function createPullRequestLink(pullNumber) {
    return `[#${pullNumber}](https://github.com/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/pull/${pullNumber})`
}
module.exports = { createPullRequestLink }