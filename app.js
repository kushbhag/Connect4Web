// Selectors

var tableRow = document.getElementsByTagName('tr');
var tableCell = document.getElementsByTagName('td');
var finalText = document.getElementById('finaltext');
var tableSlot = document.querySelector('.board');

var playerTurn = 'player1';
var board = [];
const ROW_SIZE = 6;
const COL_SIZE = 7;

function clear_board() {
    for (let i = 0; i < ROW_SIZE; i++) {
        board[i] = [0, 0, 0, 0, 0, 0, 0];
    }
}

function lowestValidRow(col){
    for (let i = 0; i < ROW_SIZE; i++) {
        if (board[i][col] === 0){
            return i;
        }
    }
    return -1;
}

function drawBoard(row, col, turn) {
    let columns = tableRow[row].getElementsByTagName('td');
    let div = document.createElement("div");
    div.setAttribute('class', turn);
    if (turn === 'win'){
        console.log(columns[col]);
        columns[col].removeChild(columns[col].childNodes[0]);
        console.log(columns[col]);
    }
    columns[col].appendChild(div);
}

function gameOver() {
    for (let row = 0; row < ROW_SIZE-3; row++){
        for (let col = 0; col < COL_SIZE; col++){
            if (board[row][col] === board[row+1][col] &&
                board[row][col] === board[row+2][col] &&
                board[row][col] === board[row+3][col] &&
                board[row][col] != 0) {
                console.log(board[row][col]);
                return [[row,col], [row+1,col], [row+2,col], [row+3,col]];
            }
        }
    }

    for (let row = 0; row < ROW_SIZE; row++){
        for (let col = 0; col < COL_SIZE-3; col++){
            if (board[row][col] === board[row][col+1] &&
                board[row][col] === board[row][col+2] &&
                board[row][col] === board[row][col+3] &&
                board[row][col]!= 0) {
                return [[row,col], [row,col+1], [row,col+2], [row,col+3]];
            }
        }
    }

    for (let row = 3; row < ROW_SIZE; row++){
        for (let col = 0; col < COL_SIZE-3; col++){
            if (board[row][col] === board[row-1][col+1] &&
                board[row][col] === board[row-2][col+2] &&
                board[row][col] === board[row-3][col+3] &&
                board[row][col] != 0) {
                return [[row,col], [row-1,col+1], [row-2,col+2], [row-3,col+3]];
            }
        }
    }

    for (let row = 0; row < ROW_SIZE-3; row++){
        for (let col = 0; col < COL_SIZE-3; col++){
            if (board[row][col] === board[row+1][col+1] &&
                board[row][col] === board[row+2][col+2] &&
                board[row][col] === board[row+3][col+3] &&
                board[row][col] != 0) {
                return [[row,col], [row+1,col+1], [row+2,col+2], [row+3,col+3]];
            }
        }
    }
    return null;
}

function makeMove(col) {
    let turn = playerTurn === 'player1' ? 1 : 2;
    let row = lowestValidRow(col);

    if (row === -1){
        return;
    }
    board[row][col] = turn;
    drawBoard(ROW_SIZE - row - 1, col, playerTurn); // Flipped for visual purposes

    let finish = gameOver();
    if (finish !== null){
        drawBoard(ROW_SIZE - finish[0][0] - 1, finish[0][1], 'win');
        drawBoard(ROW_SIZE - finish[1][0] - 1, finish[1][1], 'win');
        drawBoard(ROW_SIZE - finish[2][0] - 1, finish[2][1], 'win');
        drawBoard(ROW_SIZE - finish[3][0] - 1, finish[3][1], 'win');
        var t = document.createElement("H1").appendChild(document.createTextNode("Player Won"));
        finalText.appendChild(t);
        finalText.style.visibility = "visible";
    }

    // Change player turn
    playerTurn = playerTurn === 'player1' ? 'player2' : 'player1';
}

clear_board();
for(let i = 0; i < tableRow.length; i++) {
    tableRow[i].addEventListener('click', (e) => {
        makeMove(e.target.cellIndex);
        // console.log(e)
         console.log(board);
        // console.log(`${e.target.parentElement.rowIndex}, ${e.target.cellIndex}`);
    });
}


// Game Controls
function restart() {
    clear_board();
    finalText.removeChild(finalText.childNodes[0]);
    finalText.style.visibility = "hidden";
    for (let row = 0; row < ROW_SIZE; row ++){
        for (let col = 0; col < COL_SIZE; col ++){
            let columns = tableRow[row].getElementsByTagName('td');
            if(columns[col].hasChildNodes()){
                columns[col].removeChild(columns[col].childNodes[0])
            }
        }
    }
}