const express = require("express")
const app = express()

app.post("/", (req, res) => { 
    res.send("Requisites")
})
app.listen(5173)