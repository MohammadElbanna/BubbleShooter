import * as Bubble from "./bubble.js";
import * as Board from "./Model/Board.js";

export let newGameDialog = document.getElementById("start_game_dialog");
export let currentBubble;
export let gameBoard = document.getElementById("game");
export let newGameButton = document.getElementById("new_game_button");
export let topbar = document.getElementById("topbar");
export let footer = document.getElementById("footer");

export let board = document.getElementById("board");

let scoreDom = document.getElementById("score");
let timeDom = document.getElementById("timer");


export let boardWidth;
export let boardHeight;

export let spriteRadius = 0;
export let bubbleRadius = 0;
export let twoSidesEmptySpace = 0;

// number of col in the board
let numOfCol;
// number of rows in the board
let numOfRow;

let boardInitiated;

export function init () {
    numOfCol = Board.NUM_COL / 2;  
    numOfRow = Board.NUM_ROW;
    boardInitiated = false;
}

export function hideDialog () {
    newGameDialog.style.opacity = "0";
    newGameDialog.style.display = "none";
}



export function startBallAnimation (firedBubble, angle, duration, distance, animationCallback) {
//    let angle = getAngleFromDevice(deviceXY);
//    let distance = 1000;
    // let us assume that we will fire the ball for 1000px for now
    let distanceX = Math.sin(angle) * distance;
    let distanceY = Math.cos(angle) * distance;
    
    let numberOfIterations = Math.ceil(duration / 16); 
    let xEveryFrame = distanceX / numberOfIterations;
    let yEveryFrame = distanceY / numberOfIterations;
    
        
//    let animationLoop = function () {
//        firedBubble.dom.style.left = (parseFloat(firedBubble.dom.style.left) + xEveryFrame) + "px";
//        firedBubble.dom.style.top = (parseFloat(firedBubble.dom.style.top) - yEveryFrame) + "px";
//        
//        numberOfIterations --;
//        if (numberOfIterations === 0) {
//            cancelAnimationFrame(loopID);
//            animationCallback();
//        }
//        else {
//            loopID = requestAnimationFrame(animationLoop);
//        }
//    }
//    
//    let loopID = requestAnimationFrame(animationLoop);
    
    firedBubble.dom.addEventListener("transitionend", function () {
        animationCallback();
        firedBubble.dom.removeEventListener("transitionend");
    }, false);
    firedBubble.dom.style.transition = "transform " + (duration/1000) + "s ease-out";
    firedBubble.dom.style.transition = "-webkit-transform " + (duration/1000) + "s ease-out";
//    firedBubble.dom.style.transition = "-webkit-transform " + 1 + "s ease-out";
//    firedBubble.dom.style.transition = "transform " + 1 + "s ease-out";


//        firedBubble.dom.style.transition = "transform " + 0.5 + "s linear";
    setTimeout(() => {
        firedBubble.dom.style.webkitTransform = "translate(" + distanceX + "px," + (-distanceY + spriteRadius) + "px)";
        firedBubble.dom.style.transform = "translate(" + distanceX + "px," + (-distanceY + spriteRadius) + "px)";        
    }, 20);


}   
    
export function prepareNextBubble() {
    if(currentBubble) {
        
    }
    currentBubble = Bubble.create(-1, -1);
    
    // make the new bubble the current bubble, then add it to the dom
    currentBubble.dom.classList.add("curr_bubble");
    
//    board.appendChild(currentBubble.dom);    
}

export function resize () {
    
    let gameWidth = window.innerWidth;
    let gameHeight = window.innerHeight;

    let scaleToFitX = gameWidth / 720; // the game will be playable in portrait mode, so 720 for horizontal and 1280 for vertical
    let scaleToFitY = gameHeight / 1280;
    let optimalRatio = Math.min(scaleToFitX, scaleToFitY);
//    var optimalRatio = Math.max(scaleToFitX, scaleToFitY);

    boardWidth = (720 * optimalRatio);
    boardHeight = ((1280 * optimalRatio) - (topbar.getBoundingClientRect().height + footer.getBoundingClientRect().height));
    bubbleRadius = (boardWidth / (numOfCol +1)) / 2;
    spriteRadius = bubbleRadius / 0.88;
    
    board.style.width = boardWidth + "px";
    board.style.height = boardHeight + "px";
    
    
    
//    currentBubble.left = ((boardWidth / 2) - (bubbleRadius)) + "px";
//    currentBubble.top = (boardHeight - (bubbleRadius * 3)) + "px";
    
    drawBoard();
//    let bubbleWidth = (newBoardWidth / numOfCol +3);
//    // update global bubbleRadius variable
//    
////    cssRender(bubbleWidth);
//    // resize the currentBubble
//    if(currentBubble) {
////        currentBubble.dom.style.left = ( (newBoardWidth / 2) - (bubbleWidth /2) ) + "px";
//    }

    

}
    
export function setNewBubblePosition() {
    let width = (spriteRadius * 2) + "px";
    let left = ((boardWidth / 2) - (spriteRadius)) + "px";
    let top = (boardHeight - (spriteRadius * 3)) + "px";
    currentBubble.dom.setAttribute("id", "current");
    currentBubble.dom.style.left = left;
    currentBubble.dom.style.top = top;
    currentBubble.dom.style.width = width;
    currentBubble.dom.style.height = width;
//    currentBubble.dom.classList.add("curr_bubble");
}
    

export function dropBubbles(orphanBubbles) {
    let partialApplication = function () {
        for(let i = 0; i < orphanBubbles.length; i++) {
            let bubble = orphanBubbles[i];
            let bubbleDom = document.getElementById(bubble.row + "" + bubble.col);
            bubbleDom.addEventListener("transitionend", function () {
                Board.deleteBubble(bubble)
                bubbleDom.removeEventListener("transitionend");
                bubbleDom.remove();
            }, false);
            
//            bubbleDom.style.transition = "transform " + 1.2 + "s cubic-bezier(0.59,-0.05, 0.74, 0.05)";
            bubbleDom.style.transition = "-webkit-transform " + 0.8 + "s cubic-bezier(0.59,-0.05, 0.74, 0.05)";


            bubbleDom.style.webkitTransform = "translate(" + 0 + "px," + 1500 + "px)";
            bubbleDom.style.transform = "translate(" + 0 + "px," + 1500 + "px)";
        }
    }
    
    return partialApplication;
}

    
export function animateVanish (bubbleDom, bubble, animateCallback) {
    let numOfIteration = 15;
    let counter = numOfIteration;
    
    let animateBubble = function () {
        if(counter == numOfIteration) {
            bubbleDom.style.backgroundPosition = "33.33333333% " + bubble.getHeightPosFromType() + "%";
        }
        else if(counter == Math.floor(numOfIteration * 2/3)) {
            bubbleDom.style.backgroundPosition = "66.66666667%" + bubble.getHeightPosFromType() + "%";
        }
        else if(counter == Math.floor(numOfIteration * 1/3)) {
            bubbleDom.style.backgroundPosition = "100%" + bubble.getHeightPosFromType() + "%";
        }
        if(counter == 0) {
            bubbleDom.remove();
            cancelAnimationFrame(loopID);
            if(animateCallback) {
                // if it was the last bubble to be animated then we want to animate orphans if the exist
                animateCallback();
            }
        }
        else {
            counter --;
            loopID = requestAnimationFrame(animateBubble);            
        }
    }   
    
    let loopID = requestAnimationFrame(animateBubble);
}

    
    
export function drawBoard() {
    let boardArray = Board.getBoardArray();
//    let fragment = document.createDocumentFragment();
    let width = spriteRadius * 2;
    let htmlString = "";
    
    if(currentBubble) {
        let left = ((boardWidth / 2) - (spriteRadius)) + "px";
        let top = (boardHeight - (spriteRadius * 3)) + "px";
        htmlString += "<div id='current' class='bubble bubble" + currentBubble.type + "' style=' width: " + width + "px; height: " +
                    width + "px;" + "left: " + ((boardWidth / 2) - (spriteRadius)) + "px;" + " top: " +
                    (boardHeight - (spriteRadius * 3)) + "px;' > </div>";
        
//        currentBubble.dom.style.left = ( (newBoardWidth / 2) - (bubbleWidth /2) ) + "px";
    }
    
    for (let i = 0; i < Board.NUM_ROW; i++) {
        for (let j = 0; j < numOfCol * 2; j++) {
            let bubble = boardArray[i][j];
            // there exist a bubble on that index (even rows have bubble on the odd column indicies)
            if(bubble) {
                let left = (j * bubbleRadius);
                let top = (i * bubbleRadius * 2 - (spriteRadius * 0.15 * i));
                
                // update the coords in the bubble object (these coords are coords of the center of the bubble)
                bubble.setCoords(left +  board.getBoundingClientRect().left + bubbleRadius, top + board.getBoundingClientRect().top + bubbleRadius);
                
                htmlString += "<div id='" + i + "" + j + "' class='bubble bubble" + bubble.type + "' style='left: " + left + "px; top: " + top +
                    "px; width: " + width + "px;height: " + width + "px;' ></div>";
            }
        }
    }

    board.innerHTML = htmlString;
    currentBubble.setDOM(document.getElementById("current"));
//    board.appendChild(fragment);
//    cssRender(bubbleRadius * 2);
//    boardInitiated = true;
}
    
/*
=========================
Render timer and score
=========================
*/

export function renderTime(timerState) {
    timeDom.textContent = "Remaining time " + timerState.min + ":" + timerState.sec;
}

export function renderScore(scoreState) {
    scoreDom.textContent = "Score: " + scoreState;
}

