const player = ((name, token) => {
    return { name, token };
})('You', 'X');

const gameBoard = (() => {
    const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // makes board variable private (closure)
    const getBoard = () => board;

    const clearBoard = () => {
        board.length = 0;
        board.push(...Array(9).keys());
    };

    const addToBoard = (token, i) => {
        board[i] = token;
    };

    const isFull = () => board.every(cell => cell === 'X' || cell === 'O');

    return { getBoard, clearBoard, addToBoard, isFull };
})();

const AI = (() => {
    const name = 'The AI';
    const token = 'O';

    // const chooseSpace = () => {
    //       const board = gameBoard.getBoard();

    //       let space;
    //       do {
    //         space = Math.floor(Math.random() * 8) ;
    //       } while (board[space] !== '-');

    //       return space;
    // };

    // const chooseBestSpace = () => {

    // };

    return { name, token, chooseSpace };
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
        activePlayer = pOne;
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

        changeTurns();

        if (isWinner(board) || gameBoard.isFull()) {
            endGame(board);
        }
    };

    return { getActivePlayer, inProgress, isTie, startNewGame, playTurn };
})(player, AI);


// to update DOM display
const displayController = (() => {
    const container = document.querySelector('#grid-container');

    const disableCells = () => {
        cells.forEach(cell => cell.disabled = true);
    };

    const enableCells = () => {
        cells.forEach(cell => cell.disabled = false);
    };

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

    const displayResults = name => {
        if (gameFlow.isTie()) {
            displayMessage('Tie!');
        }
        else {
            displayMessage(`${name} ${name === 'You' ? 'win' : 'wins'}!`);
        }

        displayResetBtn();
        disableCells();
    };

    const putAIMoveOnBoard = pos => {
        cells.forEach(cell => {
            if (cell.value === `${pos}`) {
                cell.innerHTML = `${AI.token}`;
            }
        });
    };

    const playAITurn = async () => {
        disableCells();
        const delay = Math.random() * (2300 - 900) + 900;
        setTimeout(makeAIMove, delay);
        await wait(delay);
        enableCells();

        if (!gameFlow.inProgress()) {
            displayResults(AI.name);
        }
    };

    const makeAIMove = () => {
        const AIMove = AI.chooseSpace();
        gameFlow.playTurn(AIMove);
        putAIMoveOnBoard(AIMove);
    };

    const wait = milliseconds => {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    const playMove = async e => {
        const player = gameFlow.getActivePlayer();
        gameFlow.playTurn(e.target.value);

        if (e.target.innerHTML) {
            displayMessage('Space taken! Choose another square.');
            return;
        }
        e.target.innerHTML = `${player.token}`;

        if (container.childElementCount !== 1) {
            container.removeChild(container.lastChild);
        }

        if (!gameFlow.inProgress()) {
            displayResults(player.name);
            return;
        }

        playAITurn();
    };

    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.addEventListener('click', playMove))
})();

// change themes
document.querySelector('#theme').addEventListener('click', changeTheme);

function changeTheme(e) {
        const doc = document.querySelector('html');
        doc.classList.toggle('dark');
        doc.classList.toggle('light');
        e.target.textContent = doc.classList.contains('dark') ? 'Dark' : 'Light';
}