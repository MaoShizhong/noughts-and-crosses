const gameBoard = (() => {
    const board = Array(9);

    // makes board variable private (closure)
    const getBoard = () => board;

    const addToBoard = (token, i) => {
        board[i] = token;
    }

    return { getBoard, addToBoard };
})();

const gameFlow = ((pOne, pTwo) => {
    let activePlayer = pOne;
    let gameInProgress = true;

    // for DOM to disply current player
    const getActivePlayer = () => activePlayer;

    // provides closure for progress state
    const inProgress = () => gameInProgress;
    
    const changeTurns = () => {
        activePlayer = (activePlayer === pOne) ? pTwo : pOne;
    };

    // for console before DOM developed
    const printBoard = board => {
        for (let i = 0; i < 3; i += 3) {
            console.log(`${board[i]} ${board[i + 1]} ${board[i + 2]}`);
        }
    };

    // wincon
    const isWinner = board => {
        const allEqual = line => line.every(cell => cell === arr[0]);
        const winPatterns = {
            '1': [board[0], board[3], board[6]],
            '2': [board[0], board[4], board[8]],
            '3': [board[0], board[1], board[2]],
            '4': [board[1], board[4], board[7]],
            '5': [board[2], board[4], board[6]],
            '6': [board[2], board[5], board[8]],
            '7': [board[3], board[4], board[5]],
            '8': [board[6], board[7], board[8]]
        };

        for (const pattern in winPatterns) {
            if (allEqual(winPatterns[pattern])) {
                return true;
            }
        }
        return false;
    }

    const endGame = () => {
        gameInProgress = false;
    };

    const playTurn = (pos) => {
        const board = gameBoard.getBoard();

        console.log(`${activePlayer}'s turn!`);
        gameBoard.addToBoard(activePlayer.token, pos);
        printBoard(board);

        if (isWinner(board)) {
            endGame();
        }
        else {
            changeTurns();
        }
    };

    return { getActivePlayer, inProgress, playTurn };
})();


// to update DOM display
// const displayController = (() => {

// })();


const playerFactory = (controller, token) => {
    return { controller, token };
};

const playerOne = playerFactory('human', 'X');
const playerTwo = playerFactory('human', 'O');