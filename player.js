class Player extends Game {
    constructor(playerTurn) {
        super();
        this.playerTurn = playerTurn;
    }

    makeMove(col, board) {
        let row = this.lowestValidRow(col, board);

        if (row === -1){
            return;
        }
        theGame.makeMove(row, col);
    }
}