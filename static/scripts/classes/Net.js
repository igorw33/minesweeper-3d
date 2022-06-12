class Net {

    // Logowanie

    login(username) {
        let body = {
            userName: username,
            minefield: game.mineFieldArray
        }
        body = JSON.stringify(body)
        fetch("/ADD_USER", { method: "post", body })
            .then(response => response.json())
            .then(data => {
                if (data.users != undefined) {

                    // Tu wywołaj funkcję która usunie ekran logowania i utworzy ekran ładowania

                    console.log(data)
                    var sprawdzanie = setInterval(function () {
                        fetch("/CHECK_USERS", { method: "post" })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                if (data == "Koniec") {
                                    clearInterval(sprawdzanie)
                                    net.moveCheck()
                                    // Tu wywołaj funkcję która usunie ekran ładowania, gra się rozpoczyna
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

    // Sprawdzanie ostatniej zmiany

    moveCheck() {
        let chk = setInterval(function () {
            fetch("/MOVE_CHECK", { method: "post" })
                .then(response => response.json())
                .then(data => {
                    if (data != "Nothing new") {
                        console.log(data)
                        if (data.moveInfo == "Victory") {
                            clearInterval(chk)
                            // Zakończenie gry - zwycięstwo
                        } else if (data.moveInfo == "Defeat") {
                            clearInterval(chk)
                            // Zakończenie gry - porażka
                        } else {
                            // Wywołaj funkcję, która updatuje planszę
                        }
                    } else {
                        // console.log(data)
                    }
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
                console.log(data)

                // Wywołaj funkcję, która gdzieś wyświetla wyniki, w jakimś divie czy w nowej karcie czy gdzie tam chcesz

            })
            .catch(error => console.log(error))
    }
}