let game
let net
let ui
const loadWholeGame = () => {
    game = new Game()
    net = new Net()
    ui = new Ui()
    ui.getRecords()
}

window.onresize = () => {
    game.resize()
}