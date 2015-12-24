(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;
exports.getGroup = getGroup;
exports.findOrphans = findOrphans;
exports.deleteBubble = deleteBubble;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _bubbleJs = require("./../bubble.js");

var Bubble = _interopRequireWildcard(_bubbleJs);

var _uiJs = require("./../ui.js");

var UI = _interopRequireWildcard(_uiJs);

var NUM_ROW = undefined;
exports.NUM_ROW = NUM_ROW;
var NUM_COL = undefined;

exports.NUM_COL = NUM_COL;
var boardArray = [];

var totalNumberOfBubbles = 0;

function init(numRows, numCols) {
    exports.NUM_ROW = NUM_ROW = numRows;
    exports.NUM_COL = NUM_COL = numCols;
    totalNumberOfBubbles = NUM_ROW * NUM_COL;

    createBoardArray();
}

var Board = function Board() {
    var bubbleArray = createBubbleArray();
};

var addBubble = function addBubble(bubble, coords) {
    //    let rowNum = Math.floor(coords.y / (UI.bubbleRadius * 2));
    var rowNum = coords.y;
    coords.x = coords.x - UI.board.getBoundingClientRect().left;
    if (rowNum % 2 == 0) {
        //        coords.x = coords.x - UI.spriteRadius /2
    }

    var colNum = undefined;
    //    let colNum = Math.round(coords.x / (UI.bubbleRadius * 2));
    //    colNum -= 1;
    //    colNum = Math.round(colNum / 2) * 2;

    if (rowNum % 2 === 0) {
        colNum = Math.round(coords.x / (UI.bubbleRadius * 2));

        colNum = colNum * 2 - 1;
    } else {
        colNum = Math.floor(coords.x / (UI.bubbleRadius * 2));

        colNum = colNum * 2;
    }

    if (!boardArray[rowNum]) {
        boardArray[rowNum] = [];
        exports.NUM_ROW = NUM_ROW += 1;
    }
    //    else if (boardArray[rowNum][colNum] != false) {
    //        b
    //    }
    bubble.setCol(colNum);
    bubble.setRow(rowNum);
    boardArray[rowNum][colNum] = bubble;
};

exports.addBubble = addBubble;
var getBoardArray = function getBoardArray() {
    return boardArray;
};

exports.getBoardArray = getBoardArray;
// return the bubble at the current position or null if it doesn't exist
function getBubbleAt(row, col) {
    if (!boardArray[row]) return null;
    return boardArray[row][col];
}

// get the bubbles that surround a bubble
function getBubbleAround(row, col) {
    var bubbleList = [];
    for (var i = row - 1; i <= row + 1; i++) {
        // loop through bubbles in that row
        for (var j = col - 2; j <= col + 2; j++) {
            var bubble = getBubbleAt(i, j);
            if (bubble) {
                bubbleList.push(bubble);
            }
        }
    }
    return bubbleList;
}

// get the connected group of bubbles (that share the same color, or not) starting from this bubble

function getGroup(bubble, bubblesFound, differentColor) {
    var currentRow = bubble.row;
    if (!bubblesFound[currentRow]) {
        bubblesFound[currentRow] = {};
    }
    if (!bubblesFound.list) {
        bubblesFound.list = [];
    }
    if (bubblesFound[bubble.row][bubble.col]) {
        // we end this branch of recursion here because we've been to this bubble before
        return bubblesFound;
    }

    // add the bubble to the 2D array
    bubblesFound[bubble.row][bubble.col] = bubble;
    // push the bubble to the linear list
    bubblesFound.list.push(bubble);
    // get a list of bubbles that surround this bubble and are of the same color
    var surrounding = getBubbleAround(bubble.row, bubble.col);
    // for every surrounding bubble recursively call this function again
    for (var i = 0; i < surrounding.length; i++) {
        if (surrounding[i].type === bubble.type || differentColor) {
            bubblesFound = getGroup(surrounding[i], bubblesFound, differentColor);
        }
    }

    return bubblesFound;
}

function findOrphans() {
    var connected = [];
    var groups = [];
    var orphans = [];
    // initialize the rows of the connected
    for (var i = 0; i < boardArray.length; i++) {
        connected[i] = [];
    }
    // loop on the first row, because it should be the root of every connected group
    // initially everything is NOT connected
    for (var i = 0; i < boardArray[0].length; i++) {
        var bubble = boardArray[0][i];
        if (bubble && !connected[0][i]) {
            // here we pass true, because we want to match for any color
            var group = getGroup(bubble, {}, true);
            group.list.forEach(function (item) {
                return connected[item.row][item.col] = true;
            });
        }
    }

    // loop through all the board to detect orphan bubbles after we decided connected bubbles with the first row
    for (var i = 0; i < boardArray.length; i++) {
        var startCol = i % 2 == 0 ? 1 : 0;
        for (var j = startCol; j < NUM_COL; j += 2) {
            var bubble = getBubbleAt(i, j);
            if (bubble && !connected[i][j]) {
                orphans.push(bubble);
            }
        }
    }

    return orphans;
}

function deleteBubble(bubble) {
    delete boardArray[bubble.row][bubble.col];
}

var createBoardArray = function createBoardArray() {
    for (var i = 0; i < NUM_ROW; i++) {
        var startCol = i % 2 == 0 ? 1 : 0;
        boardArray[i] = [];

        for (var j = startCol; j < NUM_COL; j += 2) {
            var bubble = Bubble.create(i, j);
            boardArray[i][j] = bubble;
        }
    }
};

},{"./../bubble.js":4,"./../ui.js":7}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;
exports.updateScore = updateScore;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _uiJs = require("./../ui.js");

var UI = _interopRequireWildcard(_uiJs);

var score = 0;
var timer = {
    min: 2,
    sec: 0
};

var timerID = undefined;

function init() {
    timerID = setInterval(updateTimer, 1000);
}

// let timerID = setInterval(updateTimer, 1000);

function updateTimer() {
    //    UI.renderScore(score);
    UI.renderTime(timer);

    timer.sec--;

    if (timer.sec == -1) {
        if (timer.min == 0) {
            clearInterval(timerID);
            // render game over
        } else {
                timer.sec = 59;
                timer.min = timer.min - 1;
            }
    }

    // render the timer
}

function updateScore(addedValue) {
    score = score + addedValue;
    if (addedValue > 0) UI.renderScore(score);
}

},{"./../ui.js":7}],3:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _gameJs = require("./game.js");

var game = _interopRequireWildcard(_gameJs);

game.init();

},{"./game.js":6}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _uiJs = require("./ui.js");

var UI = _interopRequireWildcard(_uiJs);

function Bubble(domElement, row, col, type) {
    domElement.classList.add("bubble");
    domElement.classList.add("bubble" + type);
    this.dom = domElement;
    this.col = col;
    this.row = row;
    this.type = type;
}

Bubble.prototype.setType = function (type) {
    this.type = type;
};

Bubble.prototype.setDOM = function (newDom) {
    this.dom = newDom;
};

Bubble.prototype.setCoords = function (left, top) {
    this.left = left;
    this.top = top;
};

Bubble.prototype.setCol = function (col) {
    this.col = col;
};

Bubble.prototype.setRow = function (row) {
    this.row = row;
};

Bubble.prototype.getCoords = function () {
    return {
        left: this.left,
        top: this.top
    };
};

Bubble.prototype.changeType = function (type) {
    this.dom.classList.remove("bubble" + this.type);
    if (type === undefined) {
        type = Math.floor(Math.random() * 4);
    }
    this.setType(type);
    this.dom.classList.add("bubble" + type);
};

Bubble.prototype.getHeightPosFromType = function () {
    if (this.type == 0) {
        return 0;
    }
    if (this.type == 1) {
        return 33.33333333;
    }
    if (this.type == 2) {
        return 66.66666667;
    }
    if (this.type == 3) {
        return 100;
    }
};

var create = function create(row, col, type) {
    var bubbleDOM = document.createElement("div");

    if (type === undefined) {
        type = Math.floor(Math.random() * 4);
    }
    var newBubble = new Bubble(bubbleDOM, row, col, type);

    return newBubble;
};

exports.create = create;
var deepCopy = function deepCopy(copiedBubble) {
    var newBubbleDom = document.createElement("div");
    newBubbleDom.style.left = copiedBubble.dom.style.left;
    newBubbleDom.style.top = copiedBubble.dom.style.top;
    newBubbleDom.style.width = copiedBubble.dom.style.width;
    newBubbleDom.style.height = copiedBubble.dom.style.height;

    return new Bubble(newBubbleDom, -1, -1, copiedBubble.type);
};
exports.deepCopy = deepCopy;

},{"./ui.js":7}],5:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.findIntersection = findIntersection;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _ModelBoardJs = require("./Model/Board.js");

var Board = _interopRequireWildcard(_ModelBoardJs);

var _uiJs = require("./ui.js");

var UI = _interopRequireWildcard(_uiJs);

var boardArray = Board.getBoardArray();

function findIntersection(angle, currBubble) {
    var startCenterPos = {
        left: currBubble.dom.getBoundingClientRect().left + UI.spriteRadius,
        top: currBubble.dom.getBoundingClientRect().top + UI.spriteRadius
    };

    // an object that holds some data on a collision if exists
    var collision = null;

    var dx = Math.sin(angle);
    var dy = -Math.cos(angle);

    for (var i = 0; i < Board.NUM_ROW; i++) {

        for (var j = 0; j < Board.NUM_COL; j++) {
            var bubble = boardArray[i][j];
            if (bubble) {
                // get the coords of the current bubble
                var bubbleCoords = bubble.getCoords();
                var distToBubble = {
                    x: startCenterPos.left - bubbleCoords.left,
                    y: startCenterPos.top - bubbleCoords.top
                };

                var t = dx * distToBubble.x + dy * distToBubble.y;
                //
                var ex = -t * dx + startCenterPos.left;
                var ey = -t * dy + startCenterPos.top;

                var distEC = Math.sqrt(Math.pow(ex - bubbleCoords.left, 2) - Math.pow(ey - bubbleCoords.top, 2));

                // if the prependicular distance between the trajectory and the center of the checked out bubble is greater than 2R, then NO collision
                if (distEC < UI.bubbleRadius) {
                    var dt = Math.sqrt(Math.pow(UI.bubbleRadius, 2) - Math.pow(distEC, 2));
                    var offset1 = {
                        x: (t - dt) * dx,
                        y: -(t - dt) * dy
                    };

                    var offset2 = {
                        x: (t + dt) * dx,
                        y: -(t + dt) * dy
                    };

                    var distToFirstPoint = Math.sqrt(Math.pow(offset1.x, 2) + Math.pow(offset1.y, 2));

                    var distToSecondPoint = Math.sqrt(Math.pow(offset2.x, 2) + Math.pow(offset2.y, 2));

                    // holds the new distance from the starting point of firing a ball to the collison point t
                    var newDistance = undefined;
                    // holds the collision point coordinates
                    var collisionCoords = undefined;
                    if (distToFirstPoint < distToSecondPoint) {
                        newDistance = distToFirstPoint;
                        collisionCoords = {
                            x: startCenterPos.left + offset1.x,
                            //                            y: startCenterPos.top + offset1.y
                            y: bubble.row + 1

                        };
                    } else {
                        newDistance = distToSecondPoint;
                        collisionCoords = {
                            x: startCenterPos.left - offset2.x,
                            //                            y: startCenterPos.top + offset2.y
                            y: bubble.row + 1
                        };
                    }

                    // if a collision was detected and was distance was smaller than the smallest collision distane till now
                    if (!collision || newDistance < collision.distanceToCollision) {
                        collision = {
                            distanceToCollision: newDistance,
                            bubble: bubble,
                            coords: collisionCoords
                        };
                    }
                }
            }
        }
    }
    return collision;
}

},{"./Model/Board.js":1,"./ui.js":7}],6:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _uiJs = require("./ui.js");

var UI = _interopRequireWildcard(_uiJs);

var _bubbleJs = require("./bubble.js");

var Bubble = _interopRequireWildcard(_bubbleJs);

var _ModelBoardJs = require("./Model/Board.js");

var Board = _interopRequireWildcard(_ModelBoardJs);

var _collisionDetectorJs = require("./collisionDetector.js");

var Collision = _interopRequireWildcard(_collisionDetectorJs);

var _ModelMiscJs = require("./Model/Misc.js");

var State = _interopRequireWildcard(_ModelMiscJs);

var board = undefined;

function init() {
    window.addEventListener("load", function () {
        UI.newGameButton.addEventListener("click", startGame);
        window.addEventListener("resize", UI.resize);
        document.body.addEventListener("orientationchange", UI.resize);
    });
}

function startGame() {
    Board.init(5, 30);
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

    var coordinates = {};
    if (event.type == "touchstart") {
        coordinates.x = event.changedTouches[0].pageX;
        coordinates.y = event.changedTouches[0].pageY;
    } else {
        // handling mouse
        coordinates.x = event.pageX;
        coordinates.y = event.pageY;
    }
    // get the firing angle
    var angle = getAngleFromDevice(coordinates);

    // default distance and duration
    var animationDuration = 750; // 0.75 sec
    var distance = 1000;

    var collisionHappened = Collision.findIntersection(angle, UI.currentBubble);

    var animationCallback = undefined;
    var newBubble = Bubble.deepCopy(UI.currentBubble);
    UI.board.appendChild(newBubble.dom);
    // randomly change the type to get a new bubble with a new color
    UI.currentBubble.changeType();

    // if collision occurs change distance and duration.
    if (collisionHappened) {
        (function () {
            animationDuration = animationDuration * collisionHappened.distanceToCollision / distance;
            distance = collisionHappened.distanceToCollision;
            // update the board state with the position of the new bubble. also update the col and row of the bubble object itself
            Board.addBubble(newBubble, collisionHappened.coords);

            // check for groups with the same color like our new bubble
            var group = Board.getGroup(newBubble, {});

            animationCallback = function () {
                // re-render all the dom tree when the animation finish to put the new bubble in the appropriate position
                UI.drawBoard();
                if (group.list.length >= 3) {
                    popBubbles(group.list);
                    // update score
                    State.updateScore(group.list.length * 10);
                    //                UI.drawBoard();
                }
            };
        })();
    } // end if

    else {
            animationCallback = function () {
                newBubble.dom.remove();
            };
        } // end else

    // fire up the animation
    UI.startBallAnimation(newBubble, angle, animationDuration, distance, animationCallback);

    event.preventDefault();
}

function popBubbles(bubbles) {
    bubbles.forEach(function (bubble) {
        return Board.deleteBubble(bubble);
    });
    // get the orphans
    var orphans = Board.findOrphans();
    // update score from the orphans
    State.updateScore(orphans.length * 20);

    bubbles.forEach(function (bubble, index) {
        var bubbleDom = document.getElementById(bubble.row + "" + bubble.col);
        // if it was the last ball animated then we want to drop bubbles if existed
        if (orphans.length > 0 && index == bubbles.length - 1) UI.animateVanish(bubbleDom, bubble, UI.dropBubbles(orphans));else UI.animateVanish(bubbleDom, bubble);
    });
}

function getAngleFromDevice(deviceXY) {
    //    alert("in the get Angle");
    var BubbleXY = {
        x: UI.currentBubble.dom.getBoundingClientRect().left + UI.currentBubble.dom.getBoundingClientRect().width / 2,
        y: UI.currentBubble.dom.getBoundingClientRect().top + UI.currentBubble.dom.getBoundingClientRect().height / 2
    };

    var fireAngle = Math.atan((deviceXY.x - BubbleXY.x) / (BubbleXY.y - deviceXY.y));

    //    let fireAngle = Math.atan2((deviceXY.x - BubbleXY.x) , (BubbleXY.y - deviceXY.y));

    //if the player fired the ball at aproximatly horizontal level
    //    if(deviceXY.y > BubbleXY.y) {
    //        fireAngle = fireAngle + Math.PI;
    //    }

    return fireAngle;
}

},{"./Model/Board.js":1,"./Model/Misc.js":2,"./bubble.js":4,"./collisionDetector.js":5,"./ui.js":7}],7:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;
exports.hideDialog = hideDialog;
exports.startBallAnimation = startBallAnimation;
exports.prepareNextBubble = prepareNextBubble;
exports.resize = resize;
exports.setNewBubblePosition = setNewBubblePosition;
exports.dropBubbles = dropBubbles;
exports.animateVanish = animateVanish;
exports.drawBoard = drawBoard;
exports.renderTime = renderTime;
exports.renderScore = renderScore;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _bubbleJs = require("./bubble.js");

var Bubble = _interopRequireWildcard(_bubbleJs);

var _ModelBoardJs = require("./Model/Board.js");

var Board = _interopRequireWildcard(_ModelBoardJs);

var newGameDialog = document.getElementById("start_game_dialog");
exports.newGameDialog = newGameDialog;
var currentBubble = undefined;
exports.currentBubble = currentBubble;
var gameBoard = document.getElementById("game");
exports.gameBoard = gameBoard;
var newGameButton = document.getElementById("new_game_button");
exports.newGameButton = newGameButton;
var topbar = document.getElementById("topbar");
exports.topbar = topbar;
var footer = document.getElementById("footer");

exports.footer = footer;
var board = document.getElementById("board");

exports.board = board;
var scoreDom = document.getElementById("score");
var timeDom = document.getElementById("timer");

var boardWidth = undefined;
exports.boardWidth = boardWidth;
var boardHeight = undefined;

exports.boardHeight = boardHeight;
var spriteRadius = 0;
exports.spriteRadius = spriteRadius;
var bubbleRadius = 0;
exports.bubbleRadius = bubbleRadius;
var twoSidesEmptySpace = 0;

exports.twoSidesEmptySpace = twoSidesEmptySpace;
// number of col in the board
var numOfCol = undefined;
// number of rows in the board
var numOfRow = undefined;

var boardInitiated = undefined;

function init() {
    numOfCol = Board.NUM_COL / 2;
    numOfRow = Board.NUM_ROW;
    boardInitiated = false;
}

function hideDialog() {
    newGameDialog.style.opacity = "0";
    newGameDialog.style.display = "none";
}

function startBallAnimation(firedBubble, angle, duration, distance, animationCallback) {
    //    let angle = getAngleFromDevice(deviceXY);
    //    let distance = 1000;
    // let us assume that we will fire the ball for 1000px for now
    var distanceX = Math.sin(angle) * distance;
    var distanceY = Math.cos(angle) * distance;

    var numberOfIterations = Math.ceil(duration / 16);
    var xEveryFrame = distanceX / numberOfIterations;
    var yEveryFrame = distanceY / numberOfIterations;

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
    firedBubble.dom.style.transition = "transform " + duration / 1000 + "s ease-out";
    firedBubble.dom.style.transition = "-webkit-transform " + duration / 1000 + "s ease-out";
    //    firedBubble.dom.style.transition = "-webkit-transform " + 1 + "s ease-out";
    //    firedBubble.dom.style.transition = "transform " + 1 + "s ease-out";

    //        firedBubble.dom.style.transition = "transform " + 0.5 + "s linear";
    setTimeout(function () {
        firedBubble.dom.style.webkitTransform = "translate(" + distanceX + "px," + (-distanceY + spriteRadius) + "px)";
        firedBubble.dom.style.transform = "translate(" + distanceX + "px," + (-distanceY + spriteRadius) + "px)";
    }, 20);
}

function prepareNextBubble() {
    if (currentBubble) {}
    exports.currentBubble = currentBubble = Bubble.create(-1, -1);

    // make the new bubble the current bubble, then add it to the dom
    currentBubble.dom.classList.add("curr_bubble");

    //    board.appendChild(currentBubble.dom);  
}

function resize() {

    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;

    var scaleToFitX = gameWidth / 720; // the game will be playable in portrait mode, so 720 for horizontal and 1280 for vertical
    var scaleToFitY = gameHeight / 1280;
    var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
    //    var optimalRatio = Math.max(scaleToFitX, scaleToFitY);

    exports.boardWidth = boardWidth = 720 * optimalRatio;
    exports.boardHeight = boardHeight = 1280 * optimalRatio - (topbar.getBoundingClientRect().height + footer.getBoundingClientRect().height);
    exports.bubbleRadius = bubbleRadius = boardWidth / (numOfCol + 1) / 2;
    exports.spriteRadius = spriteRadius = bubbleRadius / 0.88;

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

function setNewBubblePosition() {
    var width = spriteRadius * 2 + "px";
    var left = boardWidth / 2 - spriteRadius + "px";
    var top = boardHeight - spriteRadius * 3 + "px";
    currentBubble.dom.setAttribute("id", "current");
    currentBubble.dom.style.left = left;
    currentBubble.dom.style.top = top;
    currentBubble.dom.style.width = width;
    currentBubble.dom.style.height = width;
    //    currentBubble.dom.classList.add("curr_bubble");
}

function dropBubbles(orphanBubbles) {
    var partialApplication = function partialApplication() {
        var _loop = function (i) {
            var bubble = orphanBubbles[i];
            var bubbleDom = document.getElementById(bubble.row + "" + bubble.col);
            bubbleDom.addEventListener("transitionend", function () {
                Board.deleteBubble(bubble);
                bubbleDom.removeEventListener("transitionend");
                bubbleDom.remove();
            }, false);

            //            bubbleDom.style.transition = "transform " + 1.2 + "s cubic-bezier(0.59,-0.05, 0.74, 0.05)";
            bubbleDom.style.transition = "-webkit-transform " + 0.8 + "s cubic-bezier(0.59,-0.05, 0.74, 0.05)";

            bubbleDom.style.webkitTransform = "translate(" + 0 + "px," + 1500 + "px)";
            bubbleDom.style.transform = "translate(" + 0 + "px," + 1500 + "px)";
        };

        for (var i = 0; i < orphanBubbles.length; i++) {
            _loop(i);
        }
    };

    return partialApplication;
}

function animateVanish(bubbleDom, bubble, animateCallback) {
    var numOfIteration = 15;
    var counter = numOfIteration;

    var animateBubble = function animateBubble() {
        if (counter == numOfIteration) {
            bubbleDom.style.backgroundPosition = "33.33333333% " + bubble.getHeightPosFromType() + "%";
        } else if (counter == Math.floor(numOfIteration * 2 / 3)) {
            bubbleDom.style.backgroundPosition = "66.66666667%" + bubble.getHeightPosFromType() + "%";
        } else if (counter == Math.floor(numOfIteration * 1 / 3)) {
            bubbleDom.style.backgroundPosition = "100%" + bubble.getHeightPosFromType() + "%";
        }
        if (counter == 0) {
            bubbleDom.remove();
            cancelAnimationFrame(loopID);
            if (animateCallback) {
                // if it was the last bubble to be animated then we want to animate orphans if the exist
                animateCallback();
            }
        } else {
            counter--;
            loopID = requestAnimationFrame(animateBubble);
        }
    };

    var loopID = requestAnimationFrame(animateBubble);
}

function drawBoard() {
    var boardArray = Board.getBoardArray();
    //    let fragment = document.createDocumentFragment();
    var width = spriteRadius * 2;
    var htmlString = "";

    if (currentBubble) {
        var left = boardWidth / 2 - spriteRadius + "px";
        var _top = boardHeight - spriteRadius * 3 + "px";
        htmlString += "<div id='current' class='bubble bubble" + currentBubble.type + "' style=' width: " + width + "px; height: " + width + "px;" + "left: " + (boardWidth / 2 - spriteRadius) + "px;" + " top: " + (boardHeight - spriteRadius * 3) + "px;' > </div>";

        //        currentBubble.dom.style.left = ( (newBoardWidth / 2) - (bubbleWidth /2) ) + "px";
    }

    for (var i = 0; i < Board.NUM_ROW; i++) {
        for (var j = 0; j < numOfCol * 2; j++) {
            var bubble = boardArray[i][j];
            // there exist a bubble on that index (even rows have bubble on the odd column indicies)
            if (bubble) {
                var left = j * bubbleRadius;
                var _top2 = i * bubbleRadius * 2 - spriteRadius * 0.15 * i;

                // update the coords in the bubble object (these coords are coords of the center of the bubble)
                bubble.setCoords(left + board.getBoundingClientRect().left + bubbleRadius, _top2 + board.getBoundingClientRect().top + bubbleRadius);

                htmlString += "<div id='" + i + "" + j + "' class='bubble bubble" + bubble.type + "' style='left: " + left + "px; top: " + _top2 + "px; width: " + width + "px;height: " + width + "px;' ></div>";
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

function renderTime(timerState) {
    timeDom.textContent = "Remaining time " + timerState.min + ":" + timerState.sec;
}

function renderScore(scoreState) {
    scoreDom.textContent = "Score: " + scoreState;
}

},{"./Model/Board.js":1,"./bubble.js":4}]},{},[3])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvTW9kZWwvQm9hcmQuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvTW9kZWwvTWlzYy5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9hcHAuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvYnViYmxlLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2NvbGxpc2lvbkRldGVjdG9yLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2dhbWUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvdWkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O3dCQ0F3QixnQkFBZ0I7O0lBQTVCLE1BQU07O29CQUNFLFlBQVk7O0lBQXBCLEVBQUU7O0FBRVAsSUFBSSxPQUFPLFlBQUEsQ0FBRTs7QUFDYixJQUFJLE9BQU8sWUFBQSxDQUFDOzs7QUFFbkIsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVwQixJQUFJLG9CQUFvQixHQUFHLENBQUMsQ0FBQzs7QUFFdEIsU0FBUyxJQUFJLENBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUNwQyxZQVJPLE9BQU8sR0FRZCxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ2xCLFlBUk8sT0FBTyxHQVFkLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDbEIsd0JBQW9CLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFekMsb0JBQWdCLEVBQUUsQ0FBQztDQUN0Qjs7QUFFRCxJQUFJLEtBQUssR0FBRyxTQUFSLEtBQUssR0FBZTtBQUNw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QVksR0FBRyxDQUFDLEdBQUksWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLEFBQUMsQUFBQyxDQUFDOzs7QUFHN0Qsc0JBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFJLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLElBQUksR0FBRyxZQUFZLEVBQUUsS0FBRyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQzs7QUFFcEksMEJBQVUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsd0JBQXdCLEdBQUcsTUFBTSxDQUFDLElBQUksR0FBRyxpQkFBaUIsR0FBRyxJQUFJLEdBQUcsV0FBVyxHQUFHLEtBQUcsR0FDMUgsYUFBYSxHQUFHLEtBQUssR0FBRyxhQUFhLEdBQUcsS0FBSyxHQUFHLGNBQWMsQ0FBQzthQUN0RTtTQUNKO0tBQ0o7O0FBRUQsU0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsaUJBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7O0NBSTVEOzs7Ozs7OztBQVFNLFNBQVMsVUFBVSxDQUFDLFVBQVUsRUFBRTtBQUNuQyxXQUFPLENBQUMsV0FBVyxHQUFHLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUM7Q0FDbkY7O0FBRU0sU0FBUyxXQUFXLENBQUMsVUFBVSxFQUFFO0FBQ3BDLFlBQVEsQ0FBQyxXQUFXLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQztDQUNqRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBCdWJibGUgZnJvbSBcIi4vLi4vYnViYmxlLmpzXCI7XG5pbXBvcnQgKiBhcyBVSSBmcm9tIFwiLi8uLi91aS5qc1wiO1xuXG5leHBvcnQgbGV0IE5VTV9ST1cgO1xuZXhwb3J0IGxldCBOVU1fQ09MO1xuXG5sZXQgYm9hcmRBcnJheSA9IFtdO1xuXG5sZXQgdG90YWxOdW1iZXJPZkJ1YmJsZXMgPSAwO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCAobnVtUm93cywgbnVtQ29scykge1xuICAgIE5VTV9ST1cgPSBudW1Sb3dzO1xuICAgIE5VTV9DT0wgPSBudW1Db2xzO1xuICAgIHRvdGFsTnVtYmVyT2ZCdWJibGVzID0gTlVNX1JPVyAqIE5VTV9DT0w7XG4gICAgXG4gICAgY3JlYXRlQm9hcmRBcnJheSgpOyAgICBcbn1cblxubGV0IEJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBidWJibGVBcnJheSA9IGNyZWF0ZUJ1YmJsZUFycmF5KCk7XG4gICAgXG59XG5cbmV4cG9ydCBsZXQgYWRkQnViYmxlID0gZnVuY3Rpb24gKGJ1YmJsZSwgY29vcmRzKSB7XG4vLyAgICBsZXQgcm93TnVtID0gTWF0aC5mbG9vcihjb29yZHMueSAvIChVSS5idWJibGVSYWRpdXMgKiAyKSk7XG4gICAgbGV0IHJvd051bSA9IGNvb3Jkcy55O1xuICAgIGNvb3Jkcy54ID0gY29vcmRzLnggLSBVSS5ib2FyZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgIGlmKHJvd051bSAlIDIgPT0gMCkge1xuLy8gICAgICAgIGNvb3Jkcy54ID0gY29vcmRzLnggLSBVSS5zcHJpdGVSYWRpdXMgLzJcbiAgICB9XG4gICAgXG4gICAgbGV0IGNvbE51bTtcbi8vICAgIGxldCBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvb3Jkcy54IC8gKFVJLmJ1YmJsZVJhZGl1cyAqIDIpKTsgXG4vLyAgICBjb2xOdW0gLT0gMTtcbi8vICAgIGNvbE51bSA9IE1hdGgucm91bmQoY29sTnVtIC8gMikgKiAyO1xuICAgIFxuICAgIGlmIChyb3dOdW0gJSAyID09PSAwKSB7XG4gICAgIGNvbE51bSA9IE1hdGgucm91bmQoY29vcmRzLnggLyAoVUkuYnViYmxlUmFkaXVzICogMikpOyBcblxuICAgICAgICBjb2xOdW0gPSAoY29sTnVtICogMikgLSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29sTnVtID0gTWF0aC5mbG9vcihjb29yZHMueCAvIChVSS5idWJibGVSYWRpdXMgKiAyKSk7IFxuXG4gICAgICAgIGNvbE51bSA9IChjb2xOdW0gKiAyKSAgO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIWJvYXJkQXJyYXlbcm93TnVtXSkge1xuICAgICAgICBib2FyZEFycmF5W3Jvd051bV0gPSBbXTtcbiAgICAgICAgTlVNX1JPVyArKztcbiAgICB9XG4vLyAgICBlbHNlIGlmIChib2FyZEFycmF5W3Jvd051bV1bY29sTnVtXSAhPSBmYWxzZSkge1xuLy8gICAgICAgIGJcbi8vICAgIH1cbiAgICBidWJibGUuc2V0Q29sKGNvbE51bSk7XG4gICAgYnViYmxlLnNldFJvdyhyb3dOdW0pO1xuICAgIGJvYXJkQXJyYXlbcm93TnVtXVtjb2xOdW1dID0gYnViYmxlO1xufVxuXG5cblxuZXhwb3J0IGxldCBnZXRCb2FyZEFycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGJvYXJkQXJyYXk7XG59IFxuXG5cblxuLy8gcmV0dXJuIHRoZSBidWJibGUgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24gb3IgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0XG5mdW5jdGlvbiBnZXRCdWJibGVBdChyb3csIGNvbCkge1xuICAgIGlmICghYm9hcmRBcnJheVtyb3ddKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gYm9hcmRBcnJheVtyb3ddW2NvbF07XG59XG5cbi8vIGdldCB0aGUgYnViYmxlcyB0aGF0IHN1cnJvdW5kIGEgYnViYmxlXG5mdW5jdGlvbiBnZXRCdWJibGVBcm91bmQocm93LCBjb2wpIHtcbiAgICB2YXIgYnViYmxlTGlzdCA9IFtdO1xuICAgIGZvcihsZXQgaSA9IHJvdyAtMTsgaSA8PSByb3cgKyAxOyBpKyspIHtcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGJ1YmJsZXMgaW4gdGhhdCByb3dcbiAgICAgICAgZm9yKGxldCBqID0gY29sIC0gMjsgaiA8PSBjb2wgKyAyOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBnZXRCdWJibGVBdChpLCBqKTtcbiAgICAgICAgICAgIGlmIChidWJibGUpIHtcbiAgICAgICAgICAgICAgICBidWJibGVMaXN0LnB1c2goYnViYmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYnViYmxlTGlzdDtcbn1cblxuLy8gZ2V0IHRoZSBjb25uZWN0ZWQgZ3JvdXAgb2YgYnViYmxlcyAodGhhdCBzaGFyZSB0aGUgc2FtZSBjb2xvciwgb3Igbm90KSBzdGFydGluZyBmcm9tIHRoaXMgYnViYmxlXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3JvdXAgKGJ1YmJsZSwgYnViYmxlc0ZvdW5kLCBkaWZmZXJlbnRDb2xvcikge1xuICAgIGxldCBjdXJyZW50Um93ID0gYnViYmxlLnJvdztcbiAgICBpZighYnViYmxlc0ZvdW5kW2N1cnJlbnRSb3ddKSB7XG4gICAgICAgIGJ1YmJsZXNGb3VuZFtjdXJyZW50Um93XSA9IHt9O1xuICAgIH1cbiAgICBpZighYnViYmxlc0ZvdW5kLmxpc3QpIHtcbiAgICAgICAgYnViYmxlc0ZvdW5kLmxpc3QgPSBbXTtcbiAgICB9XG4gICAgaWYoYnViYmxlc0ZvdW5kW2J1YmJsZS5yb3ddW2J1YmJsZS5jb2xdKSB7XG4gICAgICAgIC8vIHdlIGVuZCB0aGlzIGJyYW5jaCBvZiByZWN1cnNpb24gaGVyZSBiZWNhdXNlIHdlJ3ZlIGJlZW4gdG8gdGhpcyBidWJibGUgYmVmb3JlXG4gICAgICAgIHJldHVybiBidWJibGVzRm91bmQ7XG4gICAgfVxuICAgIFxuICAgIC8vIGFkZCB0aGUgYnViYmxlIHRvIHRoZSAyRCBhcnJheVxuICAgIGJ1YmJsZXNGb3VuZFtidWJibGUucm93XVtidWJibGUuY29sXSA9IGJ1YmJsZTtcbiAgICAvLyBwdXNoIHRoZSBidWJibGUgdG8gdGhlIGxpbmVhciBsaXN0XG4gICAgYnViYmxlc0ZvdW5kLmxpc3QucHVzaChidWJibGUpO1xuICAgIC8vIGdldCBhIGxpc3Qgb2YgYnViYmxlcyB0aGF0IHN1cnJvdW5kIHRoaXMgYnViYmxlIGFuZCBhcmUgb2YgdGhlIHNhbWUgY29sb3JcbiAgICBsZXQgc3Vycm91bmRpbmcgPSBnZXRCdWJibGVBcm91bmQoYnViYmxlLnJvdywgYnViYmxlLmNvbCk7XG4gICAgLy8gZm9yIGV2ZXJ5IHN1cnJvdW5kaW5nIGJ1YmJsZSByZWN1cnNpdmVseSBjYWxsIHRoaXMgZnVuY3Rpb24gYWdhaW5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgc3Vycm91bmRpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYoc3Vycm91bmRpbmdbaV0udHlwZSA9PT0gYnViYmxlLnR5cGUgfHwgZGlmZmVyZW50Q29sb3IpIHtcbiAgICAgICAgICAgIGJ1YmJsZXNGb3VuZCA9IGdldEdyb3VwKHN1cnJvdW5kaW5nW2ldLCBidWJibGVzRm91bmQsIGRpZmZlcmVudENvbG9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gYnViYmxlc0ZvdW5kO1xufVxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRPcnBoYW5zICgpIHtcbiAgICBsZXQgY29ubmVjdGVkID0gW107XG4gICAgbGV0IGdyb3VwcyA9IFtdO1xuICAgIGxldCBvcnBoYW5zID0gW107XG4gICAgLy8gaW5pdGlhbGl6ZSB0aGUgcm93cyBvZiB0aGUgY29ubmVjdGVkXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGJvYXJkQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29ubmVjdGVkW2ldID0gW107XG4gICAgfVxuICAgIC8vIGxvb3Agb24gdGhlIGZpcnN0IHJvdywgYmVjYXVzZSBpdCBzaG91bGQgYmUgdGhlIHJvb3Qgb2YgZXZlcnkgY29ubmVjdGVkIGdyb3VwXG4gICAgLy8gaW5pdGlhbGx5IGV2ZXJ5dGhpbmcgaXMgTk9UIGNvbm5lY3RlZFxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBib2FyZEFycmF5WzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5WzBdW2ldO1xuICAgICAgICBpZihidWJibGUgJiYgIWNvbm5lY3RlZFswXVtpXSkge1xuICAgICAgICAgICAgLy8gaGVyZSB3ZSBwYXNzIHRydWUsIGJlY2F1c2Ugd2Ugd2FudCB0byBtYXRjaCBmb3IgYW55IGNvbG9yXG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBnZXRHcm91cChidWJibGUsIHt9LCB0cnVlKTtcbiAgICAgICAgICAgIGdyb3VwLmxpc3QuZm9yRWFjaChpdGVtID0+IGNvbm5lY3RlZFtpdGVtLnJvd11baXRlbS5jb2xdID0gdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgYm9hcmQgdG8gZGV0ZWN0IG9ycGhhbiBidWJibGVzIGFmdGVyIHdlIGRlY2lkZWQgY29ubmVjdGVkIGJ1YmJsZXMgd2l0aCB0aGUgZmlyc3Qgcm93XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGJvYXJkQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHN0YXJ0Q29sID0gaSUyID09IDAgPyAxIDogMDtcbiAgICAgICAgZm9yKGxldCBqID0gc3RhcnRDb2w7IGogPCBOVU1fQ09MOyBqICs9IDIpIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBnZXRCdWJibGVBdChpLCBqKTtcbiAgICAgICAgICAgIGlmKGJ1YmJsZSAmJiAhY29ubmVjdGVkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgb3JwaGFucy5wdXNoKGJ1YmJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG9ycGhhbnM7XG59XG4gICAgXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQnViYmxlKGJ1YmJsZSkge1xuICAgIGRlbGV0ZSBib2FyZEFycmF5W2J1YmJsZS5yb3ddW2J1YmJsZS5jb2xdO1xufVxuXG5cbmxldCBjcmVhdGVCb2FyZEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBOVU1fUk9XOyBpKyspIHtcbiAgICAgICAgbGV0IHN0YXJ0Q29sID0gaSUyID09IDAgPyAxIDogMDtcbiAgICAgICAgYm9hcmRBcnJheVtpXSA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29sIDsgaiA8IE5VTV9DT0w7IGorPSAyKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gQnViYmxlLmNyZWF0ZShpLCBqKTtcbiAgICAgICAgICAgIGJvYXJkQXJyYXlbaV1bal0gPSBidWJibGU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vLi4vdWkuanNcIjtcblxubGV0IHNjb3JlID0gMDtcbmxldCB0aW1lciA9IHtcbiAgICBtaW46IDIsXG4gICAgc2VjOiAwXG59O1xuXG5sZXQgdGltZXJJRCA7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICB0aW1lcklEID0gc2V0SW50ZXJ2YWwodXBkYXRlVGltZXIsIDEwMDApO1xufVxuXG4vLyBsZXQgdGltZXJJRCA9IHNldEludGVydmFsKHVwZGF0ZVRpbWVyLCAxMDAwKTtcblxuZnVuY3Rpb24gdXBkYXRlVGltZXIoKSB7XG4vLyAgICBVSS5yZW5kZXJTY29yZShzY29yZSk7XG4gICAgVUkucmVuZGVyVGltZSh0aW1lcik7XG4gICAgXG4gICAgdGltZXIuc2VjIC0tO1xuICAgIFxuICAgIGlmKHRpbWVyLnNlYyA9PSAtMSkge1xuICAgICAgICBpZih0aW1lci5taW4gPT0gMCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcklEKTtcbiAgICAgICAgICAgIC8vIHJlbmRlciBnYW1lIG92ZXJcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRpbWVyLnNlYyA9IDU5O1xuICAgICAgICAgICAgdGltZXIubWluID0gdGltZXIubWluIC0gMTsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyByZW5kZXIgdGhlIHRpbWVyIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlU2NvcmUoYWRkZWRWYWx1ZSkge1xuICAgIHNjb3JlID0gc2NvcmUgKyBhZGRlZFZhbHVlO1xuICAgIGlmKGFkZGVkVmFsdWUgPiAwKVxuICAgICAgICBVSS5yZW5kZXJTY29yZShzY29yZSk7XG59IiwiaW1wb3J0ICogYXMgZ2FtZSBmcm9tIFwiLi9nYW1lLmpzXCI7XG5cbmdhbWUuaW5pdCgpOyIsImltcG9ydCAqIGFzIFVJIGZyb20gXCIuL3VpLmpzXCI7XG5cbmZ1bmN0aW9uIEJ1YmJsZSAoZG9tRWxlbWVudCwgcm93LCBjb2wsIHR5cGUpIHtcbiAgICBkb21FbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJidWJibGVcIik7XG4gICAgZG9tRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIgKyB0eXBlKTtcbiAgICB0aGlzLmRvbSA9IGRvbUVsZW1lbnQ7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xufVxuXG5CdWJibGUucHJvdG90eXBlLnNldERPTSA9IGZ1bmN0aW9uIChuZXdEb20pIHtcbiAgICB0aGlzLmRvbSA9IG5ld0RvbTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRDb29yZHMgPSBmdW5jdGlvbiAobGVmdCwgdG9wKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRDb2wgPSBmdW5jdGlvbihjb2wpIHtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRSb3cgPSBmdW5jdGlvbiAocm93KSB7XG4gICAgdGhpcy5yb3cgPSByb3c7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuZ2V0Q29vcmRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IHRoaXMubGVmdCxcbiAgICAgICAgdG9wOiB0aGlzLnRvcFxuICAgIH07XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuY2hhbmdlVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdGhpcy5kb20uY2xhc3NMaXN0LnJlbW92ZShcImJ1YmJsZVwiICsgdGhpcy50eXBlKTtcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHR5cGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICB9XG4gICAgdGhpcy5zZXRUeXBlKHR5cGUpO1xuICAgIHRoaXMuZG9tLmNsYXNzTGlzdC5hZGQoXCJidWJibGVcIiArIHR5cGUpO1xufVxuXG5CdWJibGUucHJvdG90eXBlLmdldEhlaWdodFBvc0Zyb21UeXBlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnR5cGUgPT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKHRoaXMudHlwZSA9PSAxKSB7XG4gICAgICAgIHJldHVybiAzMy4zMzMzMzMzMztcbiAgICB9XG4gICAgaWYgKHRoaXMudHlwZSA9PSAyKSB7XG4gICAgICAgIHJldHVybiA2Ni42NjY2NjY2NztcbiAgICB9XG4gICAgaWYgKHRoaXMudHlwZSA9PSAzKSB7XG4gICAgICAgIHJldHVybiAxMDA7XG4gICAgfVxufVxuXG5leHBvcnQgbGV0IGNyZWF0ZSA9IGZ1bmN0aW9uIChyb3csIGNvbCwgdHlwZSkge1xuICAgIGxldCBidWJibGVET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIFxuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdHlwZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpO1xuICAgIH1cbiAgICBsZXQgbmV3QnViYmxlID0gbmV3IEJ1YmJsZShidWJibGVET00sIHJvdywgY29sLCB0eXBlKTtcbiAgICBcbiAgICByZXR1cm4gbmV3QnViYmxlO1xuICAgIFxufVxuXG5leHBvcnQgbGV0IGRlZXBDb3B5ID0gZnVuY3Rpb24gKGNvcGllZEJ1YmJsZSkge1xuICAgIGxldCBuZXdCdWJibGVEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS5sZWZ0ID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS5sZWZ0O1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS50b3AgPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLnRvcDtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUud2lkdGggPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLndpZHRoO1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS5oZWlnaHQgPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLmhlaWdodDtcbiAgICBcbiAgICByZXR1cm4gbmV3IEJ1YmJsZSAobmV3QnViYmxlRG9tLCAtMSwgLTEsIGNvcGllZEJ1YmJsZS50eXBlKTtcbn0iLCJpbXBvcnQgKiBhcyBCb2FyZCBmcm9tIFwiLi9Nb2RlbC9Cb2FyZC5qc1wiO1xuaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vdWkuanNcIjtcblxubGV0IGJvYXJkQXJyYXkgPSBCb2FyZC5nZXRCb2FyZEFycmF5KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9uKGFuZ2xlLCBjdXJyQnViYmxlKSB7XG4gICAgbGV0IHN0YXJ0Q2VudGVyUG9zID0ge1xuICAgICAgICBsZWZ0OiBjdXJyQnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgVUkuc3ByaXRlUmFkaXVzLFxuICAgICAgICB0b3A6IGN1cnJCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIFVJLnNwcml0ZVJhZGl1c1xuICAgIH1cbiAgICBcbiAgICAvLyBhbiBvYmplY3QgdGhhdCBob2xkcyBzb21lIGRhdGEgb24gYSBjb2xsaXNpb24gaWYgZXhpc3RzXG4gICAgbGV0IGNvbGxpc2lvbiA9IG51bGw7XG4gICAgXG4gICAgbGV0IGR4ID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgIGxldCBkeSA9IC1NYXRoLmNvcyhhbmdsZSk7XG4gICAgXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IEJvYXJkLk5VTV9ST1c7IGkrKykge1xuICAgICAgICBcbiAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IEJvYXJkLk5VTV9DT0wgOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5W2ldW2pdO1xuICAgICAgICAgICAgaWYoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjb29yZHMgb2YgdGhlIGN1cnJlbnQgYnViYmxlXG4gICAgICAgICAgICAgICAgbGV0IGJ1YmJsZUNvb3JkcyA9IGJ1YmJsZS5nZXRDb29yZHMoKTtcbiAgICAgICAgICAgICAgICBsZXQgZGlzdFRvQnViYmxlID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiBzdGFydENlbnRlclBvcy5sZWZ0IC0gYnViYmxlQ29vcmRzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCAtIGJ1YmJsZUNvb3Jkcy50b3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IHQgPSBkeCAqIGRpc3RUb0J1YmJsZS54ICsgZHkgKiBkaXN0VG9CdWJibGUueTtcbiAgICAgICAgICAgICAgICAvLyBcbiAgICAgICAgICAgICAgICBsZXQgZXggPSAtdCAqIGR4ICsgc3RhcnRDZW50ZXJQb3MubGVmdDtcbiAgICAgICAgICAgICAgICBsZXQgZXkgPSAtdCAqIGR5ICsgc3RhcnRDZW50ZXJQb3MudG9wO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBkaXN0RUMgPSBNYXRoLnNxcnQoTWF0aC5wb3coKGV4IC0gYnViYmxlQ29vcmRzLmxlZnQpLCAyKSAtIE1hdGgucG93KChleSAtIGJ1YmJsZUNvb3Jkcy50b3ApLCAyKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZXBlbmRpY3VsYXIgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHJhamVjdG9yeSBhbmQgdGhlIGNlbnRlciBvZiB0aGUgY2hlY2tlZCBvdXQgYnViYmxlIGlzIGdyZWF0ZXIgdGhhbiAyUiwgdGhlbiBOTyBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICBpZiAoZGlzdEVDIDwgVUkuYnViYmxlUmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkdCA9IE1hdGguc3FydChNYXRoLnBvdyhVSS5idWJibGVSYWRpdXMsIDIpIC0gTWF0aC5wb3coZGlzdEVDLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQxID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogKHQgLSBkdCkgKiBkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IC0odCAtIGR0KSAqIGR5XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldDIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiAodCArIGR0KSAqIGR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogLSh0ICsgZHQpICogZHlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0VG9GaXJzdFBvaW50ID0gTWF0aC5zcXJ0KE1hdGgucG93KG9mZnNldDEueCwgMikgKyBNYXRoLnBvdyhvZmZzZXQxLnksIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0VG9TZWNvbmRQb2ludCA9IE1hdGguc3FydChNYXRoLnBvdyhvZmZzZXQyLnggLDIpICsgTWF0aC5wb3cob2Zmc2V0Mi55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBob2xkcyB0aGUgbmV3IGRpc3RhbmNlIGZyb20gdGhlIHN0YXJ0aW5nIHBvaW50IG9mIGZpcmluZyBhIGJhbGwgdG8gdGhlIGNvbGxpc29uIHBvaW50IHQgXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9sZHMgdGhlIGNvbGxpc2lvbiBwb2ludCBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sbGlzaW9uQ29vcmRzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdFRvRmlyc3RQb2ludCA8IGRpc3RUb1NlY29uZFBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEaXN0YW5jZSA9IGRpc3RUb0ZpcnN0UG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25Db29yZHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCArIG9mZnNldDEueCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCArIG9mZnNldDEueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGJ1YmJsZS5yb3cgKyAxXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Rpc3RhbmNlID0gZGlzdFRvU2Vjb25kUG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25Db29yZHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCAtIG9mZnNldDIueCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCArIG9mZnNldDIueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGJ1YmJsZS5yb3cgKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgY29sbGlzaW9uIHdhcyBkZXRlY3RlZCBhbmQgd2FzIGRpc3RhbmNlIHdhcyBzbWFsbGVyIHRoYW4gdGhlIHNtYWxsZXN0IGNvbGxpc2lvbiBkaXN0YW5lIHRpbGwgbm93XG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb2xsaXNpb24gfHwgbmV3RGlzdGFuY2UgPCBjb2xsaXNpb24uZGlzdGFuY2VUb0NvbGxpc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlVG9Db2xsaXNpb246IG5ld0Rpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZTogYnViYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29sbGlzaW9uQ29vcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICByZXR1cm4gY29sbGlzaW9uO1xuICAgIH0iLCJpbXBvcnQgKiBhcyBVSSBmcm9tIFwiLi91aS5qc1wiO1xuaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuL2J1YmJsZS5qc1wiO1xuaW1wb3J0ICogYXMgQm9hcmQgZnJvbSBcIi4vTW9kZWwvQm9hcmQuanNcIjtcbmltcG9ydCAqIGFzIENvbGxpc2lvbiBmcm9tIFwiLi9jb2xsaXNpb25EZXRlY3Rvci5qc1wiO1xuaW1wb3J0ICogYXMgU3RhdGUgZnJvbSBcIi4vTW9kZWwvTWlzYy5qc1wiO1xuXG5sZXQgYm9hcmQgO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVUkubmV3R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgVUkucmVzaXplKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgVUkucmVzaXplKTtcbiAgICB9KTtcbn1cbiAgICBcbmZ1bmN0aW9uIHN0YXJ0R2FtZSAoKSB7XG4gICAgQm9hcmQuaW5pdCg1LDMwKTtcbiAgICBVSS5pbml0KCk7XG4gICAgVUkubmV3R2FtZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgICBVSS5oaWRlRGlhbG9nKCk7XG4gICAgXG4vLyAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICBcbiAgICAvLyBzZXQgdGhlIGZpcnN0IG5leHQgYnViYmxlXG4gICAgVUkucHJlcGFyZU5leHRCdWJibGUoKTtcbiAgICBVSS5yZXNpemUoKTtcbi8vICAgIFVJLmRyYXdCb2FyZCgpO1xuICAgIFxuICAgIFxuICAgIC8vIGFkZCBldmVudCBsaXN0bmVyIGZvciBtb3VzZSBjbGlja3Mgb24gdGhlIGJvYXJkXG4gICAgVUkuZ2FtZUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xuICAgIFVJLmdhbWVCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYmFsbEZpcmVkSGFuZGxlcik7XG4gICAgXG4gICAgU3RhdGUuaW5pdCgpO1xufVxuXG5mdW5jdGlvbiBiYWxsRmlyZWRIYW5kbGVyKGV2ZW50KSB7XG4gICAgXG4gICAgbGV0IGNvb3JkaW5hdGVzID0ge307XG4gICAgaWYoZXZlbnQudHlwZSA9PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgICBjb29yZGluYXRlcy54ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgIGNvb3JkaW5hdGVzLnkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGhhbmRsaW5nIG1vdXNlXG4gICAgICAgIGNvb3JkaW5hdGVzLnggPSBldmVudC5wYWdlWDtcbiAgICAgICAgY29vcmRpbmF0ZXMueSA9IGV2ZW50LnBhZ2VZO1xuICAgIH1cbiAgICAvLyBnZXQgdGhlIGZpcmluZyBhbmdsZVxuICAgIGxldCBhbmdsZSA9IGdldEFuZ2xlRnJvbURldmljZShjb29yZGluYXRlcyk7XG4gICAgXG4gICAgLy8gZGVmYXVsdCBkaXN0YW5jZSBhbmQgZHVyYXRpb25cbiAgICBsZXQgYW5pbWF0aW9uRHVyYXRpb24gPSA3NTA7IC8vIDAuNzUgc2VjXG4gICAgbGV0IGRpc3RhbmNlID0gMTAwMDtcbiAgICBcbiAgICBsZXQgY29sbGlzaW9uSGFwcGVuZWQgPSBDb2xsaXNpb24uZmluZEludGVyc2VjdGlvbihhbmdsZSwgVUkuY3VycmVudEJ1YmJsZSk7XG4gICAgXG4gICAgbGV0IGFuaW1hdGlvbkNhbGxiYWNrO1xuICAgIGxldCBuZXdCdWJibGUgPSBCdWJibGUuZGVlcENvcHkoVUkuY3VycmVudEJ1YmJsZSk7XG4gICAgVUkuYm9hcmQuYXBwZW5kQ2hpbGQobmV3QnViYmxlLmRvbSk7XG4gICAgLy8gcmFuZG9tbHkgY2hhbmdlIHRoZSB0eXBlIHRvIGdldCBhIG5ldyBidWJibGUgd2l0aCBhIG5ldyBjb2xvclxuICAgIFVJLmN1cnJlbnRCdWJibGUuY2hhbmdlVHlwZSgpO1xuICAgIFxuICAgIC8vIGlmIGNvbGxpc2lvbiBvY2N1cnMgY2hhbmdlIGRpc3RhbmNlIGFuZCBkdXJhdGlvbi5cbiAgICBpZiAoY29sbGlzaW9uSGFwcGVuZWQpIHtcbiAgICAgICAgYW5pbWF0aW9uRHVyYXRpb24gPSBhbmltYXRpb25EdXJhdGlvbiAqIGNvbGxpc2lvbkhhcHBlbmVkLmRpc3RhbmNlVG9Db2xsaXNpb24gLyBkaXN0YW5jZTtcbiAgICAgICAgZGlzdGFuY2UgPSBjb2xsaXNpb25IYXBwZW5lZC5kaXN0YW5jZVRvQ29sbGlzaW9uO1xuICAgICAgICAvLyB1cGRhdGUgdGhlIGJvYXJkIHN0YXRlIHdpdGggdGhlIHBvc2l0aW9uIG9mIHRoZSBuZXcgYnViYmxlLiBhbHNvIHVwZGF0ZSB0aGUgY29sIGFuZCByb3cgb2YgdGhlIGJ1YmJsZSBvYmplY3QgaXRzZWxmXG4gICAgICAgIEJvYXJkLmFkZEJ1YmJsZShuZXdCdWJibGUsIGNvbGxpc2lvbkhhcHBlbmVkLmNvb3Jkcyk7XG4gICAgICAgIFxuICAgICAgICAvLyBjaGVjayBmb3IgZ3JvdXBzIHdpdGggdGhlIHNhbWUgY29sb3IgbGlrZSBvdXIgbmV3IGJ1YmJsZVxuICAgICAgICBsZXQgZ3JvdXAgPSBCb2FyZC5nZXRHcm91cChuZXdCdWJibGUsIHt9KTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBhbmltYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHJlLXJlbmRlciBhbGwgdGhlIGRvbSB0cmVlIHdoZW4gdGhlIGFuaW1hdGlvbiBmaW5pc2ggdG8gcHV0IHRoZSBuZXcgYnViYmxlIGluIHRoZSBhcHByb3ByaWF0ZSBwb3NpdGlvblxuICAgICAgICAgICAgVUkuZHJhd0JvYXJkKCk7XG4gICAgICAgICAgICBpZihncm91cC5saXN0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcG9wQnViYmxlcyhncm91cC5saXN0KTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgc2NvcmVcbiAgICAgICAgICAgICAgICBTdGF0ZS51cGRhdGVTY29yZShncm91cC5saXN0Lmxlbmd0aCAqIDEwKTtcbi8vICAgICAgICAgICAgICAgIFVJLmRyYXdCb2FyZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSAvLyBlbmQgaWZcbiAgICBcbiAgICBlbHNlIHtcbiAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBuZXdCdWJibGUuZG9tLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfSAvLyBlbmQgZWxzZVxuICAgIFxuICAgIC8vIGZpcmUgdXAgdGhlIGFuaW1hdGlvblxuICAgIFVJLnN0YXJ0QmFsbEFuaW1hdGlvbihuZXdCdWJibGUsIGFuZ2xlLCBhbmltYXRpb25EdXJhdGlvbiwgZGlzdGFuY2UsIGFuaW1hdGlvbkNhbGxiYWNrKTtcbiAgICBcbiAgICBcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG59XG5cblxuZnVuY3Rpb24gcG9wQnViYmxlcyAoYnViYmxlcyl7XG4gICAgYnViYmxlcy5mb3JFYWNoKGJ1YmJsZSA9PiBCb2FyZC5kZWxldGVCdWJibGUoYnViYmxlKSk7XG4gICAgLy8gZ2V0IHRoZSBvcnBoYW5zIFxuICAgIGxldCBvcnBoYW5zID0gQm9hcmQuZmluZE9ycGhhbnMoKTtcbiAgICAvLyB1cGRhdGUgc2NvcmUgZnJvbSB0aGUgb3JwaGFuc1xuICAgIFN0YXRlLnVwZGF0ZVNjb3JlKG9ycGhhbnMubGVuZ3RoICogMjApO1xuICAgIFxuICAgIGJ1YmJsZXMuZm9yRWFjaCggKGJ1YmJsZSwgaW5kZXgpID0+IHtcbiAgICAgICAgbGV0IGJ1YmJsZURvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJ1YmJsZS5yb3cgKyBcIlwiICsgYnViYmxlLmNvbCk7XG4gICAgICAgIC8vIGlmIGl0IHdhcyB0aGUgbGFzdCBiYWxsIGFuaW1hdGVkIHRoZW4gd2Ugd2FudCB0byBkcm9wIGJ1YmJsZXMgaWYgZXhpc3RlZFxuICAgICAgICBpZigob3JwaGFucy5sZW5ndGggPiAwKSAmJiAoaW5kZXggPT0gYnViYmxlcy5sZW5ndGggLSAxKSlcbiAgICAgICAgICAgIFVJLmFuaW1hdGVWYW5pc2goYnViYmxlRG9tLCBidWJibGUsIFVJLmRyb3BCdWJibGVzKG9ycGhhbnMpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgVUkuYW5pbWF0ZVZhbmlzaChidWJibGVEb20sIGJ1YmJsZSk7XG4gICAgfSk7XG59XG5cblxuZnVuY3Rpb24gZ2V0QW5nbGVGcm9tRGV2aWNlIChkZXZpY2VYWSkge1xuLy8gICAgYWxlcnQoXCJpbiB0aGUgZ2V0IEFuZ2xlXCIpO1xuICAgIGxldCBCdWJibGVYWSA9IHtcbiAgICAgICAgeDogVUkuY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIFVJLmN1cnJlbnRCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC8yLFxuICAgICAgICB5OiBVSS5jdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBVSS5jdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLzJcbiAgICB9O1xuICAgIFxuICAgIGxldCBmaXJlQW5nbGUgPSBNYXRoLmF0YW4oKGRldmljZVhZLnggLSBCdWJibGVYWS54KSAvIChCdWJibGVYWS55IC0gZGV2aWNlWFkueSkpO1xuICAgIFxuLy8gICAgbGV0IGZpcmVBbmdsZSA9IE1hdGguYXRhbjIoKGRldmljZVhZLnggLSBCdWJibGVYWS54KSAsIChCdWJibGVYWS55IC0gZGV2aWNlWFkueSkpO1xuXG4gICAgXG4gICAgIC8vaWYgdGhlIHBsYXllciBmaXJlZCB0aGUgYmFsbCBhdCBhcHJveGltYXRseSBob3Jpem9udGFsIGxldmVsXG4vLyAgICBpZihkZXZpY2VYWS55ID4gQnViYmxlWFkueSkge1xuLy8gICAgICAgIGZpcmVBbmdsZSA9IGZpcmVBbmdsZSArIE1hdGguUEk7XG4vLyAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZpcmVBbmdsZTtcbn1cblxuIiwiaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuL2J1YmJsZS5qc1wiO1xuaW1wb3J0ICogYXMgQm9hcmQgZnJvbSBcIi4vTW9kZWwvQm9hcmQuanNcIjtcblxuZXhwb3J0IGxldCBuZXdHYW1lRGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydF9nYW1lX2RpYWxvZ1wiKTtcbmV4cG9ydCBsZXQgY3VycmVudEJ1YmJsZTtcbmV4cG9ydCBsZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lXCIpO1xuZXhwb3J0IGxldCBuZXdHYW1lQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXdfZ2FtZV9idXR0b25cIik7XG5leHBvcnQgbGV0IHRvcGJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9wYmFyXCIpO1xuZXhwb3J0IGxldCBmb290ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvb3RlclwiKTtcblxuZXhwb3J0IGxldCBib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmRcIik7XG5cbmxldCBzY29yZURvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NvcmVcIik7XG5sZXQgdGltZURvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGltZXJcIik7XG5cblxuZXhwb3J0IGxldCBib2FyZFdpZHRoO1xuZXhwb3J0IGxldCBib2FyZEhlaWdodDtcblxuZXhwb3J0IGxldCBzcHJpdGVSYWRpdXMgPSAwO1xuZXhwb3J0IGxldCBidWJibGVSYWRpdXMgPSAwO1xuZXhwb3J0IGxldCB0d29TaWRlc0VtcHR5U3BhY2UgPSAwO1xuXG4vLyBudW1iZXIgb2YgY29sIGluIHRoZSBib2FyZFxubGV0IG51bU9mQ29sO1xuLy8gbnVtYmVyIG9mIHJvd3MgaW4gdGhlIGJvYXJkXG5sZXQgbnVtT2ZSb3c7XG5cbmxldCBib2FyZEluaXRpYXRlZDtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIG51bU9mQ29sID0gQm9hcmQuTlVNX0NPTCAvIDI7ICBcbiAgICBudW1PZlJvdyA9IEJvYXJkLk5VTV9ST1c7XG4gICAgYm9hcmRJbml0aWF0ZWQgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVEaWFsb2cgKCkge1xuICAgIG5ld0dhbWVEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgIG5ld0dhbWVEaWFsb2cuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0QmFsbEFuaW1hdGlvbiAoZmlyZWRCdWJibGUsIGFuZ2xlLCBkdXJhdGlvbiwgZGlzdGFuY2UsIGFuaW1hdGlvbkNhbGxiYWNrKSB7XG4vLyAgICBsZXQgYW5nbGUgPSBnZXRBbmdsZUZyb21EZXZpY2UoZGV2aWNlWFkpO1xuLy8gICAgbGV0IGRpc3RhbmNlID0gMTAwMDtcbiAgICAvLyBsZXQgdXMgYXNzdW1lIHRoYXQgd2Ugd2lsbCBmaXJlIHRoZSBiYWxsIGZvciAxMDAwcHggZm9yIG5vd1xuICAgIGxldCBkaXN0YW5jZVggPSBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZTtcbiAgICBsZXQgZGlzdGFuY2VZID0gTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2U7XG4gICAgXG4gICAgbGV0IG51bWJlck9mSXRlcmF0aW9ucyA9IE1hdGguY2VpbChkdXJhdGlvbiAvIDE2KTsgXG4gICAgbGV0IHhFdmVyeUZyYW1lID0gZGlzdGFuY2VYIC8gbnVtYmVyT2ZJdGVyYXRpb25zO1xuICAgIGxldCB5RXZlcnlGcmFtZSA9IGRpc3RhbmNlWSAvIG51bWJlck9mSXRlcmF0aW9ucztcbiAgICBcbiAgICAgICAgXG4vLyAgICBsZXQgYW5pbWF0aW9uTG9vcCA9IGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUubGVmdCA9IChwYXJzZUZsb2F0KGZpcmVkQnViYmxlLmRvbS5zdHlsZS5sZWZ0KSArIHhFdmVyeUZyYW1lKSArIFwicHhcIjtcbi8vICAgICAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudG9wID0gKHBhcnNlRmxvYXQoZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRvcCkgLSB5RXZlcnlGcmFtZSkgKyBcInB4XCI7XG4vLyAgICAgICAgXG4vLyAgICAgICAgbnVtYmVyT2ZJdGVyYXRpb25zIC0tO1xuLy8gICAgICAgIGlmIChudW1iZXJPZkl0ZXJhdGlvbnMgPT09IDApIHtcbi8vICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUobG9vcElEKTtcbi8vICAgICAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2soKTtcbi8vICAgICAgICB9XG4vLyAgICAgICAgZWxzZSB7XG4vLyAgICAgICAgICAgIGxvb3BJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRpb25Mb29wKTtcbi8vICAgICAgICB9XG4vLyAgICB9XG4vLyAgICBcbi8vICAgIGxldCBsb29wSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XG4gICAgXG4gICAgZmlyZWRCdWJibGUuZG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2soKTtcbiAgICAgICAgZmlyZWRCdWJibGUuZG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIpO1xuICAgIH0sIGZhbHNlKTtcbiAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtIFwiICsgKGR1cmF0aW9uLzEwMDApICsgXCJzIGVhc2Utb3V0XCI7XG4gICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRyYW5zaXRpb24gPSBcIi13ZWJraXQtdHJhbnNmb3JtIFwiICsgKGR1cmF0aW9uLzEwMDApICsgXCJzIGVhc2Utb3V0XCI7XG4vLyAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudHJhbnNpdGlvbiA9IFwiLXdlYmtpdC10cmFuc2Zvcm0gXCIgKyAxICsgXCJzIGVhc2Utb3V0XCI7XG4vLyAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtIFwiICsgMSArIFwicyBlYXNlLW91dFwiO1xuXG5cbi8vICAgICAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtIFwiICsgMC41ICsgXCJzIGxpbmVhclwiO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUud2Via2l0VHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyBkaXN0YW5jZVggKyBcInB4LFwiICsgKC1kaXN0YW5jZVkgKyBzcHJpdGVSYWRpdXMpICsgXCJweClcIjtcbiAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRyYW5zZm9ybSA9IFwidHJhbnNsYXRlKFwiICsgZGlzdGFuY2VYICsgXCJweCxcIiArICgtZGlzdGFuY2VZICsgc3ByaXRlUmFkaXVzKSArIFwicHgpXCI7ICAgICAgICBcbiAgICB9LCAyMCk7XG5cblxufSAgIFxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVOZXh0QnViYmxlKCkge1xuICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbiAgICAgICAgXG4gICAgfVxuICAgIGN1cnJlbnRCdWJibGUgPSBCdWJibGUuY3JlYXRlKC0xLCAtMSk7XG4gICAgXG4gICAgLy8gbWFrZSB0aGUgbmV3IGJ1YmJsZSB0aGUgY3VycmVudCBidWJibGUsIHRoZW4gYWRkIGl0IHRvIHRoZSBkb21cbiAgICBjdXJyZW50QnViYmxlLmRvbS5jbGFzc0xpc3QuYWRkKFwiY3Vycl9idWJibGVcIik7XG4gICAgXG4vLyAgICBib2FyZC5hcHBlbmRDaGlsZChjdXJyZW50QnViYmxlLmRvbSk7ICAgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplICgpIHtcbiAgICBcbiAgICBsZXQgZ2FtZVdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IGdhbWVIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBsZXQgc2NhbGVUb0ZpdFggPSBnYW1lV2lkdGggLyA3MjA7IC8vIHRoZSBnYW1lIHdpbGwgYmUgcGxheWFibGUgaW4gcG9ydHJhaXQgbW9kZSwgc28gNzIwIGZvciBob3Jpem9udGFsIGFuZCAxMjgwIGZvciB2ZXJ0aWNhbFxuICAgIGxldCBzY2FsZVRvRml0WSA9IGdhbWVIZWlnaHQgLyAxMjgwO1xuICAgIGxldCBvcHRpbWFsUmF0aW8gPSBNYXRoLm1pbihzY2FsZVRvRml0WCwgc2NhbGVUb0ZpdFkpO1xuLy8gICAgdmFyIG9wdGltYWxSYXRpbyA9IE1hdGgubWF4KHNjYWxlVG9GaXRYLCBzY2FsZVRvRml0WSk7XG5cbiAgICBib2FyZFdpZHRoID0gKDcyMCAqIG9wdGltYWxSYXRpbyk7XG4gICAgYm9hcmRIZWlnaHQgPSAoKDEyODAgKiBvcHRpbWFsUmF0aW8pIC0gKHRvcGJhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBmb290ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSk7XG4gICAgYnViYmxlUmFkaXVzID0gKGJvYXJkV2lkdGggLyAobnVtT2ZDb2wgKzEpKSAvIDI7XG4gICAgc3ByaXRlUmFkaXVzID0gYnViYmxlUmFkaXVzIC8gMC44ODtcbiAgICBcbiAgICBib2FyZC5zdHlsZS53aWR0aCA9IGJvYXJkV2lkdGggKyBcInB4XCI7XG4gICAgYm9hcmQuc3R5bGUuaGVpZ2h0ID0gYm9hcmRIZWlnaHQgKyBcInB4XCI7XG4gICAgXG4gICAgXG4gICAgXG4vLyAgICBjdXJyZW50QnViYmxlLmxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChidWJibGVSYWRpdXMpKSArIFwicHhcIjtcbi8vICAgIGN1cnJlbnRCdWJibGUudG9wID0gKGJvYXJkSGVpZ2h0IC0gKGJ1YmJsZVJhZGl1cyAqIDMpKSArIFwicHhcIjtcbiAgICBcbiAgICBkcmF3Qm9hcmQoKTtcbi8vICAgIGxldCBidWJibGVXaWR0aCA9IChuZXdCb2FyZFdpZHRoIC8gbnVtT2ZDb2wgKzMpO1xuLy8gICAgLy8gdXBkYXRlIGdsb2JhbCBidWJibGVSYWRpdXMgdmFyaWFibGVcbi8vICAgIFxuLy8vLyAgICBjc3NSZW5kZXIoYnViYmxlV2lkdGgpO1xuLy8gICAgLy8gcmVzaXplIHRoZSBjdXJyZW50QnViYmxlXG4vLyAgICBpZihjdXJyZW50QnViYmxlKSB7XG4vLy8vICAgICAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS5sZWZ0ID0gKCAobmV3Qm9hcmRXaWR0aCAvIDIpIC0gKGJ1YmJsZVdpZHRoIC8yKSApICsgXCJweFwiO1xuLy8gICAgfVxuXG4gICAgXG5cbn1cbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBzZXROZXdCdWJibGVQb3NpdGlvbigpIHtcbiAgICBsZXQgd2lkdGggPSAoc3ByaXRlUmFkaXVzICogMikgKyBcInB4XCI7XG4gICAgbGV0IGxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChzcHJpdGVSYWRpdXMpKSArIFwicHhcIjtcbiAgICBsZXQgdG9wID0gKGJvYXJkSGVpZ2h0IC0gKHNwcml0ZVJhZGl1cyAqIDMpKSArIFwicHhcIjtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImN1cnJlbnRcIik7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUudG9wID0gdG9wO1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUuaGVpZ2h0ID0gd2lkdGg7XG4vLyAgICBjdXJyZW50QnViYmxlLmRvbS5jbGFzc0xpc3QuYWRkKFwiY3Vycl9idWJibGVcIik7XG59XG4gICAgXG5cbmV4cG9ydCBmdW5jdGlvbiBkcm9wQnViYmxlcyhvcnBoYW5CdWJibGVzKSB7XG4gICAgbGV0IHBhcnRpYWxBcHBsaWNhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG9ycGhhbkJ1YmJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBvcnBoYW5CdWJibGVzW2ldO1xuICAgICAgICAgICAgbGV0IGJ1YmJsZURvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJ1YmJsZS5yb3cgKyBcIlwiICsgYnViYmxlLmNvbCk7XG4gICAgICAgICAgICBidWJibGVEb20uYWRkRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIEJvYXJkLmRlbGV0ZUJ1YmJsZShidWJibGUpXG4gICAgICAgICAgICAgICAgYnViYmxlRG9tLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIpO1xuICAgICAgICAgICAgICAgIGJ1YmJsZURvbS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIFxuLy8gICAgICAgICAgICBidWJibGVEb20uc3R5bGUudHJhbnNpdGlvbiA9IFwidHJhbnNmb3JtIFwiICsgMS4yICsgXCJzIGN1YmljLWJlemllcigwLjU5LC0wLjA1LCAwLjc0LCAwLjA1KVwiO1xuICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLnRyYW5zaXRpb24gPSBcIi13ZWJraXQtdHJhbnNmb3JtIFwiICsgMC44ICsgXCJzIGN1YmljLWJlemllcigwLjU5LC0wLjA1LCAwLjc0LCAwLjA1KVwiO1xuXG5cbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIDAgKyBcInB4LFwiICsgMTUwMCArIFwicHgpXCI7XG4gICAgICAgICAgICBidWJibGVEb20uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyAwICsgXCJweCxcIiArIDE1MDAgKyBcInB4KVwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBwYXJ0aWFsQXBwbGljYXRpb247XG59XG5cbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlVmFuaXNoIChidWJibGVEb20sIGJ1YmJsZSwgYW5pbWF0ZUNhbGxiYWNrKSB7XG4gICAgbGV0IG51bU9mSXRlcmF0aW9uID0gMTU7XG4gICAgbGV0IGNvdW50ZXIgPSBudW1PZkl0ZXJhdGlvbjtcbiAgICBcbiAgICBsZXQgYW5pbWF0ZUJ1YmJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoY291bnRlciA9PSBudW1PZkl0ZXJhdGlvbikge1xuICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiMzMuMzMzMzMzMzMlIFwiICsgYnViYmxlLmdldEhlaWdodFBvc0Zyb21UeXBlKCkgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNvdW50ZXIgPT0gTWF0aC5mbG9vcihudW1PZkl0ZXJhdGlvbiAqIDIvMykpIHtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjY2LjY2NjY2NjY3JVwiICsgYnViYmxlLmdldEhlaWdodFBvc0Zyb21UeXBlKCkgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNvdW50ZXIgPT0gTWF0aC5mbG9vcihudW1PZkl0ZXJhdGlvbiAqIDEvMykpIHtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjEwMCVcIiArIGJ1YmJsZS5nZXRIZWlnaHRQb3NGcm9tVHlwZSgpICsgXCIlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY291bnRlciA9PSAwKSB7XG4gICAgICAgICAgICBidWJibGVEb20ucmVtb3ZlKCk7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShsb29wSUQpO1xuICAgICAgICAgICAgaWYoYW5pbWF0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgd2FzIHRoZSBsYXN0IGJ1YmJsZSB0byBiZSBhbmltYXRlZCB0aGVuIHdlIHdhbnQgdG8gYW5pbWF0ZSBvcnBoYW5zIGlmIHRoZSBleGlzdFxuICAgICAgICAgICAgICAgIGFuaW1hdGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY291bnRlciAtLTtcbiAgICAgICAgICAgIGxvb3BJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQnViYmxlKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0gICBcbiAgICBcbiAgICBsZXQgbG9vcElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVCdWJibGUpO1xufVxuXG4gICAgXG4gICAgXG5leHBvcnQgZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICAgIGxldCBib2FyZEFycmF5ID0gQm9hcmQuZ2V0Qm9hcmRBcnJheSgpO1xuLy8gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCB3aWR0aCA9IHNwcml0ZVJhZGl1cyAqIDI7XG4gICAgbGV0IGh0bWxTdHJpbmcgPSBcIlwiO1xuICAgIFxuICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbiAgICAgICAgbGV0IGxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChzcHJpdGVSYWRpdXMpKSArIFwicHhcIjtcbiAgICAgICAgbGV0IHRvcCA9IChib2FyZEhlaWdodCAtIChzcHJpdGVSYWRpdXMgKiAzKSkgKyBcInB4XCI7XG4gICAgICAgIGh0bWxTdHJpbmcgKz0gXCI8ZGl2IGlkPSdjdXJyZW50JyBjbGFzcz0nYnViYmxlIGJ1YmJsZVwiICsgY3VycmVudEJ1YmJsZS50eXBlICsgXCInIHN0eWxlPScgd2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggKyBcInB4O1wiICsgXCJsZWZ0OiBcIiArICgoYm9hcmRXaWR0aCAvIDIpIC0gKHNwcml0ZVJhZGl1cykpICsgXCJweDtcIiArIFwiIHRvcDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAoYm9hcmRIZWlnaHQgLSAoc3ByaXRlUmFkaXVzICogMykpICsgXCJweDsnID4gPC9kaXY+XCI7XG4gICAgICAgIFxuLy8gICAgICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAoIChuZXdCb2FyZFdpZHRoIC8gMikgLSAoYnViYmxlV2lkdGggLzIpICkgKyBcInB4XCI7XG4gICAgfVxuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQm9hcmQuTlVNX1JPVzsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtT2ZDb2wgKiAyOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5W2ldW2pdO1xuICAgICAgICAgICAgLy8gdGhlcmUgZXhpc3QgYSBidWJibGUgb24gdGhhdCBpbmRleCAoZXZlbiByb3dzIGhhdmUgYnViYmxlIG9uIHRoZSBvZGQgY29sdW1uIGluZGljaWVzKVxuICAgICAgICAgICAgaWYoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnQgPSAoaiAqIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IChpICogYnViYmxlUmFkaXVzICogMiAtIChzcHJpdGVSYWRpdXMgKiAwLjE1ICogaSkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY29vcmRzIGluIHRoZSBidWJibGUgb2JqZWN0ICh0aGVzZSBjb29yZHMgYXJlIGNvb3JkcyBvZiB0aGUgY2VudGVyIG9mIHRoZSBidWJibGUpXG4gICAgICAgICAgICAgICAgYnViYmxlLnNldENvb3JkcyhsZWZ0ICsgIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBidWJibGVSYWRpdXMsIHRvcCArIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaHRtbFN0cmluZyArPSBcIjxkaXYgaWQ9J1wiICsgaSArIFwiXCIgKyBqICsgXCInIGNsYXNzPSdidWJibGUgYnViYmxlXCIgKyBidWJibGUudHlwZSArIFwiJyBzdHlsZT0nbGVmdDogXCIgKyBsZWZ0ICsgXCJweDsgdG9wOiBcIiArIHRvcCArXG4gICAgICAgICAgICAgICAgICAgIFwicHg7IHdpZHRoOiBcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6IFwiICsgd2lkdGggKyBcInB4OycgPjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYm9hcmQuaW5uZXJIVE1MID0gaHRtbFN0cmluZztcbiAgICBjdXJyZW50QnViYmxlLnNldERPTShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnRcIikpO1xuLy8gICAgYm9hcmQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuLy8gICAgY3NzUmVuZGVyKGJ1YmJsZVJhZGl1cyAqIDIpO1xuLy8gICAgYm9hcmRJbml0aWF0ZWQgPSB0cnVlO1xufVxuICAgIFxuLypcbj09PT09PT09PT09PT09PT09PT09PT09PT1cblJlbmRlciB0aW1lciBhbmQgc2NvcmVcbj09PT09PT09PT09PT09PT09PT09PT09PT1cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJUaW1lKHRpbWVyU3RhdGUpIHtcbiAgICB0aW1lRG9tLnRleHRDb250ZW50ID0gXCJSZW1haW5pbmcgdGltZSBcIiArIHRpbWVyU3RhdGUubWluICsgXCI6XCIgKyB0aW1lclN0YXRlLnNlYztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclNjb3JlKHNjb3JlU3RhdGUpIHtcbiAgICBzY29yZURvbS50ZXh0Q29udGVudCA9IFwiU2NvcmU6IFwiICsgc2NvcmVTdGF0ZTtcbn1cblxuIl19
