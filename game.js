class Game {
    constructor() { }

    lowestValidRow(col, board){
        for (let i = 0; i < ROW_SIZE; i++) {
            if (board[i][col] === 0){
                return i;
            }
        }
        return -1;
    }

    drawBoard(row, col, turn) {
        let columns = tableRow[row].getElementsByTagName('td');
        let div = document.createElement("div");
        div.setAttribute('class', turn);
        if (turn === 'win'){
            columns[col].removeChild(columns[col].childNodes[0]);
        }
        columns[col].appendChild(div);
        div.animate([
            {transform: 'scale(.5)'},
            {transform: 'scale(1)'}
        ],{
            duration: 500
        });
    }

    makeMove(row, col) {
        let turn = playerTurn === 'player1' ? 1 : 2;
        // console.log(board);
        // console.log(col);
        // console.log(row);
        board[row][col] = turn;
        this.drawBoard(ROW_SIZE - row - 1, col, playerTurn);
        playerTurn = playerTurn === 'player1' ? 'player2' : 'player1';
    }

    gameOver(board) {
        for (let row = 0; row < ROW_SIZE-3; row++){
            for (let col = 0; col < COL_SIZE; col++){
                if (board[row][col] === board[row+1][col] &&
                    board[row][col] === board[row+2][col] &&
                    board[row][col] === board[row+3][col] &&
                    board[row][col] != 0) {
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

    checkGame(board, winningPlayer) {
        let finish = this.gameOver(board);
        if (finish !== null){
            this.drawBoard(ROW_SIZE - finish[0][0] - 1, finish[0][1], 'win');
            this.drawBoard(ROW_SIZE - finish[1][0] - 1, finish[1][1], 'win');
            this.drawBoard(ROW_SIZE - finish[2][0] - 1, finish[2][1], 'win');
            this.drawBoard(ROW_SIZE - finish[3][0] - 1, finish[3][1], 'win');

            let img = document.createElement("img");
            if (winningPlayer === 'player1'){
                let text = document.createTextNode('Player 1 wins');
                finalText.appendChild(text);
                img.setAttribute('src', 'board/red.svg');
            } else {
                let text = document.createTextNode('Player 2 wins');
                finalText.appendChild(text);
                img.setAttribute('src', 'board/yellow.svg');
            }
           finalPiece.appendChild(img);

            for(let i = 0; i < tableCell.length; i++) {
                tableCell[i].style.pointerEvents = 'none';
            }
            return true;
        }
        return false;
    }
}