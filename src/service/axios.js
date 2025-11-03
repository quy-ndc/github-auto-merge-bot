const axios = require("axios")
require("dotenv").config()

const axiosClient = axios.create({
    timeout: 10000,
})

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = process.env.GITHUB_TOKEN
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`
        }
        config.headers["Content-Type"] = "application/json"
        config.headers["Accept"] = "application/vnd.github+json"
        return config
    },
    (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("❌ Axios error:", error.message)
        return Promise.reject(error)
    }
)

module.exports = { axiosClient }
