// javascript.js

function createGame() {
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

    function getGameboard() {
        return gameboard;
    }

    return {
        getGameboard,
        Player1: {
            getName: Player1.getName,
            setName: Player1.setName
        },
        Player2: {
            getName: Player2.getName,
            setName: Player2.setName
        },
        playRound,
        getIsPlayer1turn,
        getGameOutcome
    }
};

function makePlayer() {
    let name = "";
    let playerSelections = [];

    function setName(theName) {
        name = theName;
        return name;
    }

    function getName() {
        return name;
    }

    function selectSquare(k) {
        playerSelections.push(k);
        return playerSelections;
    }

    function getPlayerSelections() {
        return playerSelections;
    }

    return {
        getName, setName, selectSquare, getPlayerSelections
    };
}

const game = createGame();
while (game.getGameOutcome() === 0)
{
    const selection = window.prompt("select a number from 0 to 8 corresponding to your square selection");
    game.playRound(parseInt(selection));
    console.log(game.getGameboard());
}
console.log(game.getGameOutcome());