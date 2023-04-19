const gameBoard = (() => {
    const board = Array(9);

    const addToBoard = (token, i) => {
        board[i] = token;
    }

    return { board, addToBoard };
})();


const playerFactory = (controller, token) => {
    return { controller, token };
};

const playerOne = playerFactory('human', 'X');
const playerTwo = playerFactory('human', 'O');