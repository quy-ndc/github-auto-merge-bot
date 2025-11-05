const { createPullRequestLink } = require("./create-pr-link")

function createSuccessMergeMessage(pullNumber, user) {
  if (!pullNumber || !user) {
    throw new Error("pullNumber and user are required.")
  }

  const prText = `Pull Request ${createPullRequestLink(pullNumber)} **was successfully merged**`
  const mergedBy = `**Approved by: <@${user.id}>**`

  return `${prText}\n\n${mergedBy}`
}

function createFailMergeMessage(pullNumber, user, error) {
  if (!pullNumber || !user) {
    throw new Error("pullNumber and user are required.")
  }

  const prText = `Pull Request ${createPullRequestLink(pullNumber)} **failed to merge**`
  const mergedBy = `**PR Author: <@${user.id}>**`
  const errorText = `**Error: ${error}**`

  return `${prText}\n\n${mergedBy}\n\n${errorText}`
}

function createWarningMergeMessage(pullNumber, user) {
  if (!pullNumber || !user) {
    throw new Error("pullNumber and user are required.")
  }

  const prText = `Pull Request ${createPullRequestLink(pullNumber)} **ran into a problem**`
  const mergedBy = `**PR Author: <@${user.id}>**`
  const errorText = `**Error: ${error}**`

  return `${prText}\n\n${mergedBy}\n\n${errorText}`
}

module.exports = { createSuccessMergeMessage, createFailMergeMessage, createWarningMergeMessage }