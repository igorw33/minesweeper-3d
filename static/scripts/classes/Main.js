let game
const loadWholeGame = () => {
    game = new Game()
}

window.onresize = () => {
    game.resize()
}
