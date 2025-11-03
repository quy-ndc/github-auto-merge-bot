require("dotenv").config()

const endpoint = process.env.GITHUB_ENDPOINT
const repoService = 'repos'

const API_ENDPOINT = {
    MERGE_PULL_REQUEST: `${endpoint}/${repoService}`,
}

module.exports = {
    API_ENDPOINT,
}
