const playerFactory = (name, controller, token) => {
    return { name, controller, token };
};

const playerOne = playerFactory('Player 1', 'human', 'X');
const playerTwo = playerFactory('Player 2', 'human', 'O');


const gameBoard = (() => {
    const board = Array(9).fill('-');

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
        for (let i = 0; i < 9; i += 3) {
            console.log(`${board[i]} ${board[i + 1]} ${board[i + 2]}`);
        }
    };

    // wincon
    const isWinner = board => {
        const allX = line => line.every(cell => cell === 'X');
        const allO = line => line.every(cell => cell === 'O');

        const checkPatterns = {
            '1': [board[0], board[3], board[6]],
            '2': [board[0], board[4], board[8]],
            '3': [board[0], board[1], board[2]],
            '4': [board[1], board[4], board[7]],
            '5': [board[2], board[4], board[6]],
            '6': [board[2], board[5], board[8]],
            '7': [board[3], board[4], board[5]],
            '8': [board[6], board[7], board[8]]
        };

        for (const pattern in checkPatterns) {
            if (allX(checkPatterns[pattern]) || allO(checkPatterns[pattern])) {
                return true;
            }
        }
        return false;
    }

    const endGame = board => {
        gameInProgress = false;
        if (!isWinner(board)) {
            console.log("It's a tie!");
        }
        else {
            console.log(`${activePlayer.name} won!`);
        }
    };

    const playTurn = pos => {
        const board = gameBoard.getBoard();

        console.log(`${activePlayer.name}'s turn!`);

        if (board[pos] === 'X' || board[pos] === 'O') {
            console.log("Space taken! Please pick another space.");
            return;
        }

        gameBoard.addToBoard(activePlayer.token, pos);
        printBoard(board);

        const isFullBoard = board.every(cell => cell === 'X' || cell === 'O');

        if (isWinner(board) || isFullBoard) {
            endGame(board);
        }
        else {
            changeTurns();
            console.log();
        }
    };

    return { getActivePlayer, inProgress, playTurn };
})(playerOne, playerTwo);


// to update DOM display
// const displayController = (() => {

// })();

gameFlow.playTurn(5);
gameFlow.playTurn(5);
gameFlow.playTurn(7);