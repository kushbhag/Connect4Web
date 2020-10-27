class AI extends Game {
    constructor(playerTurn) {
        super();
        this.playerTurn = playerTurn;
    }

    boardCol(col, tempBoard) {
        return tempBoard.map(row => row[col]);
    }

    move(col, tempBoard, player) { // Used within minimax to move pieces on temporary board
        let piece = player === 'player1' ? 1 : 2;
        let row = this.lowestValidRow(col, tempBoard);
        let ret = [];
        for (let i = 0; i < tempBoard.length; i ++){
            ret[i] = tempBoard[i].slice();
        }
        if (row === -1) {
            let test = this.availableActions(tempBoard);
            for (const a of test){
                console.log(a);
            }

            console.log(test);
            console.log(ret);
            console.log(tempBoard);
        }
        ret[row][col] = piece;
        return ret;
    }

    availableActions(tempBoard) {
        let actions = [];
        for (let col = 0; col < COL_SIZE; col ++ ){
            if (tempBoard[ROW_SIZE-1][col] === 0){
                actions.push(col);
            }
        }
        return actions;
    }

    evaluate(fourpiece, player) {
        let score = 0;
        let opposition = player === 1 ? 2 : 1;

        let player_count = fourpiece.filter(val => val === player).length;
        let opposition_count = fourpiece.filter(val => val === opposition).length;
        let empty_count = fourpiece.filter(val => val === 0).length;
        if (player_count === 4) {
            score += 100;
        } else if (player_count === 3) {
            score += 3;
            if (empty_count === 1) {
                score += 2;
            } else if (opposition_count === 1) {
                score -= 2;
            }
        } else if (player_count === 2) {
            score += 1;
            if (empty_count === 2) {
                score += 1;
            } else if (opposition_count == 2) {
                score -= 1;
            } else if (empty_count == 1) {
                score -= 0;
            }
        }
        if (opposition_count === 3) {
            score -= 3;
            if (empty_count === 1) {
                score -= 2;
            } else if (player_count === 1) {
                score += 1;
            }
        } else if (opposition_count === 4){
            score -= 20;
        }
        return score;
    }

    scorePosition(turn, tempBoard) {
        let score = 0;
        let piece = turn === 'player1' ? 1 : 2;

        // Scoring Center column
        let centerCol = this.boardCol(3, tempBoard);
        score += 3*(centerCol.filter(val => val === piece)).length;

        // Scoring Horizontal pieces
        for (let row = 0; row < ROW_SIZE; row ++){
            let the_row = tempBoard[row];
            for (let col = 0; col < COL_SIZE-3; col ++){
                let four_piece = the_row.filter((val, i) => i >= col && i < col + 4);
                score += this.evaluate(four_piece, piece);
            }
        }

        // Scoring Vertical pieces
        for (let col = 0; col < COL_SIZE; col ++){
            let the_col = this.boardCol(col, tempBoard);
            for (let row = 0; row < ROW_SIZE - 3; row ++) {
                let four_piece =  the_col.filter((val, i) => i >= row && i < row + 4);
                score += this.evaluate(four_piece, piece);
            }
        }

        // Scoring Diagonal pieces
        for (let row = 0; row < ROW_SIZE-3; row ++){
            for (let col = 0; col < COL_SIZE-3; col ++){
                let four_piece = [];
                four_piece.push(tempBoard[row][col]);
                four_piece.push(tempBoard[row+1][col+1]);
                four_piece.push(tempBoard[row+2][col+2]);
                four_piece.push(tempBoard[row+3][col+3]);
                score += this.evaluate(four_piece, piece);
            }
        }
        for (let row = ROW_SIZE-1; row >= 3; row --){
            for (let col = 0; col < COL_SIZE-3; col ++){
                let four_piece = [];
                four_piece.push(tempBoard[row][col]);
                four_piece.push(tempBoard[row-1][col+1]);
                four_piece.push(tempBoard[row-2][col+2]);
                four_piece.push(tempBoard[row-3][col+3]);
                score += this.evaluate(four_piece, piece);
            }
        }
        return score;
    }

    minimax(board, depth, alpha, beta, maximizingPlayer) {
        let finished = this.gameOver(board);
        if (finished !== null) {
            let turn = this.playerTurn === 'player1' ? 1 : 2;
            if (board[finished[0][0]][finished[0][1]] === turn) {
                return [null, (depth+1)*100000000000];
            } else {
                return [null, (depth+1)*-100000000000]
            }
        }
        if (depth === 0) {
            // let turn = maximizingPlayer ? this.playerTurn : player.playerTurn;
            return [null, this.scorePosition(this.playerTurn, board)];
        }
        let actions = this.availableActions(board);
        if (actions.length === 0) {
            return [null, 0];
        }

        if (maximizingPlayer) {
            let maxEvaluation = -Infinity;
            let bestAction = 3;
            for (let a of actions) {
                let board_copy = this.move(a, board, this.playerTurn);
                let evaluation = this.minimax(board_copy, depth-1, alpha, beta, false)[1];
                if (evaluation > maxEvaluation) {
                    maxEvaluation = evaluation;
                    bestAction = a;
                }
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) {
                    break;
                }
            }
            return [bestAction, maxEvaluation];
        } else {
            let minEvaluation = Infinity;
            let bestAction = 3;
            for (let a of actions) {
                let board_copy = this.move(a, board, player.playerTurn);
                let evaluation = this.minimax(board_copy, depth-1, alpha, beta, true)[1];
                if (evaluation < minEvaluation) {
                    minEvaluation = evaluation;
                    bestAction = a;
                }
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) {
                    break;
                }
            }
            return [bestAction, minEvaluation];
        }
    }

    makeMove(tempBoard = null) {
        if (this.playerTurn !== 'player0'){
            let theMove = this.minimax(tempBoard, 5, -Infinity, Infinity, true);
            let row = this.lowestValidRow(theMove[0], tempBoard);
            theGame.makeMove(row, theMove[0]);
            turnController();
            //this.scorePosition(this.playerTurn, tempBoard);
        }
    }
}