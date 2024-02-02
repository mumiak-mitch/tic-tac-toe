// Module pattern for encapsulation
const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => [...board];

    const makeMove = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true; // Move successful
        }
        return false; // Invalid move
    };

    const isGameOver = () => {
        // Check for winning conditions
        if (
            (board[0] === board[1] && board[1] === board[2] && board[0] !== "") ||
            (board[3] === board[4] && board[4] === board[5] && board[3] !== "") ||
            (board[6] === board[7] && board[7] === board[8] && board[6] !== "") ||
            (board[0] === board[3] && board[3] === board[6] && board[0] !== "") ||
            (board[1] === board[4] && board[4] === board[7] && board[1] !== "") ||
            (board[2] === board[5] && board[5] === board[8] && board[2] !== "") ||
            (board[0] === board[4] && board[4] === board[8] && board[0] !== "") ||
            (board[2] === board[4] && board[4] === board[6] && board[2] !== "")
        ) {
            return true; // Game over - someone has won
        }

        // Check for ties
        if (!board.includes("")) {
            return true; // Game over - it's a tie
        }

        return false; // Game is still ongoing
    };

    const resetBoard = () => {
        board.fill("");
    };

    return {
        getBoard,
        makeMove,
        isGameOver,
        resetBoard,
    };
})();

const playerFactory = (name, marker) => {
    const getName = () => name;
    const getMarker = () => marker;

    return {
        getName,
        getMarker,
    };
};

const gameController = (() => {
    let humanPlayer;
    let computerPlayer;
    let currentPlayer;

    const startGame = (humanName) => {
        humanPlayer = playerFactory(humanName, "X");
        computerPlayer = playerFactory("Computer", "O");
        currentPlayer = humanPlayer;
        playComputerTurn(); // Computer makes the first move
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === humanPlayer ? computerPlayer : humanPlayer;
        if (currentPlayer === computerPlayer) {
            playComputerTurn();
        }
    };

    const resetGame = () => {
        gameBoard.resetBoard();
        humanPlayer = null;
        computerPlayer = null;
        currentPlayer = null;
    };

    const playComputerTurn = () => {
        if (!gameBoard.isGameOver() && currentPlayer === computerPlayer) {
            const emptyCells = gameBoard.getBoard().reduce((acc, cell, index) => {
                if (cell === "") {
                    acc.push(index);
                }
                return acc;
            }, []);

            if (emptyCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const computerMove = emptyCells[randomIndex];
                setTimeout(() => {
                    gameBoard.makeMove(computerMove, computerPlayer.getMarker());
                    displayController.renderBoard();
                    if (gameBoard.isGameOver()) {
                        displayController.showResult();
                    } else {
                        switchPlayer();
                    }
                }, 1000); // Introduce delay for a more natural feel
            }
        }
    };

    return {
        startGame,
        switchPlayer,
        resetGame,
    };
})();

const displayController = (() => {
    const boardContainer = document.getElementById("game-board");
    const playerInput = document.getElementById("player");
    const startButton = document.getElementById("start-game");
    const resultDisplay = document.getElementById("result-display");

    const renderBoard = () => {
        boardContainer.innerHTML = "";

        const currentBoard = gameBoard.getBoard();

        currentBoard.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => handleCellClick(index));
            boardContainer.appendChild(cellElement);
        });
    };

    const handleCellClick = (index) => {
        if (!gameBoard.isGameOver() && currentPlayer === humanPlayer && gameBoard.makeMove(index, humanPlayer.getMarker())) {
            renderBoard();
            if (gameBoard.isGameOver()) {
                showResult();
            } else {
                gameController.switchPlayer();
                playComputerTurn(); // Ensure computer plays after human's move
            }
        }
    };

    const showResult = () => {
        const winner = determineWinner();
        if (winner) {
            resultDisplay.textContent = `${winner.getName()} wins!`;
        } else {
            resultDisplay.textContent = "It's a tie!";
        }
    };

    const determineWinner = () => {
        if (gameBoard.isGameOver()) {
            return currentPlayer === humanPlayer ? computerPlayer : humanPlayer;
        }
        return null;
    };

    const startGame = () => {
        const playerName = playerInput.value.trim() || "Player";
        gameController.startGame(playerName);
        renderBoard();
        resultDisplay.textContent = "";
    };

    const resetGame = () => {
        gameController.resetGame();
        playerInput.value = "";
        renderBoard();
        resultDisplay.textContent = "";
    };

    // Event listeners
    startButton.addEventListener("click", startGame);

    return {
        renderBoard,
        showResult,
        resetGame,
    };
})();