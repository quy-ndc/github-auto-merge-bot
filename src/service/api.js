const { axiosClient } = require("./axios")
const { API_ENDPOINT } = require("./endpoint")

/**
 * Merge a pull request
 * @param {string} owner
 * @param {string} repo
 * @param {number} pullNumber
 */
async function MergePullRequest(owner, repo, pullNumber) {
    try {
        const response = await axiosClient.put(`${API_ENDPOINT.MERGE_PULL_REQUEST}/${owner}/${repo}/pulls/${pullNumber}/merge`, {
            merge_method: "squash",
        })
        return response.data
    } catch (error) {
        throw error
    }
}

module.exports = {
    MergePullRequest,
}
