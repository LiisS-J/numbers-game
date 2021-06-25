/*
 * Numcell class holds the value and status of each individual square.
 */
class NumSquare {
    constructor(value) {
        this.status = true; 
        this.value = value;
    };
};

/*
 * SquarePosition class holds the position of each square(which column and which row it is in).
 */

class SquarePosition {
    constructor(row, column) {
        this.row = row;
        this.column = column;
    };
};

/*
 * starterGrid is a multi-dimensional array that serves as a template to gameStarter(). It holds all the number 
 * values and positions for each square and gets pushed into the gameGrid when the gameStarter function runs.
 */
let starterGrid = [
    [1,2,3,4,5,6,7,8,9],
    [1,1,1,2,1,3,1,4,1],
    [5,1,6,1,7,1,8,1,9],
    [2,1,2,2,2,3,2,4,2],
    [5,2,6,2,7,2,8,2,9],
    [3,1,3,2,3,3,3,4,3],
    [5,3,6,3,7,3,8,3,9],
    [4,1,4,2,4,3,4,4,4],
    [5,4,6,4,7,4,8,4,9],
    [5,1,5,2,5,3,5,4,5],
    [5,5,6,5,7,5,8,5,9],
    [6,1,6,2,6,3,6,4,6],
    [5,6,6,6,7,6,8,6,9],
    [7,1,7,2,7,3,7,4,7],
    [7,7,6,7,7,7,8,7,9],
    [8,1,8,2,8,3,8,4,8],
    [5,8,6,8,7,8,8,8,9],
    [9,1,9,2,9,3,9,4,9],
    [5,9,6,9,7,9,8,9,9]
];

// Creates the game grid that gets rendered in the browser
let gameGrid = [];

/*
 * gameStarter() function starts the game by creating a grid using DOM manipulation along with
 * the singleCell() and createRow() functions.
 */
function gameStarter() {
    // this loop loops over each row in the starterGrid array
    for(let i = 0; i < starterGrid.length; i++){
        gameGrid[i] = [];
        // This loop loops over each number square(singleDiv)
        for(let j = 0; j < starterGrid[i].length; j++) {
            gameGrid[i][j] = new NumSquare(starterGrid[i][j]);
        }
        createRow(i, starterGrid[i]);
    }
};

/* 
 * singleCell() creates a single div element(number square) in the singleRow array.
 */
function singleCell(divIndex, num) {
    const singleDiv = document.createElement('div');
    singleDiv.innerText = num;
    singleDiv.classList.add('gridCell');
    singleDiv.setAttribute('data-index', divIndex);
    return singleDiv;
}

/* 
 * This function creates a div element that makes up a row in the grid. 
 */
function createRow(rowIndex, rowOfNums) {
    let singleRow = document.createElement('div');
    singleRow.classList.add('gridRow');
    singleRow.setAttribute('data-index', rowIndex);
    /*
     * this part of the function loops over each array element(singleDiv) and appends that element 
     * into the singleRow variable.
     */
    for(let i = 0; i < rowOfNums.length; i++) {
        singleRow.appendChild(singleCell(i, rowOfNums[i]));
    }
    document.querySelector('#main-grid').appendChild(singleRow);
};

/* 
 * This is an event handler that listens to which square is clicked
 */
const squareClick = document.querySelector('#main-grid');
squareClick.addEventListener('click', function(event) {
    let squareIdx = parseInt(event.target.getAttribute('data-index'));
    let rowIdx = parseInt(event.target.parentElement.getAttribute('data-index'));
    game.clickedSquares.push(new SquarePosition(rowIdx, squareIdx));
    if (game.clickedSquares.length === 2) {
        matchSeeker();
    }
    // get index of the square and the index of the parent(row)
});

// The game object tracks which two squares are clicked and which index the background array is currently selected with the
// background button click
const game = {
    clickedSquares: [],
    bgColorIndex: 0
}

/*
 * This function checks if the two numbers clicked add up to 10 or match in value
 * Creating two variables that hold copies of game.clickedSquares[0]- first clicked num and 
 * game.clickedSquares[1]- second clicked num
 */
function matchSeeker(){
    let sq1 = game.clickedSquares[0];
    let sq2 = game.clickedSquares[1];
    if (gameGrid[sq1.row][sq1.column].value == gameGrid[sq2.row][sq2.column].value
        || gameGrid[sq1.row][sq1.column].value + gameGrid[sq2.row][sq2.column].value == 10) {
        crossOut(sq1);
        crossOut(sq2);
    }
    game.clickedSquares = [];
};

/*
 * This function updates the clicked number's status to false which turns it "off" in the game grid.
 * It then covers the matched numbers with a png image to show they are matched up
 */
function crossOut(sqPos){
    gameGrid[sqPos.row][sqPos.column].status = false;
    document.querySelector(`.gridRow[data-index="${sqPos.row}"] .gridCell[data-index="${sqPos.column}"]`).classList.add('crossedOut');
}

/* 
 * This function clears the main-grid div content to reset the grid
 */
function clearcontent(elementId) {
    document.querySelector('#main-grid').innerHTML = "";
}

/* 
 * Connecting the gameStarter() function to the START and the RESET buttons, along with a clearContent() function
 * that empties the grid and resets the game board.
 */
const startBtn = document.querySelector('#start-btn');

startBtn.addEventListener('click', function() {
    gameStarter();
});

const resetBtn = document.querySelector('#reset-btn');

resetBtn.addEventListener('click', function () {
    clearcontent();
    gameStarter();
});

/*
 * This function loops through each index of the colorArr that hold values of pre-set colors. They keep getting looped through
 * as long as the player clicks the BACKGROUND button
 */
function bgPicker() {
    const colorArr = ['#013a63', '#fc8f4e', '#57cc99', '#95a6a6', '#b392ac', '#a8dadc', '#fa9ba1', '#669bbc', '#8d99ae'];
    if(game.bgColorIndex === colorArr.length -1){
        game.bgColorIndex = 0;
    } else {
        game.bgColorIndex++;
    }
    document.body.style.backgroundColor = colorArr[game.bgColorIndex];
};

/*
 * Connecting the BACKGROUND button to the bgPicker function
 */
const backGroundPkr = document.querySelector('#bg-btn');

backGroundPkr.addEventListener('click', function(){
    bgPicker();
});

/*
 * This countDown() function starts a timer from a pre-set value. It also clears and resets the grid when time runs out.
 */
const fastGame = document.querySelector('#fastGame');

fastGame.addEventListener('click', function() {
    
    const startMins = 0.25;
    let time = startMins * 60;
    const countDownBtn = document.querySelector('#timer');
    const timer = setInterval(countDown, 1000);

    gameStarter();
    function countDown() {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;

        if (seconds < 10) {
            seconds = 0 + seconds;
        } else {
            seconds;
        }

        time--;
        countDownBtn.innerHTML = `${minutes}: ${seconds}`;

        if(time < 0){
            const loseMsg = document.createElement('h1');
            loseMsg.innerText = "TIME'S UP! YOU LOST THE GAME! (✖╭╮✖)"
            loseMsg.setAttribute('id', 'loseMsg');
            document.body.querySelector('.main-content').appendChild(loseMsg);
            stopCountDown();
            clearcontent();
            gameStarter();
            return;
        }
    };
    function stopCountDown() {
        clearInterval(timer);
    }
});
