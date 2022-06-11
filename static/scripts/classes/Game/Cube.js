class Cube extends THREE.Mesh {
    constructor(i, j, k) {
        super()
        this.i = i
        this.j = j
        this.k = k
        this.init()
    }

    init = () => {
        this.geometry = new THREE.BoxGeometry(20, 20, 20)
        this.material = new THREE.MeshBasicMaterial({
            color: 0x8888ff,
            side: THREE.DoubleSide,
        })

        this.cube = new THREE.Mesh(this.geometry, this.material)
        this.setPosition()
    }

    returnCube = () => {
        return this.cube
    }

    setPosition = () => {
        this.cube.position.set((this.i + 1) * 30, (this.j + 1) * 30, (this.k + 1) * 30)
    }

}
