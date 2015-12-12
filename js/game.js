import * as UI from "./ui.js";
import * as Bubble from "./bubble.js";

let currentBubble;
let gameBoard = document.getElementById("game");
let board = document.getElementById("board");
let newGameButton = document.getElementById("new_game_button");

export function init() {
    newGameButton.addEventListener("click", startGame);
}
    
function startGame () {
    newGameButton.removeEventListener("click", startGame);
    UI.hideDialog();
    
    // set the first current bubble
    currentBubble = getNextBubble();
    // add event listner for mouse clicks on the board
    gameBoard.addEventListener("touchstart", ballFiredHandler);
    gameBoard.addEventListener("click", ballFiredHandler);
}

function ballFiredHandler(event) {
    let coordinates = {};
    if(event.type == "touchstart") {
        coordinates.x = event.changedTouches[0].pageX;
        coordinates.y = event.changedTouches[0].pageY;
    }
    else {
        // handling mouse
        coordinates.x = event.pageX;
        coordinates.y = event.pageY;
    }
    
    let angle = UI.getAngleFromDevice(coordinates, currentBubble);

    // let us assume that we will fire the ball for 1000px for now
    let distanceX = (Math.sin(angle) * 800) ;
    let distanceY =  (Math.cos(angle) * 800);    
    
    if(distanceY > 0)
        distanceY = distanceY * -1;

    currentBubble.dom.style.transform = "translate(" + distanceX + "px," + distanceY + "px)";
    currentBubble.dom.style.webkitTransform = "translate(" + distanceX + "px," + distanceY + "px)";
//    currentBubble.dom.setAttribute("style", "-webkit-transform: " + "translate(" + distanceX + "px," + distanceY + "px)");
    event.preventDefault();

}

function getNextBubble() {
    var nextBubble = Bubble.create();
    
    // make the new bubble the current bubble, then add it to the dom
    nextBubble.dom.classList.add("curr_bubble");
    board.appendChild(nextBubble.dom);
    
    return nextBubble;
}