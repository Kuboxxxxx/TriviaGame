//getting DOM elements
const name = document.getElementById("name")
const easyDiff = document.getElementById("easy")
const medDiff = document.getElementById("med")
const hardDiff = document.getElementById("hard")
const formBtn = document.getElementById("sub")

//starts game

const startGame = (event) => {
    event.preventDefault()
    console.log("START GAME")
}

//starts game when button pressed

formBtn.addEventListener("click", startGame)