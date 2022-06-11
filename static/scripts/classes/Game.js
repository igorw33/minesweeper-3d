class Game {

    constructor() {

        this.mineFieldArray = []

        this.scene = new THREE.Scene()
        this.scene.background = this.backgroundTexture

        this.camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 10000)
        this.camera.position.set(0, 0, 300)
        this.camera.lookAt(this.scene.position)
        this.camera.position.set(180, 200, 600)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0xE2DFD2)
        this.renderer.setSize(600, 600)
        document.getElementById("root").append(this.renderer.domElement)


        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0)

        // this.mouseDown = 0
        // document.getElementById("root").onmousedown = () => { this.mouseDown = 1 }
        // document.getElementById("root").onmouseup = () => { this.mouseDown = 0 }

        // this.raycasting()

        this.createMineField()
        this.render()
        this.resize()
        const axes = new THREE.AxesHelper(1000)
        axes.setColors(0xFF0000, 0x00FF00, 0x00FF00)
        this.scene.add(axes)
    }

    render = () => {
        requestAnimationFrame(this.render)
        this.controls.update()
        this.renderer.render(this.scene, this.camera)

        // console.log("render leci")
    }

    resize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }



    createMineField = () => {
        for (let x = 0; x < 5; x++) {
            let mineFieldArrayRow1 = []
            for (let y = 0; y < 5; y++) {
                let mineFieldArrayRow2 = []
                for (let z = 0; z < 5; z++) {
                    let cube = new Cube(x, y, z)
                    mineFieldArrayRow2.push(cube)
                    this.scene.add(cube.returnCube())
                }
                mineFieldArrayRow1.push(mineFieldArrayRow2)
            }
            this.mineFieldArray.push(mineFieldArrayRow1)
        }
        console.log(this.mineFieldArray)
    }

    // cameraPosition = (player) => {
    //     this.player = player
    //     if (this.player == 2) {
    //         this.camera.position.set(0, 100, -300)
    //         this.camera.lookAt(this.scene.position)
    //         this.camera.position.set(180, 200, -240)
    //     }
    // }

    // raycasting = () => {
    //     this.raycaster = new THREE.Raycaster() // obiekt Raycastera symulujący "rzucanie" promieni
    //     this.mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D
    //     document.onmousemove = (event) => {
    //         this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
    //         this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
    //         // console.log(this.mouseVector.y)
    //     }
    // }


}



