let game
let net
const loadWholeGame = () => {
    game = new Game()
    net = new Net()
}

window.onresize = () => {
    game.resize()
}
