class Net {

    // Logowanie

    login(username) {
        let body = {
            userName: username,
            minefield: game.mineFieldArrayHelper
        }
        body = JSON.stringify(body)
        fetch("/ADD_USER", { method: "post", body })
            .then(response => response.json())
            .then(data => {
                if (data.users != undefined) {
                    ui.createLoadScr()
                    console.log(data)

                    if (data.which == 2) {
                        game.generateForSecondPlayer(data.singleArray)
                    }
                    var sprawdzanie = setInterval(function () {
                        fetch("/CHECK_USERS", { method: "post" })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                if (data == "Koniec") {
                                    clearInterval(sprawdzanie)
                                    net.moveCheck()
                                    ui.removeLoadScr()
                                }
                            })
                            .catch(error => console.log(error))
                    }, 500);
                }
                else {
                    // Obsługa błędów, np. niepoprawny nick, za dużo graczy
                    alert(data)
                }
            })
            .catch(error => console.log(error))
    }

    // Reset

    reset() {
        fetch("/RESET", { method: "post" })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                alert(data)
            })
            .catch(error => console.log(error))
    }

    // Sprawdzanie ostatniej zmiany

    moveCheck() {
        let chk = setInterval(function () {
            fetch("/MOVE_CHECK", { method: "post" })
                .then(response => response.json())
                .then(data => {

                    if (data.status != "Nothing new") {
                        console.log(data)

                        if (data.status.moveInfo == "Victory") {
                            clearInterval(chk)
                            ui.writeVictory()
                        } else if (data.status.moveInfo == "Defeat") {
                            clearInterval(chk)
                            ui.writeDefeat()
                        } else {
                            if (data.status.moveInfo.action == 0) {
                                game.cubeCheck(data.status.moveInfo.cubeInArray, data.status.moveInfo.xxIndex, data.status.moveInfo.yyIndex, data.status.moveInfo.zzIndex)
                            } else if (data.status.moveInfo.action == 1) {
                                game.cubeFlag(data.status.moveInfo.cubeInArray, data.status.moveInfo.xxIndex, data.status.moveInfo.yyIndex, data.status.moveInfo.zzIndex)
                            } else {
                                game.cubeUnFlag(data.status.moveInfo.cubeInArray, data.status.moveInfo.xxIndex, data.status.moveInfo.yyIndex, data.status.moveInfo.zzIndex)
                            }

                        }
                    } else {
                        // console.log(data)
                    }
                    ui.updateCounter(data.time)
                })
                .catch(error => console.log(error))
        }, 100);
    }

    // Wysyłanie ruchu
    // Ważne - jeśli gra jest wygrana, należy wysłać najpierw ostatni ruch, a potem wywołać funkcję sendMove("Victory")
    // Jeśli gra jest przegrana, należy wysłać najpierw ostatni ruch, a potem wywołać funkcję sendMove("Defeat")

    sendMove(moveInfo) {
        let body = { moveInfo }
        body = JSON.stringify(body)
        fetch("/NEW_MOVE", { method: "post", body })
            .then(response => response.json())
            .then(data => {
                if (data.moveInfo == "Victory") {
                    fetch("/VICTORY", { method: "post" })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data)
                        })
                        .catch(error => console.log(error))
                }
            })
            .catch(error => console.log(error))
    }

    // Pobranie rekordów

    getRecords() {
        fetch("/READ_RECORDS", { method: "post" })
            .then(response => response.json())
            .then(data => {
                ui.writeRecords(data)
            })
            .catch(error => console.log(error))
    }
}