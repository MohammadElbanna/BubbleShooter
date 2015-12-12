import * as Bubble from "./bubble.js";

let newGameDialog = document.getElementById("start_game_dialog");

export function init () {
    
}

export function hideDialog () {
    newGameDialog.style.opacity = "0";
}

export function getAngleFromDevice (deviceXY, currentBubble) {
//    alert("in the get Angle");
    let BubbleXY = {
        x: currentBubble.dom.getBoundingClientRect().left + currentBubble.dom.getBoundingClientRect().width /2,
        y: currentBubble.dom.getBoundingClientRect().top + currentBubble.dom.getBoundingClientRect().height /2
    };
    
    let fireAngle = Math.atan((deviceXY.x - BubbleXY.x) / (BubbleXY.y - deviceXY.y));
    
    // if the player fired the ball at aproximatly horizontal level
    if(deviceXY.y > BubbleXY.y) {
        fireAngle = fireAngle + Math.PI;
    }
    
    return fireAngle;
}
