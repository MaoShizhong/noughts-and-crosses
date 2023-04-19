const gameBoard = (() => {
    const board = Array(9);

    const addToBoard = (token, i) => {
        board[i] = token;
    }

    return { board, addToBoard };
})();

const gameFlow = ((pOne, pTwo) => {
    let activePlayer = pOne;

    // for DOM to disply current player
    const getActivePlayer = () => activePlayer;
    
    const changeTurns = () => {
        activePlayer = (activePlayer === pOne) ? pTwo : pOne;
    };

    // for console before DOM developed
    const printBoard = () => {
        for (let i = 0; i < 3; i += 3) {
            console.log(`${gameBoard.board[i]} ${gameBoard.board[i + 1]} ${gameBoard.board[i + 2]}`);
        }
    };

    const playTurn = (pos) => {
        console.log(`${activePlayer}'s turn!`);
        gameBoard.addToBoard(activePlayer.token, pos);
        printBoard();
        changeTurns();
    };

    return { getActivePlayer, playTurn };
})();

// to update DOM display
// const displayController = (() => {

// })();


const playerFactory = (controller, token) => {
    return { controller, token };
};

const playerOne = playerFactory('human', 'X');
const playerTwo = playerFactory('human', 'O');