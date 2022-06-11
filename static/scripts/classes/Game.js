class Game extends THREE {

    constructor() {
        this.scene = new THREE.Scene()
        this.backgroundTexture = new THREE.TextureLoader().load("./img/background.jpg")
        this.scene.background = this.backgroundTexture

        this.camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 10000)
        this.camera.position.set(0, 100, 300)
        this.camera.lookAt(this.scene.position)
        this.camera.position.set(180, 200, 600)
        // this.camera.position.set(0, 100, -300)
        // this.camera.lookAt(this.scene.position)
        // this.camera.position.set(180, 200, -300)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0x3f3f3f)
        this.renderer.setSize(600, 600)
        document.getElementById("root").append(this.renderer.domElement)

        this.mouseDown = 0
        document.getElementById("root").onmousedown = () => { this.mouseDown = 1 }
        document.getElementById("root").onmouseup = () => { this.mouseDown = 0 }

        this.raycasting()
        this.render() // wywołanie metody render
        this.createBoard()
        this.resize()
        // const axes = new THREE.AxesHelper(1000)
        // this.scene.add(axes)
    }

    render = () => {
        this.pawnSelect()
        requestAnimationFrame(this.render)
        this.renderer.render(this.scene, this.camera)
        // console.log("render leci")
    }

    resize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    // cameraPosition = (player) => {
    //     this.player = player
    //     if (this.player == 2) {
    //         this.camera.position.set(0, 100, -300)
    //         this.camera.lookAt(this.scene.position)
    //         this.camera.position.set(180, 200, -240)
    //     }
    // }

    raycasting = () => {
        this.raycaster = new THREE.Raycaster() // obiekt Raycastera symulujący "rzucanie" promieni
        this.mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D
        document.onmousemove = (event) => {
            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
            // console.log(this.mouseVector.y)
        }
    }

    // createBoard = () => {
    //     this.szachownica.forEach((currentValue, currentIndex) => {
    //         currentValue.forEach((currentValue2, currentIndex2) => {
    //             let tile = new Tile(currentValue2, currentIndex, currentIndex2)
    //             this.scene.add(tile.returnTile())
    //             this.szachownica[currentIndex][currentIndex2] = tile.returnTile()
    //         })
    //     })
    // }

}



