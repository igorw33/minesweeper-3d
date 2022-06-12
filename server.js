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
let newMove2 = {}
let startDate = Date.now()
let finalTime = 0
let victoryNum = 0
let collection = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
})
let singleArray = []

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

// Dodawanie usera - kliknięcie przycisku loguj na stronie
// Po udanym zalogowaniu na kliencie wyślij POST /CHECK_USERS

app.post("/ADD_USER", (req, res) => {
    let userInfo = JSON.parse(req.body)
    if (users.length >= 2) {
        console.log("nie można dodać - za dużo userów")
        res.send(JSON.stringify("error - nie można dodać, za dużo userów", null, 5))
    }
    else {
        if (users.length == 0) {
            users.push(userInfo.userName)
            singleArray = userInfo.minefield
            console.log(users)
            res.send(JSON.stringify({ users, singleArray, which: 1 }, null, 5));
        }
        else if (users.length == 1) {
            if (users[0] == userInfo.userName) {
                console.log("nie można dodać - jest już taki username")
                res.send(JSON.stringify("error - nie można dodać, jest już tak username", null, 5))
            }
            else {
                users.push(userInfo.userName)
                console.log(users)
                res.send(JSON.stringify({ users, singleArray, which: 2 }, null, 5));
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

// Reset

app.post("/RESET", (req, res) => {
    users = []
    singleArray = []
    victoryNum = 0
    res.send(JSON.stringify("Tablica została wyczyszczona", null, 5));
})

// Otrzymanie nowego ruchu

app.post("/NEW_MOVE", (req, res) => {
    newMove = JSON.parse(req.body)
    newMove2 = JSON.parse(req.body)
    console.log((Date.now() - startDate) / 1000)
    res.send(JSON.stringify(newMove))
})

// Sprawdzanie ostatniego ruchu, wykonuje się ciągle

app.post("/MOVE_CHECK", (req, res) => {
    let currentTime = (Date.now() - startDate) / 1000 + ""
    currentTime = currentTime.slice(0, -2)
    if (currentTime[currentTime.length - 1] == ".") {
        currentTime = currentTime + "0"
    }
    if (JSON.stringify(newMove) != JSON.stringify(lastChange)) {
        newMove = lastChange
        res.send(JSON.stringify({ status: newMove2, time: currentTime }))
    } else if (JSON.stringify(newMove2) != JSON.stringify(lastChange)) {
        lastChange = newMove2
        newMove = newMove2
        console.log(lastChange)
        res.send(JSON.stringify({ status: lastChange, time: currentTime }))
    } else {
        res.send(JSON.stringify({ status: "Nothing new", time: currentTime }))
    }
})

// Wygrana

app.post("/VICTORY", (req, res) => {
    if (victoryNum == 0) {
        victoryNum = 1
        let nick = users[0] + " & " + users[1]
        finalTime = (Date.now() - startDate) / 1000
        const doc = {
            nick: nick,
            time: finalTime
        }
        collection.insert(doc, function (err, newDoc) {
            console.log("dodano dokument (obiekt):")
            console.log(newDoc)
            res.send(JSON.stringify(newDoc, null, 5))
        })
    } else {
        res.send(JSON.stringify("foo", null, 5))
    }
})

// Zczytanie bazy rekordów

app.post("/READ_RECORDS", (req, res) => {
    collection.find({}, function (err, docs) {
        console.log(docs)
        res.send(JSON.stringify({ "docsy": docs }, null, 5))
    })
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})


