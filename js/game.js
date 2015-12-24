import * as UI from "./ui.js";
import * as Bubble from "./bubble.js";
import * as Board from "./Model/Board.js";
import * as Collision from "./collisionDetector.js";
import * as State from "./Model/Misc.js";

let board ;

export function init() {
    window.addEventListener("load" , function () {
        UI.newGameButton.addEventListener("click", startGame);
        window.addEventListener("resize", UI.resize);
        document.body.addEventListener("orientationchange", UI.resize);
    });
}
    
function startGame () {
    Board.init(5,30);
    UI.init();
    UI.newGameButton.removeEventListener("click", startGame);
    UI.hideDialog();
    
//    UI.drawBoard();
    
    // set the first next bubble
    UI.prepareNextBubble();
    UI.resize();
//    UI.drawBoard();
    
    
    // add event listner for mouse clicks on the board
    UI.gameBoard.addEventListener("touchstart", ballFiredHandler);
    UI.gameBoard.addEventListener("click", ballFiredHandler);
    
    State.init();
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
    // get the firing angle
    let angle = getAngleFromDevice(coordinates);
    
    // default distance and duration
    let animationDuration = 750; // 0.75 sec
    let distance = 1000;
    
    let collisionHappened = Collision.findIntersection(angle, UI.currentBubble);
    
    let animationCallback;
    let newBubble = Bubble.deepCopy(UI.currentBubble);
    UI.board.appendChild(newBubble.dom);
    // randomly change the type to get a new bubble with a new color
    UI.currentBubble.changeType();
    
    // if collision occurs change distance and duration.
    if (collisionHappened) {
        animationDuration = animationDuration * collisionHappened.distanceToCollision / distance;
        distance = collisionHappened.distanceToCollision;
        // update the board state with the position of the new bubble. also update the col and row of the bubble object itself
        Board.addBubble(newBubble, collisionHappened.coords);
        
        // check for groups with the same color like our new bubble
        let group = Board.getGroup(newBubble, {});
        
        
        animationCallback = function () {
            // re-render all the dom tree when the animation finish to put the new bubble in the appropriate position
            UI.drawBoard();
            if(group.list.length >= 3) {
                popBubbles(group.list);
                // update score
                State.updateScore(group.list.length * 10);
//                UI.drawBoard();
            }
        }
    } // end if
    
    else {
        animationCallback = function () {
            newBubble.dom.remove();
        }
    } // end else
    
    // fire up the animation
    UI.startBallAnimation(newBubble, angle, animationDuration, distance, animationCallback);
    
    
    event.preventDefault();

}


function popBubbles (bubbles){
    bubbles.forEach(bubble => Board.deleteBubble(bubble));
    // get the orphans 
    let orphans = Board.findOrphans();
    // update score from the orphans
    State.updateScore(orphans.length * 20);
    
    bubbles.forEach( (bubble, index) => {
        let bubbleDom = document.getElementById(bubble.row + "" + bubble.col);
        // if it was the last ball animated then we want to drop bubbles if existed
        if((orphans.length > 0) && (index == bubbles.length - 1))
            UI.animateVanish(bubbleDom, bubble, UI.dropBubbles(orphans));
        else
            UI.animateVanish(bubbleDom, bubble);
    });
}


function getAngleFromDevice (deviceXY) {
//    alert("in the get Angle");
    let BubbleXY = {
        x: UI.currentBubble.dom.getBoundingClientRect().left + UI.currentBubble.dom.getBoundingClientRect().width /2,
        y: UI.currentBubble.dom.getBoundingClientRect().top + UI.currentBubble.dom.getBoundingClientRect().height /2
    };
    
    let fireAngle = Math.atan((deviceXY.x - BubbleXY.x) / (BubbleXY.y - deviceXY.y));
    
//    let fireAngle = Math.atan2((deviceXY.x - BubbleXY.x) , (BubbleXY.y - deviceXY.y));

    
     //if the player fired the ball at aproximatly horizontal level
//    if(deviceXY.y > BubbleXY.y) {
//        fireAngle = fireAngle + Math.PI;
//    }
    
    return fireAngle;
}

