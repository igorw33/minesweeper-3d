class Game {

    constructor() {
        this.mineFieldLength = 7
        this.mineCount = 10
        this.mineFieldArray = []
        this.mineFieldArrayHelper = []
        this.mineFieldArrayHelperSingle = []
        this.explorationGoal = (this.mineFieldLength * this.mineFieldLength * this.mineFieldLength) - this.mineCount
        console.log(this.explored)

        this.scene = new THREE.Scene()
        this.scene.background = this.backgroundTexture

        this.camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 10000)
        this.camera.position.set(0, 0, this.mineFieldLength * 60)
        this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setClearColor(0xE2DFD2)
        this.renderer.setSize(600, 600)
        document.getElementById("root").append(this.renderer.domElement)


        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0)


        this.generateForFirstPlayer()

        this.raycasting()

        this.render()
        this.resize()

        this.loader = new THREE.FBXLoader()
        this.modelsLoader()
        // const axes = new THREE.AxesHelper(1000)
        // axes.setColors(0xFF0000, 0x00FF00, 0x00FFFF)
        // this.scene.add(axes)
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

    modelsLoader = () => {
        this.modelsArray = []

        this.model = new Promise(() => {
            this.loader.load("./models/Mine.fbx", (object) => {
                let mineModel
                object.scale.set(0.08, 0.08, 0.08)
                // this.scene.add(object)
                // console.log(object)
                mineModel = object
                this.modelsArray[0] = mineModel
                // console.log(mineModel, this.modelsArray[0])
            })
            for (let i = 0; i <= 26; i++) {
                this.loader.load(`./models/${i}.fbx`, (object) => {
                    object.scale.set(0.08, 0.08, 0.08)
                    let numberModel
                    numberModel = object
                    this.modelsArray[i] = numberModel
                    // console.log(mineModel, this.modelsArray[0])
                })
            }
            //console.log(this.modelsArray)
        })
    }

    raycasting = () => {
        this.raycaster = new THREE.Raycaster() // obiekt Raycastera symulujący "rzucanie" promieni
        this.mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na 
        document.getElementById("root").onclick = (event) => {
            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
            // console.log("DZIAŁA")
            // this.scene.add(this.modelsArray[0])
            // console.log(this.modelsArray[0])
            this.cubeSelect(false)
        }
        document.getElementById("root").oncontextmenu = (event) => {
            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
            // console.log("DZIAŁA")
            this.cubeSelect(true)
        }
    }

    cubeSelect = (flag) => {
        this.raycaster.setFromCamera(this.mouseVector, this.camera)
        this.intersects = this.raycaster.intersectObjects(this.scene.children)
        if (this.intersects.length > 0) {
            let cubeInArray, xxIndex, yyIndex, zzIndex
            // console.log(this.intersects[0].object)
            this.mineFieldArray.forEach((x, xIndex) => {
                x.forEach((y, yIndex) => {
                    y.forEach((z, zIndex) => {
                        // console.log(z.geometry.uuid, this.intersects[0].object.geometry.uuid)
                        if (z.geometry.uuid == this.intersects[0].object.geometry.uuid) {
                            cubeInArray = z
                            xxIndex = xIndex
                            yyIndex = yIndex
                            zzIndex = zIndex
                        }
                    })
                })
            })

            if (flag == false) {
                if (cubeInArray.flagged == false || cubeInArray.flagged == undefined) {
                    // this.cubeCheck(cubeInArray, xxIndex, yyIndex, zzIndex)
                    this.move(cubeInArray, xxIndex, yyIndex, zzIndex, 0)

                }
            }
            else {

                if (cubeInArray.flagged == false || cubeInArray.flagged == undefined) {
                    this.move(cubeInArray, xxIndex, yyIndex, zzIndex, 1)
                } else {
                    this.move(cubeInArray, xxIndex, yyIndex, zzIndex, 2)
                }

            }

        }
    }


    cubeCheck = (cubeInArray, xIndex, yIndex, zIndex) => {
        // console.log(cubeInArray, xIndex, yIndex, zIndex)

        cubeInArray = this.mineFieldArray[xIndex][yIndex][zIndex]
        if (cubeInArray.isMine == true) {
            // console.log("BOOM")
            // this.scene.remove(cube)
            this.lose()
        } else {
            if (cubeInArray.neighboringMines != 0) {
                let number = this.modelsArray[cubeInArray.neighboringMines].clone()
                this.scene.add(number)
                number.position.set(cubeInArray.cube.position.x, cubeInArray.cube.position.y, cubeInArray.cube.position.z)
                this.scene.remove(cubeInArray.cube)
                cubeInArray.explored = true
                //console.log(cubeInArray)
            } else {
                for (let i = xIndex - 1; i <= xIndex + 1; i++) {
                    for (let j = yIndex - 1; j <= yIndex + 1; j++) {
                        for (let k = zIndex - 1; k <= zIndex + 1; k++) {
                            if (this.mineFieldArray[i]?.[j]?.[k] != undefined) {
                                if (this.mineFieldArray[i][j][k].neighboringMines != 0) {
                                    let number = this.modelsArray[this.mineFieldArray[i][j][k].neighboringMines].clone()
                                    this.scene.add(number)
                                    number.position.set(this.mineFieldArray[i][j][k].cube.position.x, this.mineFieldArray[i][j][k].cube.position.y, this.mineFieldArray[i][j][k].cube.position.z)
                                    this.mineFieldArray[i][j][k].explored = true
                                    this.scene.remove(this.mineFieldArray[i][j][k].cube)
                                } else {
                                    if (this.mineFieldArray[i][j][k].explored != true) {
                                        this.mineFieldArray[i][j][k].explored = true
                                        this.scene.remove(this.mineFieldArray[i][j][k].cube)
                                        setTimeout(() => { this.cubeCheck(this.mineFieldArray[i][j][k], i, j, k) },
                                            100)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        let explored = 0
        this.mineFieldArray.forEach((x) => {
            x.forEach((y) => {
                y.forEach((z) => {
                    if (z.explored == true) {
                        explored += 1
                    }
                })
            })
        })
        if (explored == this.explorationGoal) {
            this.win()
        }
    }

    cubeFlag = (cubeInArray, xIndex, yIndex, zIndex) => {
        cubeInArray = this.mineFieldArray[xIndex][yIndex][zIndex]
        cubeInArray.flagged = true
        cubeInArray.material.color.r = 0
        cubeInArray.material.color.g = 1
    }

    cubeUnFlag = (cubeInArray, xIndex, yIndex, zIndex) => {
        cubeInArray = this.mineFieldArray[xIndex][yIndex][zIndex]
        cubeInArray.flagged = false
        cubeInArray.material.color.r = 0.53
        cubeInArray.material.color.g = 0.53
    }



    move = (cubeInArray, xxIndex, yyIndex, zzIndex, action) => {
        let move = {
            "cubeInArray": cubeInArray,
            "xxIndex": xxIndex,
            "yyIndex": yyIndex,
            "zzIndex": zzIndex,
            "action": action
        }
        console.log(move)
        net.sendMove(move)
    }

    win = () => {
        setTimeout(() => {
            net.sendMove("Victory")
        },
            10)

    }

    lose = () => {

        this.mineFieldArray.forEach((x) => {
            x.forEach((y) => {
                y.forEach((z) => {
                    if (z.isMine == true) {
                        let mine = this.modelsArray[0].clone()
                        this.scene.add(mine)
                        mine.position.set(z.cube.position.x, z.cube.position.y, z.cube.position.z)
                        // console.log(z.cube.position)
                        this.scene.remove(z.cube)
                    }
                })
            })
        })
        setTimeout(() => {
            net.sendMove("Defeat")
        }, 10)

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
        //console.log(this.mineFieldArray)
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
            // this.mineFieldArray[x][y][z].material.color.r = 1
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
        //console.log(this.mineFieldArray)
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

    createMineFieldHelper = () => {
        this.mineFieldArray.forEach((x, xIndex) => {
            let mineFieldArrayHelperRow1 = []
            x.forEach((y, yIndex) => {
                let mineFieldArrayHelperRow2 = []
                y.forEach((z, zIndex) => {
                    let simplifiedObject = {
                        flagged: z.flagged,
                        explored: z.explored,
                        neighboringMines: z.neighboringMines,
                        isMine: z.isMine,
                        x: xIndex,
                        y: yIndex,
                        z: zIndex
                    }
                    this.mineFieldArrayHelperSingle.push(simplifiedObject)
                    mineFieldArrayHelperRow2.push(simplifiedObject)
                })
                mineFieldArrayHelperRow1.push(mineFieldArrayHelperRow2)
            })
            this.mineFieldArrayHelper.push(mineFieldArrayHelperRow1)
        })
        //console.log(this.mineFieldArrayHelper, this.mineFieldArrayHelperSingle)
    }

    generateForFirstPlayer = () => {
        this.createMineField()
        this.createMineFieldHelper()
        console.log(this.mineFieldArray)
    }

    generateForSecondPlayer = (singleArray) => {
        console.log(singleArray)
        this.mineFieldArray.forEach((x, xIndex) => {
            x.forEach((y, yIndex) => {
                y.forEach((z, zIndex) => {
                    this.scene.remove(z.cube)
                })
            })
        })
        singleArray.forEach((x, xIndex) => {
            x.forEach((y, yIndex) => {
                y.forEach((z, zIndex) => {
                    let cube = new Cube(xIndex, yIndex, zIndex, this.mineFieldLength)
                    this.mineFieldArray[xIndex][yIndex][zIndex] = cube
                    this.mineFieldArray[xIndex][yIndex][zIndex].neighboringMines = z.neighboringMines
                    this.mineFieldArray[xIndex][yIndex][zIndex].isMine = z.isMine
                    this.scene.add(this.mineFieldArray[xIndex][yIndex][zIndex].returnCube())
                })
            })
        })
        console.log(this.mineFieldArray)
    }



}



