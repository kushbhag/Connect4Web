class AI extends Game {
    constructor(playerTurn) {
        super();
        this.playerTurn = playerTurn;
    }

    makeMove(board = null) {
        if (this.playerTurn !== 'player0'){
            let row = lowestValidRow(3);
            theGame.makeMove(row, 3);
        }
    }
}