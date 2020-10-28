class Player extends Game {
    constructor(playerTurn) {
        super();
        this.playerTurn = playerTurn;
    }

    makeMove(col, board) {
        let row = this.lowestValidRow(col, board);

        if (row === -1){
            return false;
        }
        theGame.makeMove(row, col);
        turnController();
        return true;
    }
}