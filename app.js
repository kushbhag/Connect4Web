// Selectors
var tableRow = document.getElementsByTagName('tr');
var tableCell = document.getElementsByTagName('td');
var finalText = document.getElementById('finalText');
var finalPiece = document.getElementById('finalPiece');
var tableSlot = document.querySelector('.board');
var redPieceController = document.getElementById('redPieceController');
var yellowPieceController = document.getElementById('yellowPieceController');

let firstPlayButton = document.getElementById('firstPlayButton');
let secondPlayButton = document.getElementById('secondPlayButton');
let twoPlayButton = document.getElementById('twoPlayButton');
firstPlayButton.style.opacity = 1;
secondPlayButton.style.opacity = 0.5;
twoPlayButton.style.opacity = 0.5;

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

    redPieceController.style.opacity = 1;
    yellowPieceController.style.opacity = 0.3;
}

function turnController() {
    yellowPieceController.style.opacity = redPieceController.style.opacity;
    redPieceController.style.opacity = 1.3 - redPieceController.style.opacity;
}

clear_board();
var newAi = new AIBetter();
var currPos = new Position(board, [0, 0, 0, 0, 0, 0, 0], 0);
for(let i = 0; i < tableRow.length; i++) {
    tableRow[i].addEventListener('click', (e) => {
        let check = player.makeMove(e.target.cellIndex, board);
        if (check && !theGame.checkGame(board, player.playerTurn)){
            ai.makeMove(board);
            // newAi.solve(currPos);
            theGame.checkGame(board, ai.playerTurn);
        }
    });
}


// Game Controls
function restart() {
    clear_board();
    if (finalText.hasChildNodes()) finalText.removeChild(finalText.childNodes[0]);
    if (finalPiece.hasChildNodes()) finalPiece.removeChild(finalPiece.childNodes[0]);
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
    firstPlayButton.style.opacity = 1;
    secondPlayButton.style.opacity = 0.5;
    twoPlayButton.style.opacity = 0.5;
    player.playerTurn = 'player1';
    ai.playerTurn = 'player2';
    restart();
}

function secondPlayer() {
    firstPlayButton.style.opacity = 0.5;
    secondPlayButton.style.opacity = 1;
    twoPlayButton.style.opacity = 0.5;
    player.playerTurn = 'player2';
    ai.playerTurn = 'player1';
    restart();
}

function twoPlayers() {
    firstPlayButton.style.opacity = 0.5;
    secondPlayButton.style.opacity = 0.5;
    twoPlayButton.style.opacity = 1;
    player.playerTurn = 'player1';
    ai.playerTurn = 'player0';
    restart();
}