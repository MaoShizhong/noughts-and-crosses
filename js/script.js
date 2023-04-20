const playerFactory = (name, controller, token) => {
    return { name, controller, token };
};

const playerOne = playerFactory('Player 1', 'human', 'X');
const playerTwo = playerFactory('Player 2', 'human', 'O');


const gameBoard = (() => {
    const board = Array(9).fill('-');

    // makes board variable private (closure)
    const getBoard = () => board;

    const clearBoard = () => board.fill('-');

    const addToBoard = (token, i) => {
        board[i] = token;
    }

    return { getBoard, clearBoard, addToBoard };
})();


const gameFlow = ((pOne, pTwo) => {
    let activePlayer = pOne;
    let gameInProgress = true;
    let tie = false;

    // for DOM to disply current player
    const getActivePlayer = () => activePlayer;

    // provides closure for progress state
    const inProgress = () => gameInProgress;
    const isTie = () => tie;

    const startNewGame = () => {
        gameInProgress = true;
        tie = false;
        gameBoard.clearBoard();
    }
    
    const changeTurns = () => {
        activePlayer = (activePlayer === pOne) ? pTwo : pOne;
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
            tie = true;
        }
    };

    const playTurn = pos => {
        const board = gameBoard.getBoard();

        gameBoard.addToBoard(activePlayer.token, pos);
        
        const isFullBoard = board.every(cell => cell === 'X' || cell === 'O');

        if (isWinner(board) || isFullBoard) {
            endGame(board);
        }
        else {
            changeTurns();
        }
    };

    return { getActivePlayer, inProgress, isTie, startNewGame, playTurn };
})(playerOne, playerTwo);


// to update DOM display
const displayController = (() => {
    const container = document.querySelector('#grid-container');

    const displayMessage = message => {
        if (container.childElementCount === 1) {
            const alert = document.createElement('h1');
            alert.setAttribute('id', 'message');
            alert.textContent = `${message}`;
            container.appendChild(alert);
        }
        else {
            container.lastChild.textContent = `${message}`;
        }
    };

    const displayResetBtn = () => {
        const reset = document.createElement('button');
        reset.setAttribute('id', 'reset');
        reset.textContent = 'Reset Game';
        container.appendChild(reset);

        reset.addEventListener('click', () => {
            gameFlow.startNewGame();
            cells.forEach(cell => {
                cell.innerHTML = '';
                cell.disabled = false;
            });
            container.removeChild(container.lastChild);
            container.removeChild(container.lastChild);
        })
    };

    const playMove = e => {
        const player = gameFlow.getActivePlayer();
        gameFlow.playTurn(e.target.value);

        if (e.target.innerHTML) {
            displayMessage('Space taken! Choose another square.');
        }
        else {
            if (container.childElementCount !== 1) {
                container.removeChild(container.lastChild);
            }
            e.target.innerHTML = `${player.token}`;
        }

        if (!gameFlow.inProgress()) {
            if (gameFlow.isTie()) {
                displayMessage('Tie!');
            }
            else {
                displayMessage(`${player.name} wins!`);
            }

            displayResetBtn();
            cells.forEach(cell => cell.disabled = true);
        }
    };

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.addEventListener('click', playMove))
})();


// change themes
document.querySelector('#theme').addEventListener('click', e => {
    const doc = document.querySelector('html');
    doc.classList.toggle('dark');
    doc.classList.toggle('light');
    e.target.textContent = doc.classList.contains('dark') ? 'Dark' : 'Light';
});