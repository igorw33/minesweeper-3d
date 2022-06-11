class Game {

    constructor() {
        this.mineFieldLength = 5
        this.mineCount = 20
        this.mineFieldArray = []

        this.scene = new THREE.Scene()
        this.scene.background = this.backgroundTexture

        this.camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 10000)
        this.camera.position.set(0, 0, 300)
        this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0xE2DFD2)
        this.renderer.setSize(600, 600)
        document.getElementById("root").append(this.renderer.domElement)


        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0)

        this.mouseDown = 0
        document.getElementById("root").onmousedown = () => { this.mouseDown = 1 }
        document.getElementById("root").onmouseup = () => { this.mouseDown = 0 }

        this.raycasting()

        this.createMineField()
        this.render()
        this.resize()
        const axes = new THREE.AxesHelper(1000)
        axes.setColors(0xFF0000, 0x00FF00, 0x00FF00)
        this.scene.add(axes)

        this.oncontextmenu = {}
    }

    render = () => {
        requestAnimationFrame(this.render)
        this.controls.update()
        this.oncontextmenu = {}
        this.renderer.render(this.scene, this.camera)

        // console.log("render leci")
    }

    resize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }



    createMineField = () => {

        for (let x = 0; x < this.mineFieldLength; x++) {
            let mineFieldArrayRow1 = []
            for (let y = 0; y < this.mineFieldLength; y++) {
                let mineFieldArrayRow2 = []
                for (let z = 0; z < this.mineFieldLength; z++) {
                    let cube = new Cube(x, y, z, this.mineFieldLength)
                    mineFieldArrayRow2.push(cube)
                    this.scene.add(cube.returnCube())
                }
                mineFieldArrayRow1.push(mineFieldArrayRow2)
            }
            this.mineFieldArray.push(mineFieldArrayRow1)
        }


        this.addMines()
    }

    addMines = () => {
        for (let i = 0; i < this.mineCount; i++) {
            this.randomizeMine()
        }
        console.log(this.mineFieldArray)
        this.scanForAll()
    }

    randomizeMine = () => {
        let x = Math.floor(Math.random() * this.mineFieldLength)
        let y = Math.floor(Math.random() * this.mineFieldLength)
        let z = Math.floor(Math.random() * this.mineFieldLength)
        // console.log(x, y, z)
        // console.log(this.mineFieldArray[x][y][z].isMine)
        if (this.mineFieldArray[x][y][z].isMine == false) {
            this.mineFieldArray[x][y][z].isMine = true
            this.mineFieldArray[x][y][z].material.color.r = 1
        } else {
            this.randomizeMine()
        }
    }

    scanForAll = () => {
        this.mineFieldArray.forEach((x, xIndex) => {
            x.forEach((y, yIndex) => {
                y.forEach((z, zIndex) => {
                    z.neighboringMines = this.scanNeighbours(xIndex, yIndex, zIndex)

                })
            })
        })
        console.log(this.mineFieldArray)
    }

    scanNeighbours = (x, y, z) => {
        let neighboringMines = 0
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                for (let k = z - 1; k <= z + 1; k++) {
                    if (this.mineFieldArray[i]?.[j]?.[k] != undefined && this.mineFieldArray[i]?.[j]?.[k].isMine == true) {
                        neighboringMines += 1
                    }
                }
            }
        }
        // console.log(neighboringMines)
        return neighboringMines
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


}



