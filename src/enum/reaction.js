const Reaction = Object.freeze({
  APPROVE: "approved",
  MERGING: "merging",
  MERGE_SUCCESS: "merged",
  FAILED: "fail",
  WARNING: "warning"
})

const ReactionID = Object.freeze({
  APPROVE: "1434809089904349194",
  MERGING: "1434810180708733008",
  MERGE_SUCCESS: "1434809522760712294",
  FAILED: "1434916510719148102",
  WARNING: "1434931333259595907"
})

module.exports = { Reaction, ReactionID }