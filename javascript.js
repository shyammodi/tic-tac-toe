// javascript.js

//makes game with public methods playRound, getIsPlayer1turn, getGameOutcome, resetGame. Also allows getName and setName for a Player.
const game = (function createGame() {
    let gameboard = new Array(9).fill(0);
    let Player1 = makePlayer();
    let Player2 = makePlayer();
    let isPlayer1turn = true;

    function playRound(k) {
        if (isPlayer1turn)
        {
            Player1.selectSquare(k);
            gameboard[k] = 1;
        }
        else {
            Player2.selectSquare(k);
            gameboard[k] = 2;
        }
        isPlayer1turn = !isPlayer1turn;
    }

    function getGameOutcome() {
        const winningPositions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        let winner = 0;
        for (let i = 0; i < winningPositions.length; i++)
        {
            if(Player1.getPlayerSelections().includes(winningPositions[i][0]) && 
                Player1.getPlayerSelections().includes(winningPositions[i][1]) && 
                Player1.getPlayerSelections().includes(winningPositions[i][2])) {
                    winner = 1;
                    return winner;
                }
            else if(Player2.getPlayerSelections().includes(winningPositions[i][0]) && 
                Player2.getPlayerSelections().includes(winningPositions[i][1]) && 
                Player2.getPlayerSelections().includes(winningPositions[i][2])) {
                    winner = 2;
                    return winner;
                }
            else if(!gameboard.includes(0)) {
                winner = -1; //tie
            }
        }

        return winner;

    }

    function getIsPlayer1turn() {
        return isPlayer1turn;
    }

    function resetGame() {
        gameboard = new Array(9).fill(0);
        Player1 = makePlayer();
        Player2 = makePlayer();
        isPlayer1turn = true;
    }

    return {
        playRound,
        getIsPlayer1turn,
        getGameOutcome,
        resetGame
    }
})();

//makes player with public methods selectSquare, getPlayerSelections
function makePlayer() {
    let playerSelections = [];

    function selectSquare(k) {
        playerSelections.push(k);
        return playerSelections;
    }

    function getPlayerSelections() {
        return playerSelections;
    }

    return {
        selectSquare, getPlayerSelections
    };
}

//makes screen controller
const screenController = (function createScreenController() {
    const squares = getSquaresArray();
    for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", function(e) {
            modifyClickedSquare(e, game);
        });
    }

    const resetButton = getResetButton();
    resetButton.addEventListener("click", resetGame)

    function getSquaresArray() {
        const squares = Array.from(document.querySelectorAll("#gameboard button"));
        return squares;
    }

    function getGameboard () {
        return document.querySelector("#gameboard");
    }

    function getResetButton () {
        return document.querySelector("#resetGame");
    }

    function getPlayer1Name () {
        return document.querySelector("#Player1Name").value;
    }

    function getPlayer2Name () {
        return document.querySelector("#Player2Name").value;
    }

    function getOutcomeAnnouncement() {
        return document.querySelector("h1");
    }

    function modifyClickedSquare(e, game) {
        const isPlayer1turn = game.getIsPlayer1turn();
        if(e.target.classList.contains("selected")) {
            console.warn("square is already selected");
        }
        else {
            e.target.classList.add("selected");
            game.playRound(parseInt(e.target.id));
            e.target.disabled = true;
            if (isPlayer1turn) {
                e.target.textContent = "X";
            }
            else {
                e.target.textContent = "O";
            }
            console.log(game.getGameOutcome());
            if (game.getGameOutcome() !== 0) {
                endGame(game.getGameOutcome());
            }
        }
    }

    function endGame(gameOutcome) {
        getSquaresArray().forEach(element => element.disabled = true);
        const outcomeAnnouncement = document.createElement("h1");
        if (gameOutcome === -1) {
            outcomeAnnouncement.textContent = "Tie!";
        }
        else if (gameOutcome === 1) {
            if (getPlayer1Name().length > 0) {
                outcomeAnnouncement.textContent = getPlayer1Name() + " Wins!"
            }
            else {
                outcomeAnnouncement.textContent = "Player 1 Wins!"
            }
        }
        else if (gameOutcome === 2) {
            if (getPlayer2Name().length > 0) {
                outcomeAnnouncement.textContent = getPlayer2Name() + " Wins!"
            }
            else {
                outcomeAnnouncement.textContent = "Player 2 Wins!"
            }
        }
        else {
            console.error("Endgame called with invalid gameOutcome: " + gameOutcome);
        }
        getGameboard().insertAdjacentElement("afterend", outcomeAnnouncement);
    }

    function resetGame () {
        game.resetGame();
        getSquaresArray().forEach(element => {
            element.classList.remove(...element.classList);
            element.disabled = false;
            element.textContent = ""
        });
        getOutcomeAnnouncement().textContent = "";
    }

})();