import { playerFactory, playerOne, playerTwo, gameBoard, gameFlow } from './game-components.js';

const themeBtn = document.querySelector('#theme');

themeBtn.addEventListener('click', changeTheme);

function changeTheme() {
    const doc = document.querySelector('html');
    doc.classList.toggle('dark');
    doc.classList.toggle('light');
    themeBtn.textContent = doc.classList.contains('dark') ? 'Dark' : 'Light';
}