const x_turn = "x";
const o_turn = "o";
const boxElements = document.querySelectorAll('[data-cell]');
const gameBoard = document.getElementById('game-board');
const winning_data = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const winningMessage = document.querySelector('[data-winning-message-text]');
const winningMessageElement = document.getElementById("winningSection");
const restartBtn = document.getElementById("restartBtn");

let oTurn;

startGame();
restartBtn.removeEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

function startGame() {
    oTurn = false;

    boxElements.forEach(box => {
        box.classList.remove(x_turn);
        box.classList.remove(o_turn);
        box.removeEventListener('click', handleClick);
        box.addEventListener('click', handleClick, { once: true });
    });

    setBoardHover();

    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    const box = e.target;
    const currentTurn = oTurn ? o_turn : x_turn;

    if (checkWinner(currentTurn)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        switchTurns();
        setBoardHover();
    }

    placeMark(box, currentTurn);
}

function placeMark(box, currentTurn) {
    box.classList.add(currentTurn);
}

function switchTurns() {
    oTurn = !oTurn;
}

function setBoardHover() {
    gameBoard.classList.remove(x_turn);
    gameBoard.classList.remove(o_turn);

    if (oTurn) {
        gameBoard.classList.add(o_turn);
    } else {
        gameBoard.classList.add(x_turn);
    }
}

function checkWinner(currentTurn) {
    return winning_data.some(winning => {
        return winning.every(index => {
            return boxElements[index].classList.contains(currentTurn);
        });
    });
}

function endGame(draw) {
    if (draw) {
        winningMessage.innerText = `Draw!!!`;
        winningMessageElement.classList.add('show');
    } else {
        winningMessage.innerText = `${oTurn ? "O's Win" : "X's Win"}`;
        winningMessageElement.classList.add('show');
        restartBtn.removeEventListener("click", startGame);
        restartBtn.addEventListener("click", () => {
            winningMessageElement.classList.remove('show');
            startGame();
        });
    }
}

function isDraw() {
    return ![...boxElements].some(box => box.classList.contains(x_turn) || box.classList.contains(o_turn)) && ![...boxElements].some(box => !box.classList.contains(x_turn) && !box.classList.contains(o_turn));
}