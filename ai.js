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
            score += 5;
            if (empty_count === 1) {
                score += 2;
            } else if (opposition_count === 1) {
                score -= 3;
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
        score += 10*((centerCol.filter(val => val === piece)).length);

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
                score += 3*this.evaluate(four_piece, piece);
            }
        }
        for (let row = ROW_SIZE-1; row >= 3; row --){
            for (let col = 0; col < COL_SIZE-3; col ++){
                let four_piece = [];
                four_piece.push(tempBoard[row][col]);
                four_piece.push(tempBoard[row-1][col+1]);
                four_piece.push(tempBoard[row-2][col+2]);
                four_piece.push(tempBoard[row-3][col+3]);
                score += 3*this.evaluate(four_piece, piece);
            }
        }
        return score;
    }

    minimax(board, depth, alpha, beta, maximizingPlayer) {
        let finished = this.gameOver(board);
        if (finished !== null) {
            let turn = this.playerTurn === 'player1' ? 1 : 2;
            if (board[finished[0][0]][finished[0][1]] === turn) {
                return [null, (depth+1)*1000000];
            } else {
                return [null, (depth+1)*-1000000]
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
        }
    }
}

class Position {
    constructor(board, height, moves){
        this.board = board; // The Board
        this.height = height; // Number of stones per column
        this.moves = moves; // The number of moves made
        this.WIDTH = 7;
        this.HEIGHT = 6;
    }

    canPlay(col) {
        return this.height[col] < this.HEIGHT;
    }

    play(col) {
        this.board[this.height[col]][col] = 1 + this.moves%2;
        this.height[col]++;
        this.moves++;
    }

    isWinningMove(col) {
        let current_player = 1 + this.moves % 2;
        if (this.height[col] >= 3 && 
            this.board[this.height[col]-1][col] === current_player &&
            this.board[this.height[col]-2][col] === current_player &&
            this.board[this.height[col]-3][col] === current_player){
            return true;
        }
        let leftMost = col - 3 < 0 ? 0: col-3;
        let rightMost = col + 3 >= 7 ? 6 : col + 3;
        let topMost = this.height[col] + 3 >= this.HEIGHT ? 5 : this.height[col] + 3;
        let bottomMost = this.height[col] - 3 < 0 ? 0 : this.height[col] - 3;
        let x = 0;
        // console.log(this.board);
        // console.log(rightMost);
        // console.log(leftMost);
        for (let i  = leftMost; i <= rightMost; i ++){
            if (this.height[i] >= this.HEIGHT) break;
            if (this.board[this.height[i]][i] === current_player){
                x++;
            }
            if (x >= 3){
                return true;
            }
        }

        // CHECK
        x = 0;
        for (let i = leftMost, j = topMost; i <= rightMost && j >= bottomMost; i++, j--){
            if (this.board[j][i] === current_player){
                x ++;
            } else if (i !== col){
                x = 0;
            }
            if (x >= 3){
                return true;
            }
        }
        for (let i = leftMost, j = bottomMost; i <= rightMost && j <= topMost; i++, j++){
            if (this.board[j][i] === current_player){
                x++;
            } else if (i !== col){
                x = 0;
            }
            if (x >= 3){
                return true;
            }
        }
    }
}

class AIBetter {
    constructor() {
        this.nodeCount = 0;
        this.columnOrder = [];
        this.columnOrder[0] = 3;
        this.columnOrder[1] = 4;
        this.columnOrder[2] = 2;
        this.columnOrder[3] = 5;
        this.columnOrder[4] = 1;
        this.columnOrder[5] = 6;
        this.columnOrder[6] = 0;
    }

    copyPosition(position) {
        let ret = [];
        for (let i = 0; i < position.board.length; i ++){
            ret[i] = position.board[i].slice();
        }
        let retPos = new Position(ret, [...position.height], position.moves);
        return retPos;
    }

    negaMax(position, alpha, beta, depth) {
        if (alpha > beta){
            throw 'Alpha > Beta';
        }
        this.nodeCount ++;

        if (position.moves == 42){
            return [0, 0];
        }

        for (let x = 0; x < COL_SIZE; x++){
            if (position.canPlay(x) && position.isWinningMove(x)){
                return [(COL_SIZE*ROW_SIZE +1 - position.moves)/2, x];
            }
        }

        if (depth === 0) {
            return [0, 0];
        }
        // let max = (COL_SIZE*ROW_SIZE-1 - position.moves)/2;
        // if (beta > max){
        //     beta = max;
        //     if (alpha >= beta) return beta;
        // }

        let bestAction = 0;
        for (let x = 0; x < COL_SIZE; x ++) {
            if (position.canPlay(this.columnOrder[x])) {
                let position2 = this.copyPosition(position);
                position2.play(this.columnOrder[x]);

                let score = -this.negaMax(position2, -beta, -alpha)[0];
                // console.log(score);
                if (score >= beta){
                    return [score, this.columnOrder[x]];
                }
                if (score > alpha){
                    alpha = score;
                    bestAction = this.columnOrder[x];
                }
            }
        }
        return [alpha, bestAction];
    }

    solve(position) {
        console.log(position);
        let pos = this.negaMax(position, -COL_SIZE*ROW_SIZE/2, COL_SIZE*ROW_SIZE/2, 6)[1];
        theGame.makeMove(position.height[pos], pos);
        position.play(pos);
        turnController();
    }
}