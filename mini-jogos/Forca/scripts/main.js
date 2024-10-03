const wordDisplay = document.querySelector('.word-display');
const hangmanImage = document.querySelector('.hangman-box img');
const guessesText = document.querySelector('.guesses-text b');
const keyboardDiv = document.querySelector('.keyboard')
const gameModal = document.querySelector('.game-modal')
const playAgain = document.querySelector('.play-again')


let currentWord,correctLetters = [], wrongGuessCount = 0;
const maxGuesses = 6

const resetGame = ()=>{
    //resetando jogo
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`
    guessesText.innerHTML = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false)
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show")
}
 
// Colocando palavras aleatorias no jogo
const getRandomWord = () => {
    const {word, hint} = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame()
    
}

const gameOver = (isVictory) => {
    setTimeout(()=>{
        if(isVictory){
            vitoria.play()
        } else{
           derrota.play()
        }
        const modalText = isVictory ? `Você encontrou a palavra:` : `A palavra correta era:`
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Parabéns' : 'Fim de Jogo'}`
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`
        gameModal.classList.add("show")
    },300);
}
const acerto = new Audio('audios/acerto.mp3')
const vitoria = new Audio('audios/vitoria.mp3')
const derrota = new Audio('audios/derrota.mp3')
const error = new Audio('audios/error.mp3')
acerto.volume = 0.2
vitoria.volume = 0.2
derrota.volume = 0.2
error.volume = 0.2


// checando se as letras existem na palavra
const initGame = (button, clickedLetter) =>{
    if(currentWord.includes(clickedLetter)){
        [...currentWord].forEach((letter, index)=>{
            //imprimindo letras na tela
            if(letter === clickedLetter){
                correctLetters.push(letter)
                acerto.play()
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed")
            }
        })
    }else{
        //se letra nao existe adiciona +1 ao erro e mudando imagem
        error.play()
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`
    }
    button.disabled = true
    guessesText.innerHTML = `${wrongGuessCount} / ${maxGuesses}`;
     
    //vitoria ou derrota
    if(wrongGuessCount === maxGuesses)return gameOver(false);
    if(correctLetters.length === currentWord.length)return gameOver(true);
}
//criando teclado e add evento de click
for(let i =97; i <= 122; i++){
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button)
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)))
}
getRandomWord()
playAgain.addEventListener('click', getRandomWord)