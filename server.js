const { application } = require("express");
var express = require("express")
var app = express()
var path = require("path")
const PORT = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.text())

app.use(express.static('static'))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/index.html"))
    console.log("test")
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})


