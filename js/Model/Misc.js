import * as UI from "./../ui.js";

let score = 0;
let timer = {
    min: 2,
    sec: 0
};

let timerID ;

export function init () {
    timerID = setInterval(updateTimer, 1000);
}

// let timerID = setInterval(updateTimer, 1000);

function updateTimer() {
//    UI.renderScore(score);
    UI.renderTime(timer);
    
    timer.sec --;
    
    if(timer.sec == -1) {
        if(timer.min == 0) {
            clearInterval(timerID);
            // render game over
        }
        else {
            timer.sec = 59;
            timer.min = timer.min - 1;            
        }
    }
    
    // render the timer 
}

export function updateScore(addedValue) {
    score = score + addedValue;
    if(addedValue > 0)
        UI.renderScore(score);
}