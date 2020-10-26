// Selectors
var tableRow = document.getElementsByTagName('tr');
var tableCell = document.getElementsByTagName('td');
var finalText = document.getElementById('finaltext');
var tableSlot = document.querySelector('.board');

var playerTurn = 'player1';
var player = new Player('player1');
var ai = new AI('player2');
var board = [];
const ROW_SIZE = 6;
const COL_SIZE = 7;
var theGame = new Game();

function clear_board() {
    for (let i = 0; i < ROW_SIZE; i++) {
        board[i] = [0, 0, 0, 0, 0, 0, 0];
    }
}

clear_board();
for(let i = 0; i < tableRow.length; i++) {
    tableRow[i].addEventListener('click', (e) => {
        player.makeMove(e.target.cellIndex, board);
        if (!theGame.checkGame(board)){
            ai.makeMove(board);
            theGame.checkGame(board);
        }
        console.log(board);
    });
}


// Game Controls
function restart() {
    clear_board();
    if (finalText.hasChildNodes()) finalText.removeChild(finalText.childNodes[0]);
    finalText.style.visibility = "hidden";
    for (let row = 0; row < ROW_SIZE; row ++){
        for (let col = 0; col < COL_SIZE; col ++){
            let columns = tableRow[row].getElementsByTagName('td');
            if(columns[col].hasChildNodes()){
                columns[col].removeChild(columns[col].childNodes[0])
            }
        }
    }
    for(let i = 0; i < tableCell.length; i++) {
        tableCell[i].style.pointerEvents = 'all';
    }
    playerTurn = 'player1';
    if (ai.playerTurn === 'player1') {
        ai.makeMove(board); // Making first move
    }
}

function firstPlayer() {
    player.playerTurn = 'player1';
    ai.playerTurn = 'player2';
    restart();
}

function secondPlayer() {
    player.playerTurn = 'player2';
    ai.playerTurn = 'player1';
    restart();
}

function twoPlayers() {
    player.playerTurn = 'player1';
    ai.playerTurn = 'player0';
    restart();
}