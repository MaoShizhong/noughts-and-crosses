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
    const printBoard = () => {
        const board = gameBoard.getBoard();

        for (let i = 0; i < 3; i += 3) {
            console.log(`${board[i]} ${board[i + 1]} ${board[i + 2]}`);
        }
    };

    // wincon
    const isWinner = () => {
        const allEqual = arr => arr.every(el => el === arr[0]);
        const wincons = {
            '1': [board[0], board[3], board[6]],
            '2': [board[0], board[4], board[8]],
            '3': [board[0], board[1], board[2]],
            '4': [board[1], board[4], board[7]],
            '5': [board[2], board[4], board[6]],
            '6': [board[2], board[5], board[8]],
            '7': [board[3], board[4], board[5]],
            '8': [board[6], board[7], board[8]]
        };

        for (const wincon in wincons) {
            if (allEqual(wincons[wincon])) {
                return true;
            }
        }
        return false;
    }

    const endGame = () => {
        gameInProgress = false;
    };

    const playTurn = (pos) => {
        console.log(`${activePlayer}'s turn!`);
        gameBoard.addToBoard(activePlayer.token, pos);
        printBoard();

        if (isWinner()) {
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