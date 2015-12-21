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