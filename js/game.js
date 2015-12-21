import * as UI from "./ui.js";
import * as Bubble from "./bubble.js";
import * as Board from "./Model/Board.js";
import * as Collision from "./collisionDetector.js";

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
    UI.currentBubble.changeType();
    
    // if collision occurs change distance and duration.
    if (collisionHappened) {
        animationDuration = animationDuration * collisionHappened.distanceToCollision / distance;
        distance = collisionHappened.distanceToCollision;
        
        animationCallback = function () {
//            UI.currentBubble.dom.removeAttribute("id");
            Board.addBubble(newBubble, collisionHappened.coords);
            UI.drawBoard();
        }
    } // end if
    
    else {
//        UI.setNewBubblePosition();
        animationCallback = function () {
            newBubble.dom.remove();
            
        }
    } // end else
    
    // fire up the animation
    UI.startBallAnimation(newBubble, angle, animationDuration, distance, animationCallback);
    
    
    event.preventDefault();

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

