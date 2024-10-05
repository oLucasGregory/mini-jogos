const playBoard = document.querySelector(".play-board")
const scoreElement = document.querySelector(".score")
const highScoreElement = document.querySelector(".high-score")
const controls = document.querySelectorAll(".controls i")


let musicScore = new Audio('music/ponto.mp3')
musicScore.volume = 0.1
let gameOver = false
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = []
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;


let highScore = localStorage.getItem("high-score")   || 0;
highScoreElement.innerText = `Record: ${highScore}`;

const changeFoodPosition =() =>{
    //posição aleatoria da comida
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}
const handleGame = () =>{
    //reiniciando game
    clearInterval(setIntervalId);
    alert("game Over")
    location.reload()
}

const changeDirection = (e) => {
    //controle de direção 
  if(e.key === "ArrowUp" && velocityY != 1){
    velocityX = 0;
    velocityY = -1;
  } else if(e.key === "ArrowDown" && velocityY != -1){
    velocityX = 0;
    velocityY = 1;
  } else if(e.key === "ArrowLeft" && velocityX != 1){
    velocityX = -1;
    velocityY = 0;
  }
  else if(e.key === "ArrowRight" && velocityX !=  -1){
    velocityX = 1;
    velocityY = 0;
  }
}
controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key})) 
});

snakeBody[0] = [snakeX, snakeY];

const initGame = () =>{
    if(gameOver) return handleGame()
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX} "></div>`;
     //checando colisão com a fruta
    if(snakeX === foodX && snakeY === foodY ){
        changeFoodPosition()
        snakeBody.push([foodX, foodY]); // almentando a cobra ( ͡° ͜ʖ ͡°)
        musicScore.play()
        score++; //aumentando pontuação
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore)
        scoreElement.innerText = `Ponto: ${score}`;
        highScoreElement.innerText = `Record: ${highScore}`;
    }
    for(let i = snakeBody.length -1; i > 0; i--){
        snakeBody[i] = snakeBody [ i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]

    snakeX += velocityX;
    snakeY += velocityY;

    //checando colisão com a parede
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY >30){
        gameOver = true
    }

    for(let i = 0; i < snakeBody.length; i++){
        //adicionando corpo da cobra
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //checando colisão com ela mesma
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0] ){
            gameOver=true
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
setIntervalId =  setInterval(initGame, 125)
document.addEventListener("keydown", changeDirection)