class Cube extends THREE.Mesh {
    constructor(x, y, z, mineFieldLength) {
        super()
        this.x = x
        this.y = y
        this.z = z
        this.mineFieldLength = mineFieldLength
        this.init()
    }

    init = () => {
        this.geometry = new THREE.BoxGeometry(20, 20, 20)
        this.material = new THREE.MeshBasicMaterial({
            color: 0x8888ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
        })

        this.cube = new THREE.Mesh(this.geometry, this.material)
        this.setPosition()
        this.isMine = false
    }

    returnCube = () => {
        return this.cube
    }

    setPosition = () => {
        if (this.mineFieldLength % 2 == 0) {
            this.cube.position.set(((this.x) * 30) - ((this.mineFieldLength / 2 - 0.5) * 30), ((this.y) * 30) - ((this.mineFieldLength / 2 - 0.5) * 30), ((this.z) * 30) - ((this.mineFieldLength / 2 - 0.5) * 30))
        } else {
            this.cube.position.set(((this.x) * 30) - (Math.floor(this.mineFieldLength / 2) * 30), ((this.y) * 30) - (Math.floor(this.mineFieldLength / 2) * 30), ((this.z) * 30) - (Math.floor(this.mineFieldLength / 2) * 30))
        }

    }

}
