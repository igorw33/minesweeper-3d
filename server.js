const { application } = require("express")
const Datastore = require('nedb')
var express = require("express")
var app = express()
var path = require("path")
const PORT = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.text())

app.use(express.static('static'))


let users = []
let lastChange = {}
let newMove = {}
let startDate = Date.now()
const collection = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

// Dodawanie usera - kliknięcie przycisku loguj na stronie
// Po udanym zalogowaniu na kliencie wyślij POST /CHECK_USERS

app.post("/ADD_USER", (req, res) => {
    let userInfo = req.body
    if (users.length >= 2) {
        console.log("nie można dodać - za dużo userów")
        res.send(JSON.stringify("error - nie można dodać, za dużo userów", null, 5))
    }
    else {
        if (users.length == 0) {
            users.push(userInfo.userName)
            console.log(users)
            res.send(JSON.stringify(users, null, 5));
        }
        else if (users.length == 1) {
            if (users[0] == userInfo.userName) {
                console.log("nie można dodać - jest już taki username")
                res.send(JSON.stringify("error - nie można dodać, jest już tak username", null, 5))
            }
            else {
                users.push(userInfo.userName)
                console.log(users)
                res.send(JSON.stringify(users, null, 5));
            }
        }
    }
})

// Sprawdzanie ilości Userów

app.post("/CHECK_USERS", (req, res) => {
    console.log("sprawdzam ilość userów...")
    console.log(users)
    if (users.length == 2) {
        startDate = Date.now()
        // Koniec czekania, początek gry
        res.send(JSON.stringify("Koniec", null, 5))
    }
    else {
        // Ekran czekania
        res.send(JSON.stringify("Czekaj na drugiego gracza", null, 5))
    }
})

// Otrzymanie nowego ruchu

app.post("/NEW_MOVE", (req, res) => {
    newMove = req.body
    res.send(JSON.stringify(newMove))
})

// Sprawdzanie ostatniego ruchu, wykonuje się ciągle

app.post("/MOVE_CHECK", (req, res) => {
    if (JSON.stringify(newMove) != JSON.stringify(lastChange)) {
        lastChange = newMove
        res.send(JSON.stringify(lastChange))
    } else {
        res.send(null)
    }
})

// Wygrana

app.post("/VICTORY", (req, res) => {
    let info = req.body
    let nick = info.nick
    let time = (Date.now() - startDate) / 1000
    const doc = {
        nick: nick,
        time: time
    }
    collection.insert(doc, function (err, newDoc) {
        console.log("dodano dokument (obiekt):")
        console.log(newDoc)
        res.send(JSON.stringify(newDoc, null, 5))
    })
})

// Zczytanie bazy rekordów

app.post("/READ_RECORDS", (req, res) => {
    collection.find({}, function (err, docs) {
        res.send(JSON.stringify({ "docsy": docs }, null, 5))
    })
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})


