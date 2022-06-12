class Ui {
    // constructor() {
    //     this.input = document.getElementById("btn")
    //     this.resett = document.getElementById("reset")
    //     this.input.addEventListener("click", function () {
    //         this.username = document.getElementById("username").value
    //         net.login(this.username)
    //     })
    //     this.resett.addEventListener("click", function () {
    //         net.reset()
    //     })
    // }
    // createLoadScr() {
    //     document.getElementById("container").innerHTML = ""
    //     let wait = document.createElement("div")
    //     let loader = document.createElement("div")
    //     loader.id = "loader"
    //     wait.id = "wait"
    //     wait.innerHTML = "Czekaj na drugiego gracza"
    //     document.getElementById("container").appendChild(wait)
    //     document.getElementById("container").appendChild(loader)
    // }

    // removeLoadScr() {
    //     document.body.removeChild(document.getElementById("startingBg"))
    //     document.body.removeChild(document.getElementById("container"))
    //     document.body.removeChild(document.getElementById("records"))
    // }

    // getRecords() {
    //     net.getRecords()
    // }

    // writeRecords(records) {
    //     console.log(records)
    //     records.docsy.sort((a, b) => {
    //         return a.time - b.time;
    //     })
    //     let x = 0
    //     while (x < records.docsy.length) {
    //         if (x == 10) {
    //             break
    //         }
    //         document.getElementById("records").innerHTML += `${x + 1}. ${records.docsy[x].nick}: ${records.docsy[x].time}<br>`
    //         x++
    //     }
    // }

    // writeVictory() {
    //     let container = document.createElement("div")
    //     let bg = document.createElement("div")
    //     let wait = document.createElement("div")
    //     container.id = "container"
    //     wait.id = "wait"
    //     bg.id = "latterBg"
    //     wait.innerHTML = "Brawo, wygraliście!"
    //     container.appendChild(wait)
    //     document.body.appendChild(bg)
    //     document.body.appendChild(container)
    // }

    // writeDefeat() {
    //     let container = document.createElement("div")
    //     let bg = document.createElement("div")
    //     let wait = document.createElement("div")
    //     container.id = "container"
    //     wait.id = "wait"
    //     bg.id = "latterBg"
    //     wait.innerHTML = "Niestety, ale przegraliście :("
    //     container.appendChild(wait)
    //     document.body.appendChild(bg)
    //     document.body.appendChild(container)
    // }
}