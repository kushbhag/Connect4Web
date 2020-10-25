class Player extends Game {
    constructor(playerTurn) {
        super();
        this.playerTurn = playerTurn;
    }

    makeMove(col) {
        let row = lowestValidRow(col);

        if (row === -1){
            return;
        }
        theGame.makeMove(row, col);
    }
}