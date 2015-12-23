import * as Bubble from "./../bubble.js";
import * as UI from "./../ui.js";

export let NUM_ROW ;
export let NUM_COL;

let boardArray = [];

let Board = function () {
    let bubbleArray = createBubbleArray();
    
}

export let addBubble = function (bubble, coords) {
//    let rowNum = Math.floor(coords.y / (UI.bubbleRadius * 2));
    let rowNum = coords.y;
    coords.x = coords.x - UI.board.getBoundingClientRect().left;
    if(rowNum % 2 == 0) {
//        coords.x = coords.x - UI.spriteRadius /2
    }
    
    let colNum;
//    let colNum = Math.round(coords.x / (UI.bubbleRadius * 2)); 
//    colNum -= 1;
//    colNum = Math.round(colNum / 2) * 2;
    
    if (rowNum % 2 === 0) {
     colNum = Math.round(coords.x / (UI.bubbleRadius * 2)); 

        colNum = (colNum * 2) - 1;
    }
    else {
        colNum = Math.floor(coords.x / (UI.bubbleRadius * 2)); 

        colNum = (colNum * 2)  ;
    }
    
    if (!boardArray[rowNum]) {
        boardArray[rowNum] = [];
        NUM_ROW ++;
    }
//    else if (boardArray[rowNum][colNum] != false) {
//        b
//    }
    bubble.setCol(colNum);
    bubble.setRow(rowNum);
    boardArray[rowNum][colNum] = bubble;
}


export function init (numRows, numCols) {
    NUM_ROW = numRows;
    NUM_COL = numCols;
    
    createBoardArray();    
}

export let getBoardArray = function() {
    return boardArray;
} 



// return the bubble at the current position or null if it doesn't exist
function getBubbleAt(row, col) {
    if (!boardArray[row])
        return null;
    return boardArray[row][col];
}

// get the bubbles that surround a bubble
function getBubbleAround(row, col) {
    var bubbleList = [];
    for(let i = row -1; i <= row + 1; i++) {
        // loop through bubbles in that row
        for(let j = col - 2; j <= col + 2; j++) {
            let bubble = getBubbleAt(i, j);
            if (bubble) {
                bubbleList.push(bubble);
            }
        }
    }
    return bubbleList;
}

// get the connected group of bubbles (that share the same color, or not) starting from this bubble
export function getGroup (bubble, bubblesFound, differentColor) {
    let currentRow = bubble.row;
    if(!bubblesFound[currentRow]) {
        bubblesFound[currentRow] = {};
    }
    if(!bubblesFound.list) {
        bubblesFound.list = [];
    }
    if(bubblesFound[bubble.row][bubble.col]) {
        // we end this branch of recursion here because we've been to this bubble before
        return bubblesFound;
    }
    
    // add the bubble to the 2D array
    bubblesFound[bubble.row][bubble.col] = bubble;
    // push the bubble to the linear list
    bubblesFound.list.push(bubble);
    // get a list of bubbles that surround this bubble and are of the same color
    let surrounding = getBubbleAround(bubble.row, bubble.col);
    // for every surrounding bubble recursively call this function again
    for(let i = 0; i < surrounding.length; i++) {
        if(surrounding[i].type === bubble.type || differentColor) {
            bubblesFound = getGroup(surrounding[i], bubblesFound, differentColor);
        }
    }
    
    return bubblesFound;
}
    
export function findOrphans () {
    let connected = [];
    let groups = [];
    let orphans = [];
    // initialize the rows of the connected
    for(let i = 0; i < boardArray.length; i++) {
        connected[i] = [];
    }
    // loop on the first row, because it should be the root of every connected group
    // initially everything is NOT connected
    for(let i = 0; i < boardArray[0].length; i++) {
        let bubble = boardArray[0][i];
        if(bubble && !connected[0][i]) {
            // here we pass true, because we want to match for any color
            let group = getGroup(bubble, {}, true);
            group.list.forEach(item => connected[item.row][item.col] = true);
        }
    }
    
    // loop through all the board to detect orphan bubbles after we decided connected bubbles with the first row
    for(let i = 0; i < boardArray.length; i++) {
        let startCol = i%2 == 0 ? 1 : 0;
        for(let j = startCol; j < NUM_COL; j += 2) {
            let bubble = getBubbleAt(i, j);
            if(bubble && !connected[i][j]) {
                orphans.push(bubble);
            }
        }
    }
    
    return orphans;
}
    
export function deleteBubble(bubble) {
    delete boardArray[bubble.row][bubble.col];
}


let createBoardArray = function () {
    for(let i = 0; i < NUM_ROW; i++) {
        let startCol = i%2 == 0 ? 1 : 0;
        boardArray[i] = [];
        
        for (let j = startCol ; j < NUM_COL; j+= 2) {
            let bubble = Bubble.create(i, j);
            boardArray[i][j] = bubble;
        }
    }
}