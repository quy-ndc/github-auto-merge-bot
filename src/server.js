const express = require("express")

const app = express()

app.get("/", (req, res) => {
  res.send("Discord bot is running!")
})

const PORT = process.env.PORT || 8080
app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on ${PORT}`));
