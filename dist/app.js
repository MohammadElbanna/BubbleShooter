(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;
exports.setNumberOfAllowedRows = setNumberOfAllowedRows;
exports.updateTotalNumberOfBubbles = updateTotalNumberOfBubbles;
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

exports.totalNumberOfBubbles = totalNumberOfBubbles;
var numberOfAllowedRows = 0;

exports.numberOfAllowedRows = numberOfAllowedRows;

function init(numRows, numCols) {
    exports.NUM_ROW = NUM_ROW = numRows;
    exports.NUM_COL = NUM_COL = numCols;
    exports.totalNumberOfBubbles = totalNumberOfBubbles = NUM_ROW * NUM_COL / 2;

    createBoardArray();
}

function setNumberOfAllowedRows(number) {
    exports.numberOfAllowedRows = numberOfAllowedRows = number;
}

function updateTotalNumberOfBubbles(addedValue) {
    exports.totalNumberOfBubbles = totalNumberOfBubbles += addedValue;
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
    //    timerID = setInterval(updateTimer, 1000);
    UI.renderScore(score);
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
    Board.init(4, 24);
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
                    // check for winning the game
                    if (Board.totalNumberOfBubbles == 0) {
                        // use setTimeput to show a box that you won the game
                        setTimeout(function () {
                            return alert("you won the game!");
                        }, 400);
                        UI.gameBoard.removeEventListener("touchstart", ballFiredHandler);
                        UI.gameBoard.removeEventListener("click", ballFiredHandler);

                        //                    alert("you won the game");
                    }
                } else {
                        Board.updateTotalNumberOfBubbles(1);

                        if (Board.NUM_ROW >= Board.numberOfAllowedRows) {
                            alert("game over!");
                            UI.gameBoard.removeEventListener("touchstart", ballFiredHandler);
                            UI.gameBoard.removeEventListener("click", ballFiredHandler);
                        }
                    }
            };
        })();
    } // end if collisionHappened

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
    // update the tracked number of bubbles
    Board.updateTotalNumberOfBubbles(-(bubbles.length - 1 + orphans.length));
    //    Board.totalNumberOfBubbles -= (bubbles.length + orphans.length);

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

    // update the number of allowed rows to detect game over
    Board.setNumberOfAllowedRows(Math.floor(boardHeight / (bubbleRadius * 2)));

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvTW9kZWwvQm9hcmQuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvTW9kZWwvTWlzYy5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9hcHAuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvYnViYmxlLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2NvbGxpc2lvbkRldGVjdG9yLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2dhbWUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvdWkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7d0JDQXdCLGdCQUFnQjs7SUFBNUIsTUFBTTs7b0JBQ0UsWUFBWTs7SUFBcEIsRUFBRTs7QUFFUCxJQUFJLE9BQU8sWUFBQSxDQUFFOztBQUNiLElBQUksT0FBTyxZQUFBLENBQUM7OztBQUVuQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRWIsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7OztBQUU3QixJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQzs7OztBQUU1QixTQUFTLElBQUksQ0FBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3BDLFlBVk8sT0FBTyxHQVVkLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDbEIsWUFWTyxPQUFPLEdBVWQsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUNsQixZQVBPLG9CQUFvQixHQU8zQixvQkFBb0IsR0FBRyxPQUFPLEdBQUcsT0FBTyxHQUFFLENBQUMsQ0FBQzs7QUFF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QUksR0FBSSxDQUFDLEdBQUcsWUFBWSxBQUFDLENBQUM7QUFDOUIsb0JBQUksS0FBRyxHQUFJLENBQUMsR0FBRyxZQUFZLEdBQUcsQ0FBQyxHQUFJLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxBQUFDLEFBQUMsQ0FBQzs7O0FBRzdELHNCQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBSSxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxFQUFFLEtBQUcsR0FBRyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7O0FBRXBJLDBCQUFVLElBQUksV0FBVyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLHdCQUF3QixHQUFHLE1BQU0sQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxHQUFHLFdBQVcsR0FBRyxLQUFHLEdBQzFILGFBQWEsR0FBRyxLQUFLLEdBQUcsYUFBYSxHQUFHLEtBQUssR0FBRyxjQUFjLENBQUM7YUFDdEU7U0FDSjtLQUNKOztBQUVELFNBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQzdCLGlCQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7OztDQUk1RDs7Ozs7Ozs7QUFRTSxTQUFTLFVBQVUsQ0FBQyxVQUFVLEVBQUU7QUFDbkMsV0FBTyxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDO0NBQ25GOztBQUVNLFNBQVMsV0FBVyxDQUFDLFVBQVUsRUFBRTtBQUNwQyxZQUFRLENBQUMsV0FBVyxHQUFHLFNBQVMsR0FBRyxVQUFVLENBQUM7Q0FDakQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuLy4uL2J1YmJsZS5qc1wiO1xuaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vLi4vdWkuanNcIjtcblxuZXhwb3J0IGxldCBOVU1fUk9XIDtcbmV4cG9ydCBsZXQgTlVNX0NPTDtcblxubGV0IGJvYXJkQXJyYXkgPSBbXTtcblxuZXhwb3J0IGxldCB0b3RhbE51bWJlck9mQnViYmxlcyA9IDA7XG5cbmV4cG9ydCBsZXQgbnVtYmVyT2ZBbGxvd2VkUm93cyA9IDA7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0IChudW1Sb3dzLCBudW1Db2xzKSB7XG4gICAgTlVNX1JPVyA9IG51bVJvd3M7XG4gICAgTlVNX0NPTCA9IG51bUNvbHM7XG4gICAgdG90YWxOdW1iZXJPZkJ1YmJsZXMgPSBOVU1fUk9XICogTlVNX0NPTCAvMjtcbiAgICBcbiAgICBjcmVhdGVCb2FyZEFycmF5KCk7ICAgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TnVtYmVyT2ZBbGxvd2VkUm93cyhudW1iZXIpIHtcbiAgICBudW1iZXJPZkFsbG93ZWRSb3dzID0gbnVtYmVyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRvdGFsTnVtYmVyT2ZCdWJibGVzIChhZGRlZFZhbHVlKSB7XG4gICAgdG90YWxOdW1iZXJPZkJ1YmJsZXMgKz0gYWRkZWRWYWx1ZTtcbn1cbiAgICBcbmxldCBCb2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnViYmxlQXJyYXkgPSBjcmVhdGVCdWJibGVBcnJheSgpO1xuICAgIFxufVxuXG5leHBvcnQgbGV0IGFkZEJ1YmJsZSA9IGZ1bmN0aW9uIChidWJibGUsIGNvb3Jkcykge1xuLy8gICAgbGV0IHJvd051bSA9IE1hdGguZmxvb3IoY29vcmRzLnkgLyAoVUkuYnViYmxlUmFkaXVzICogMikpO1xuICAgIGxldCByb3dOdW0gPSBjb29yZHMueTtcbiAgICBjb29yZHMueCA9IGNvb3Jkcy54IC0gVUkuYm9hcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICBpZihyb3dOdW0gJSAyID09IDApIHtcbi8vICAgICAgICBjb29yZHMueCA9IGNvb3Jkcy54IC0gVUkuc3ByaXRlUmFkaXVzIC8yXG4gICAgfVxuICAgIFxuICAgIGxldCBjb2xOdW07XG4vLyAgICBsZXQgY29sTnVtID0gTWF0aC5yb3VuZChjb29yZHMueCAvIChVSS5idWJibGVSYWRpdXMgKiAyKSk7IFxuLy8gICAgY29sTnVtIC09IDE7XG4vLyAgICBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvbE51bSAvIDIpICogMjtcbiAgICBcbiAgICBpZiAocm93TnVtICUgMiA9PT0gMCkge1xuICAgICBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvb3Jkcy54IC8gKFVJLmJ1YmJsZVJhZGl1cyAqIDIpKTsgXG5cbiAgICAgICAgY29sTnVtID0gKGNvbE51bSAqIDIpIC0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbE51bSA9IE1hdGguZmxvb3IoY29vcmRzLnggLyAoVUkuYnViYmxlUmFkaXVzICogMikpOyBcblxuICAgICAgICBjb2xOdW0gPSAoY29sTnVtICogMikgIDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFib2FyZEFycmF5W3Jvd051bV0pIHtcbiAgICAgICAgYm9hcmRBcnJheVtyb3dOdW1dID0gW107XG4gICAgICAgIE5VTV9ST1cgKys7XG4gICAgfVxuLy8gICAgZWxzZSBpZiAoYm9hcmRBcnJheVtyb3dOdW1dW2NvbE51bV0gIT0gZmFsc2UpIHtcbi8vICAgICAgICBiXG4vLyAgICB9XG4gICAgYnViYmxlLnNldENvbChjb2xOdW0pO1xuICAgIGJ1YmJsZS5zZXRSb3cocm93TnVtKTtcbiAgICBib2FyZEFycmF5W3Jvd051bV1bY29sTnVtXSA9IGJ1YmJsZTtcbn1cblxuXG5cbmV4cG9ydCBsZXQgZ2V0Qm9hcmRBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBib2FyZEFycmF5O1xufSBcblxuXG5cbi8vIHJldHVybiB0aGUgYnViYmxlIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9yIG51bGwgaWYgaXQgZG9lc24ndCBleGlzdFxuZnVuY3Rpb24gZ2V0QnViYmxlQXQocm93LCBjb2wpIHtcbiAgICBpZiAoIWJvYXJkQXJyYXlbcm93XSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGJvYXJkQXJyYXlbcm93XVtjb2xdO1xufVxuXG4vLyBnZXQgdGhlIGJ1YmJsZXMgdGhhdCBzdXJyb3VuZCBhIGJ1YmJsZVxuZnVuY3Rpb24gZ2V0QnViYmxlQXJvdW5kKHJvdywgY29sKSB7XG4gICAgdmFyIGJ1YmJsZUxpc3QgPSBbXTtcbiAgICBmb3IobGV0IGkgPSByb3cgLTE7IGkgPD0gcm93ICsgMTsgaSsrKSB7XG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBidWJibGVzIGluIHRoYXQgcm93XG4gICAgICAgIGZvcihsZXQgaiA9IGNvbCAtIDI7IGogPD0gY29sICsgMjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gZ2V0QnViYmxlQXQoaSwgaik7XG4gICAgICAgICAgICBpZiAoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgYnViYmxlTGlzdC5wdXNoKGJ1YmJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJ1YmJsZUxpc3Q7XG59XG5cbi8vIGdldCB0aGUgY29ubmVjdGVkIGdyb3VwIG9mIGJ1YmJsZXMgKHRoYXQgc2hhcmUgdGhlIHNhbWUgY29sb3IsIG9yIG5vdCkgc3RhcnRpbmcgZnJvbSB0aGlzIGJ1YmJsZVxuZXhwb3J0IGZ1bmN0aW9uIGdldEdyb3VwIChidWJibGUsIGJ1YmJsZXNGb3VuZCwgZGlmZmVyZW50Q29sb3IpIHtcbiAgICBsZXQgY3VycmVudFJvdyA9IGJ1YmJsZS5yb3c7XG4gICAgaWYoIWJ1YmJsZXNGb3VuZFtjdXJyZW50Um93XSkge1xuICAgICAgICBidWJibGVzRm91bmRbY3VycmVudFJvd10gPSB7fTtcbiAgICB9XG4gICAgaWYoIWJ1YmJsZXNGb3VuZC5saXN0KSB7XG4gICAgICAgIGJ1YmJsZXNGb3VuZC5saXN0ID0gW107XG4gICAgfVxuICAgIGlmKGJ1YmJsZXNGb3VuZFtidWJibGUucm93XVtidWJibGUuY29sXSkge1xuICAgICAgICAvLyB3ZSBlbmQgdGhpcyBicmFuY2ggb2YgcmVjdXJzaW9uIGhlcmUgYmVjYXVzZSB3ZSd2ZSBiZWVuIHRvIHRoaXMgYnViYmxlIGJlZm9yZVxuICAgICAgICByZXR1cm4gYnViYmxlc0ZvdW5kO1xuICAgIH1cbiAgICBcbiAgICAvLyBhZGQgdGhlIGJ1YmJsZSB0byB0aGUgMkQgYXJyYXlcbiAgICBidWJibGVzRm91bmRbYnViYmxlLnJvd11bYnViYmxlLmNvbF0gPSBidWJibGU7XG4gICAgLy8gcHVzaCB0aGUgYnViYmxlIHRvIHRoZSBsaW5lYXIgbGlzdFxuICAgIGJ1YmJsZXNGb3VuZC5saXN0LnB1c2goYnViYmxlKTtcbiAgICAvLyBnZXQgYSBsaXN0IG9mIGJ1YmJsZXMgdGhhdCBzdXJyb3VuZCB0aGlzIGJ1YmJsZSBhbmQgYXJlIG9mIHRoZSBzYW1lIGNvbG9yXG4gICAgbGV0IHN1cnJvdW5kaW5nID0gZ2V0QnViYmxlQXJvdW5kKGJ1YmJsZS5yb3csIGJ1YmJsZS5jb2wpO1xuICAgIC8vIGZvciBldmVyeSBzdXJyb3VuZGluZyBidWJibGUgcmVjdXJzaXZlbHkgY2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHN1cnJvdW5kaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmKHN1cnJvdW5kaW5nW2ldLnR5cGUgPT09IGJ1YmJsZS50eXBlIHx8IGRpZmZlcmVudENvbG9yKSB7XG4gICAgICAgICAgICBidWJibGVzRm91bmQgPSBnZXRHcm91cChzdXJyb3VuZGluZ1tpXSwgYnViYmxlc0ZvdW5kLCBkaWZmZXJlbnRDb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGJ1YmJsZXNGb3VuZDtcbn1cbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBmaW5kT3JwaGFucyAoKSB7XG4gICAgbGV0IGNvbm5lY3RlZCA9IFtdO1xuICAgIGxldCBncm91cHMgPSBbXTtcbiAgICBsZXQgb3JwaGFucyA9IFtdO1xuICAgIC8vIGluaXRpYWxpemUgdGhlIHJvd3Mgb2YgdGhlIGNvbm5lY3RlZFxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBib2FyZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbm5lY3RlZFtpXSA9IFtdO1xuICAgIH1cbiAgICAvLyBsb29wIG9uIHRoZSBmaXJzdCByb3csIGJlY2F1c2UgaXQgc2hvdWxkIGJlIHRoZSByb290IG9mIGV2ZXJ5IGNvbm5lY3RlZCBncm91cFxuICAgIC8vIGluaXRpYWxseSBldmVyeXRoaW5nIGlzIE5PVCBjb25uZWN0ZWRcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYm9hcmRBcnJheVswXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgYnViYmxlID0gYm9hcmRBcnJheVswXVtpXTtcbiAgICAgICAgaWYoYnViYmxlICYmICFjb25uZWN0ZWRbMF1baV0pIHtcbiAgICAgICAgICAgIC8vIGhlcmUgd2UgcGFzcyB0cnVlLCBiZWNhdXNlIHdlIHdhbnQgdG8gbWF0Y2ggZm9yIGFueSBjb2xvclxuICAgICAgICAgICAgbGV0IGdyb3VwID0gZ2V0R3JvdXAoYnViYmxlLCB7fSwgdHJ1ZSk7XG4gICAgICAgICAgICBncm91cC5saXN0LmZvckVhY2goaXRlbSA9PiBjb25uZWN0ZWRbaXRlbS5yb3ddW2l0ZW0uY29sXSA9IHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIGJvYXJkIHRvIGRldGVjdCBvcnBoYW4gYnViYmxlcyBhZnRlciB3ZSBkZWNpZGVkIGNvbm5lY3RlZCBidWJibGVzIHdpdGggdGhlIGZpcnN0IHJvd1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBib2FyZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzdGFydENvbCA9IGklMiA9PSAwID8gMSA6IDA7XG4gICAgICAgIGZvcihsZXQgaiA9IHN0YXJ0Q29sOyBqIDwgTlVNX0NPTDsgaiArPSAyKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gZ2V0QnViYmxlQXQoaSwgaik7XG4gICAgICAgICAgICBpZihidWJibGUgJiYgIWNvbm5lY3RlZFtpXVtqXSkge1xuICAgICAgICAgICAgICAgIG9ycGhhbnMucHVzaChidWJibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBvcnBoYW5zO1xufVxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUJ1YmJsZShidWJibGUpIHtcbiAgICBkZWxldGUgYm9hcmRBcnJheVtidWJibGUucm93XVtidWJibGUuY29sXTtcbn1cblxuXG5sZXQgY3JlYXRlQm9hcmRBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgTlVNX1JPVzsgaSsrKSB7XG4gICAgICAgIGxldCBzdGFydENvbCA9IGklMiA9PSAwID8gMSA6IDA7XG4gICAgICAgIGJvYXJkQXJyYXlbaV0gPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGogPSBzdGFydENvbCA7IGogPCBOVU1fQ09MOyBqKz0gMikge1xuICAgICAgICAgICAgbGV0IGJ1YmJsZSA9IEJ1YmJsZS5jcmVhdGUoaSwgaik7XG4gICAgICAgICAgICBib2FyZEFycmF5W2ldW2pdID0gYnViYmxlO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCAqIGFzIFVJIGZyb20gXCIuLy4uL3VpLmpzXCI7XG5cbmxldCBzY29yZSA9IDA7XG5sZXQgdGltZXIgPSB7XG4gICAgbWluOiAyLFxuICAgIHNlYzogMFxufTtcblxubGV0IHRpbWVySUQgO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCAoKSB7XG4vLyAgICB0aW1lcklEID0gc2V0SW50ZXJ2YWwodXBkYXRlVGltZXIsIDEwMDApO1xuICAgIFVJLnJlbmRlclNjb3JlKHNjb3JlKTtcbn1cblxuLy8gbGV0IHRpbWVySUQgPSBzZXRJbnRlcnZhbCh1cGRhdGVUaW1lciwgMTAwMCk7XG5cbmZ1bmN0aW9uIHVwZGF0ZVRpbWVyKCkge1xuLy8gICAgVUkucmVuZGVyU2NvcmUoc2NvcmUpO1xuICAgIFVJLnJlbmRlclRpbWUodGltZXIpO1xuICAgIFxuICAgIHRpbWVyLnNlYyAtLTtcbiAgICBcbiAgICBpZih0aW1lci5zZWMgPT0gLTEpIHtcbiAgICAgICAgaWYodGltZXIubWluID09IDApIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXJJRCk7XG4gICAgICAgICAgICAvLyByZW5kZXIgZ2FtZSBvdmVyXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aW1lci5zZWMgPSA1OTtcbiAgICAgICAgICAgIHRpbWVyLm1pbiA9IHRpbWVyLm1pbiAtIDE7ICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gcmVuZGVyIHRoZSB0aW1lciBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVNjb3JlKGFkZGVkVmFsdWUpIHtcbiAgICBzY29yZSA9IHNjb3JlICsgYWRkZWRWYWx1ZTtcbiAgICBpZihhZGRlZFZhbHVlID4gMClcbiAgICAgICAgVUkucmVuZGVyU2NvcmUoc2NvcmUpO1xufSIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSBcIi4vZ2FtZS5qc1wiO1xuXG5nYW1lLmluaXQoKTsiLCJpbXBvcnQgKiBhcyBVSSBmcm9tIFwiLi91aS5qc1wiO1xuXG5mdW5jdGlvbiBCdWJibGUgKGRvbUVsZW1lbnQsIHJvdywgY29sLCB0eXBlKSB7XG4gICAgZG9tRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIpO1xuICAgIGRvbUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImJ1YmJsZVwiICsgdHlwZSk7XG4gICAgdGhpcy5kb20gPSBkb21FbGVtZW50O1xuICAgIHRoaXMuY29sID0gY29sO1xuICAgIHRoaXMucm93ID0gcm93O1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0VHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRET00gPSBmdW5jdGlvbiAobmV3RG9tKSB7XG4gICAgdGhpcy5kb20gPSBuZXdEb207XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0Q29vcmRzID0gZnVuY3Rpb24gKGxlZnQsIHRvcCkge1xuICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgdGhpcy50b3AgPSB0b3A7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0Q29sID0gZnVuY3Rpb24oY29sKSB7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0Um93ID0gZnVuY3Rpb24gKHJvdykge1xuICAgIHRoaXMucm93ID0gcm93O1xufVxuXG5CdWJibGUucHJvdG90eXBlLmdldENvb3JkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXG4gICAgICAgIHRvcDogdGhpcy50b3BcbiAgICB9O1xufVxuXG5CdWJibGUucHJvdG90eXBlLmNoYW5nZVR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRoaXMuZG9tLmNsYXNzTGlzdC5yZW1vdmUoXCJidWJibGVcIiArIHRoaXMudHlwZSk7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0eXBlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgfVxuICAgIHRoaXMuc2V0VHlwZSh0eXBlKTtcbiAgICB0aGlzLmRvbS5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIgKyB0eXBlKTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5nZXRIZWlnaHRQb3NGcm9tVHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50eXBlID09IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmICh0aGlzLnR5cGUgPT0gMSkge1xuICAgICAgICByZXR1cm4gMzMuMzMzMzMzMzM7XG4gICAgfVxuICAgIGlmICh0aGlzLnR5cGUgPT0gMikge1xuICAgICAgICByZXR1cm4gNjYuNjY2NjY2Njc7XG4gICAgfVxuICAgIGlmICh0aGlzLnR5cGUgPT0gMykge1xuICAgICAgICByZXR1cm4gMTAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGxldCBjcmVhdGUgPSBmdW5jdGlvbiAocm93LCBjb2wsIHR5cGUpIHtcbiAgICBsZXQgYnViYmxlRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHR5cGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICB9XG4gICAgbGV0IG5ld0J1YmJsZSA9IG5ldyBCdWJibGUoYnViYmxlRE9NLCByb3csIGNvbCwgdHlwZSk7XG4gICAgXG4gICAgcmV0dXJuIG5ld0J1YmJsZTtcbiAgICBcbn1cblxuZXhwb3J0IGxldCBkZWVwQ29weSA9IGZ1bmN0aW9uIChjb3BpZWRCdWJibGUpIHtcbiAgICBsZXQgbmV3QnViYmxlRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUubGVmdCA9IGNvcGllZEJ1YmJsZS5kb20uc3R5bGUubGVmdDtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUudG9wID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS50b3A7XG4gICAgbmV3QnViYmxlRG9tLnN0eWxlLndpZHRoID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS53aWR0aDtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUuaGVpZ2h0ID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS5oZWlnaHQ7XG4gICAgXG4gICAgcmV0dXJuIG5ldyBCdWJibGUgKG5ld0J1YmJsZURvbSwgLTEsIC0xLCBjb3BpZWRCdWJibGUudHlwZSk7XG59IiwiaW1wb3J0ICogYXMgQm9hcmQgZnJvbSBcIi4vTW9kZWwvQm9hcmQuanNcIjtcbmltcG9ydCAqIGFzIFVJIGZyb20gXCIuL3VpLmpzXCI7XG5cbmxldCBib2FyZEFycmF5ID0gQm9hcmQuZ2V0Qm9hcmRBcnJheSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZEludGVyc2VjdGlvbihhbmdsZSwgY3VyckJ1YmJsZSkge1xuICAgIGxldCBzdGFydENlbnRlclBvcyA9IHtcbiAgICAgICAgbGVmdDogY3VyckJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIFVJLnNwcml0ZVJhZGl1cyxcbiAgICAgICAgdG9wOiBjdXJyQnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBVSS5zcHJpdGVSYWRpdXNcbiAgICB9XG4gICAgXG4gICAgLy8gYW4gb2JqZWN0IHRoYXQgaG9sZHMgc29tZSBkYXRhIG9uIGEgY29sbGlzaW9uIGlmIGV4aXN0c1xuICAgIGxldCBjb2xsaXNpb24gPSBudWxsO1xuICAgIFxuICAgIGxldCBkeCA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICBsZXQgZHkgPSAtTWF0aC5jb3MoYW5nbGUpO1xuICAgIFxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBCb2FyZC5OVU1fUk9XOyBpKyspIHtcbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBCb2FyZC5OVU1fQ09MIDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gYm9hcmRBcnJheVtpXVtqXTtcbiAgICAgICAgICAgIGlmKGJ1YmJsZSkge1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgY29vcmRzIG9mIHRoZSBjdXJyZW50IGJ1YmJsZVxuICAgICAgICAgICAgICAgIGxldCBidWJibGVDb29yZHMgPSBidWJibGUuZ2V0Q29vcmRzKCk7XG4gICAgICAgICAgICAgICAgbGV0IGRpc3RUb0J1YmJsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCAtIGJ1YmJsZUNvb3Jkcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICB5OiBzdGFydENlbnRlclBvcy50b3AgLSBidWJibGVDb29yZHMudG9wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCB0ID0gZHggKiBkaXN0VG9CdWJibGUueCArIGR5ICogZGlzdFRvQnViYmxlLnk7XG4gICAgICAgICAgICAgICAgLy8gXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gLXQgKiBkeCArIHN0YXJ0Q2VudGVyUG9zLmxlZnQ7XG4gICAgICAgICAgICAgICAgbGV0IGV5ID0gLXQgKiBkeSArIHN0YXJ0Q2VudGVyUG9zLnRvcDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgZGlzdEVDID0gTWF0aC5zcXJ0KE1hdGgucG93KChleCAtIGJ1YmJsZUNvb3Jkcy5sZWZ0KSwgMikgLSBNYXRoLnBvdygoZXkgLSBidWJibGVDb29yZHMudG9wKSwgMikpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcmVwZW5kaWN1bGFyIGRpc3RhbmNlIGJldHdlZW4gdGhlIHRyYWplY3RvcnkgYW5kIHRoZSBjZW50ZXIgb2YgdGhlIGNoZWNrZWQgb3V0IGJ1YmJsZSBpcyBncmVhdGVyIHRoYW4gMlIsIHRoZW4gTk8gY29sbGlzaW9uXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RFQyA8IFVJLmJ1YmJsZVJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZHQgPSBNYXRoLnNxcnQoTWF0aC5wb3coVUkuYnViYmxlUmFkaXVzLCAyKSAtIE1hdGgucG93KGRpc3RFQywgMikpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0MSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6ICh0IC0gZHQpICogZHgsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiAtKHQgLSBkdCkgKiBkeVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogKHQgKyBkdCkgKiBkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IC0odCArIGR0KSAqIGR5XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdFRvRmlyc3RQb2ludCA9IE1hdGguc3FydChNYXRoLnBvdyhvZmZzZXQxLngsIDIpICsgTWF0aC5wb3cob2Zmc2V0MS55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdFRvU2Vjb25kUG9pbnQgPSBNYXRoLnNxcnQoTWF0aC5wb3cob2Zmc2V0Mi54ICwyKSArIE1hdGgucG93KG9mZnNldDIueSwgMikpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9sZHMgdGhlIG5ldyBkaXN0YW5jZSBmcm9tIHRoZSBzdGFydGluZyBwb2ludCBvZiBmaXJpbmcgYSBiYWxsIHRvIHRoZSBjb2xsaXNvbiBwb2ludCB0IFxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3RGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhvbGRzIHRoZSBjb2xsaXNpb24gcG9pbnQgY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbGxpc2lvbkNvb3JkcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RUb0ZpcnN0UG9pbnQgPCBkaXN0VG9TZWNvbmRQb2ludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RGlzdGFuY2UgPSBkaXN0VG9GaXJzdFBvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uQ29vcmRzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHN0YXJ0Q2VudGVyUG9zLmxlZnQgKyBvZmZzZXQxLngsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBzdGFydENlbnRlclBvcy50b3AgKyBvZmZzZXQxLnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBidWJibGUucm93ICsgMVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEaXN0YW5jZSA9IGRpc3RUb1NlY29uZFBvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uQ29vcmRzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHN0YXJ0Q2VudGVyUG9zLmxlZnQgLSBvZmZzZXQyLngsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBzdGFydENlbnRlclBvcy50b3AgKyBvZmZzZXQyLnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBidWJibGUucm93ICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhIGNvbGxpc2lvbiB3YXMgZGV0ZWN0ZWQgYW5kIHdhcyBkaXN0YW5jZSB3YXMgc21hbGxlciB0aGFuIHRoZSBzbWFsbGVzdCBjb2xsaXNpb24gZGlzdGFuZSB0aWxsIG5vd1xuICAgICAgICAgICAgICAgICAgICBpZighY29sbGlzaW9uIHx8IG5ld0Rpc3RhbmNlIDwgY29sbGlzaW9uLmRpc3RhbmNlVG9Db2xsaXNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZVRvQ29sbGlzaW9uOiBuZXdEaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGU6IGJ1YmJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IGNvbGxpc2lvbkNvb3Jkc1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcbiAgICB9IiwiaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vdWkuanNcIjtcbmltcG9ydCAqIGFzIEJ1YmJsZSBmcm9tIFwiLi9idWJibGUuanNcIjtcbmltcG9ydCAqIGFzIEJvYXJkIGZyb20gXCIuL01vZGVsL0JvYXJkLmpzXCI7XG5pbXBvcnQgKiBhcyBDb2xsaXNpb24gZnJvbSBcIi4vY29sbGlzaW9uRGV0ZWN0b3IuanNcIjtcbmltcG9ydCAqIGFzIFN0YXRlIGZyb20gXCIuL01vZGVsL01pc2MuanNcIjtcblxubGV0IGJvYXJkIDtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIgLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFVJLm5ld0dhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIFVJLnJlc2l6ZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIFVJLnJlc2l6ZSk7XG4gICAgfSk7XG59XG4gICAgXG5mdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIEJvYXJkLmluaXQoNCwyNCk7XG4gICAgVUkuaW5pdCgpO1xuICAgIFVJLm5ld0dhbWVCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG4gICAgVUkuaGlkZURpYWxvZygpO1xuICAgIFxuLy8gICAgVUkuZHJhd0JvYXJkKCk7XG4gICAgXG4gICAgLy8gc2V0IHRoZSBmaXJzdCBuZXh0IGJ1YmJsZVxuICAgIFVJLnByZXBhcmVOZXh0QnViYmxlKCk7XG4gICAgVUkucmVzaXplKCk7XG4vLyAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICBcbiAgICBcbiAgICAvLyBhZGQgZXZlbnQgbGlzdG5lciBmb3IgbW91c2UgY2xpY2tzIG9uIHRoZSBib2FyZFxuICAgIFVJLmdhbWVCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBiYWxsRmlyZWRIYW5kbGVyKTtcbiAgICBVSS5nYW1lQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xuICAgIFxuICAgIFN0YXRlLmluaXQoKTtcbn1cblxuZnVuY3Rpb24gYmFsbEZpcmVkSGFuZGxlcihldmVudCkge1xuICAgIFxuICAgIGxldCBjb29yZGluYXRlcyA9IHt9O1xuICAgIGlmKGV2ZW50LnR5cGUgPT0gXCJ0b3VjaHN0YXJ0XCIpIHtcbiAgICAgICAgY29vcmRpbmF0ZXMueCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgICBjb29yZGluYXRlcy55ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBoYW5kbGluZyBtb3VzZVxuICAgICAgICBjb29yZGluYXRlcy54ID0gZXZlbnQucGFnZVg7XG4gICAgICAgIGNvb3JkaW5hdGVzLnkgPSBldmVudC5wYWdlWTtcbiAgICB9XG4gICAgLy8gZ2V0IHRoZSBmaXJpbmcgYW5nbGVcbiAgICBsZXQgYW5nbGUgPSBnZXRBbmdsZUZyb21EZXZpY2UoY29vcmRpbmF0ZXMpO1xuICAgIFxuICAgIC8vIGRlZmF1bHQgZGlzdGFuY2UgYW5kIGR1cmF0aW9uXG4gICAgbGV0IGFuaW1hdGlvbkR1cmF0aW9uID0gNzUwOyAvLyAwLjc1IHNlY1xuICAgIGxldCBkaXN0YW5jZSA9IDEwMDA7XG4gICAgXG4gICAgbGV0IGNvbGxpc2lvbkhhcHBlbmVkID0gQ29sbGlzaW9uLmZpbmRJbnRlcnNlY3Rpb24oYW5nbGUsIFVJLmN1cnJlbnRCdWJibGUpO1xuICAgIFxuICAgIGxldCBhbmltYXRpb25DYWxsYmFjaztcbiAgICBsZXQgbmV3QnViYmxlID0gQnViYmxlLmRlZXBDb3B5KFVJLmN1cnJlbnRCdWJibGUpO1xuICAgIFVJLmJvYXJkLmFwcGVuZENoaWxkKG5ld0J1YmJsZS5kb20pO1xuICAgIC8vIHJhbmRvbWx5IGNoYW5nZSB0aGUgdHlwZSB0byBnZXQgYSBuZXcgYnViYmxlIHdpdGggYSBuZXcgY29sb3JcbiAgICBVSS5jdXJyZW50QnViYmxlLmNoYW5nZVR5cGUoKTtcbiAgICBcbiAgICAvLyBpZiBjb2xsaXNpb24gb2NjdXJzIGNoYW5nZSBkaXN0YW5jZSBhbmQgZHVyYXRpb24uXG4gICAgaWYgKGNvbGxpc2lvbkhhcHBlbmVkKSB7XG4gICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uID0gYW5pbWF0aW9uRHVyYXRpb24gKiBjb2xsaXNpb25IYXBwZW5lZC5kaXN0YW5jZVRvQ29sbGlzaW9uIC8gZGlzdGFuY2U7XG4gICAgICAgIGRpc3RhbmNlID0gY29sbGlzaW9uSGFwcGVuZWQuZGlzdGFuY2VUb0NvbGxpc2lvbjtcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBib2FyZCBzdGF0ZSB3aXRoIHRoZSBwb3NpdGlvbiBvZiB0aGUgbmV3IGJ1YmJsZS4gYWxzbyB1cGRhdGUgdGhlIGNvbCBhbmQgcm93IG9mIHRoZSBidWJibGUgb2JqZWN0IGl0c2VsZlxuICAgICAgICBCb2FyZC5hZGRCdWJibGUobmV3QnViYmxlLCBjb2xsaXNpb25IYXBwZW5lZC5jb29yZHMpO1xuICAgICAgICBcbiAgICAgICAgLy8gY2hlY2sgZm9yIGdyb3VwcyB3aXRoIHRoZSBzYW1lIGNvbG9yIGxpa2Ugb3VyIG5ldyBidWJibGVcbiAgICAgICAgbGV0IGdyb3VwID0gQm9hcmQuZ2V0R3JvdXAobmV3QnViYmxlLCB7fSk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyByZS1yZW5kZXIgYWxsIHRoZSBkb20gdHJlZSB3aGVuIHRoZSBhbmltYXRpb24gZmluaXNoIHRvIHB1dCB0aGUgbmV3IGJ1YmJsZSBpbiB0aGUgYXBwcm9wcmlhdGUgcG9zaXRpb25cbiAgICAgICAgICAgIFVJLmRyYXdCb2FyZCgpO1xuICAgICAgICAgICAgaWYoZ3JvdXAubGlzdC5sZW5ndGggPj0gMykge1xuICAgICAgICAgICAgICAgIHBvcEJ1YmJsZXMoZ3JvdXAubGlzdCk7XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHNjb3JlXG4gICAgICAgICAgICAgICAgU3RhdGUudXBkYXRlU2NvcmUoZ3JvdXAubGlzdC5sZW5ndGggKiAxMCk7XG4vLyAgICAgICAgICAgICAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBmb3Igd2lubmluZyB0aGUgZ2FtZVxuICAgICAgICAgICAgICAgIGlmIChCb2FyZC50b3RhbE51bWJlck9mQnViYmxlcyA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVzZSBzZXRUaW1lcHV0IHRvIHNob3cgYSBib3ggdGhhdCB5b3Ugd29uIHRoZSBnYW1lXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gYWxlcnQoXCJ5b3Ugd29uIHRoZSBnYW1lIVwiKSwgNDAwKTtcbiAgICAgICAgICAgICAgICAgICAgVUkuZ2FtZUJvYXJkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xuICAgICAgICAgICAgICAgICAgICBVSS5nYW1lQm9hcmQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xuXG4vLyAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJ5b3Ugd29uIHRoZSBnYW1lXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIEJvYXJkLnVwZGF0ZVRvdGFsTnVtYmVyT2ZCdWJibGVzKDEpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKEJvYXJkLk5VTV9ST1cgPj0gQm9hcmQubnVtYmVyT2ZBbGxvd2VkUm93cykge1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcImdhbWUgb3ZlciFcIik7XG4gICAgICAgICAgICAgICAgICAgIFVJLmdhbWVCb2FyZC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBiYWxsRmlyZWRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgICAgVUkuZ2FtZUJvYXJkLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBiYWxsRmlyZWRIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IC8vIGVuZCBpZiBjb2xsaXNpb25IYXBwZW5lZFxuICAgIFxuICAgIGVsc2Uge1xuICAgICAgICBhbmltYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG5ld0J1YmJsZS5kb20ucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9IC8vIGVuZCBlbHNlXG4gICAgXG4gICAgLy8gZmlyZSB1cCB0aGUgYW5pbWF0aW9uXG4gICAgVUkuc3RhcnRCYWxsQW5pbWF0aW9uKG5ld0J1YmJsZSwgYW5nbGUsIGFuaW1hdGlvbkR1cmF0aW9uLCBkaXN0YW5jZSwgYW5pbWF0aW9uQ2FsbGJhY2spO1xuICAgIFxuICAgIFxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbn1cblxuXG5mdW5jdGlvbiBwb3BCdWJibGVzIChidWJibGVzKXtcbiAgICBidWJibGVzLmZvckVhY2goYnViYmxlID0+IEJvYXJkLmRlbGV0ZUJ1YmJsZShidWJibGUpKTtcbiAgICAvLyBnZXQgdGhlIG9ycGhhbnMgXG4gICAgbGV0IG9ycGhhbnMgPSBCb2FyZC5maW5kT3JwaGFucygpO1xuICAgIC8vIHVwZGF0ZSB0aGUgdHJhY2tlZCBudW1iZXIgb2YgYnViYmxlc1xuICAgIEJvYXJkLnVwZGF0ZVRvdGFsTnVtYmVyT2ZCdWJibGVzKC0oYnViYmxlcy5sZW5ndGggLTEgKyBvcnBoYW5zLmxlbmd0aCkpO1xuLy8gICAgQm9hcmQudG90YWxOdW1iZXJPZkJ1YmJsZXMgLT0gKGJ1YmJsZXMubGVuZ3RoICsgb3JwaGFucy5sZW5ndGgpO1xuXG4gICAgLy8gdXBkYXRlIHNjb3JlIGZyb20gdGhlIG9ycGhhbnNcbiAgICBTdGF0ZS51cGRhdGVTY29yZShvcnBoYW5zLmxlbmd0aCAqIDIwKTtcbiAgICBcbiAgICBidWJibGVzLmZvckVhY2goIChidWJibGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBidWJibGVEb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWJibGUucm93ICsgXCJcIiArIGJ1YmJsZS5jb2wpO1xuICAgICAgICAvLyBpZiBpdCB3YXMgdGhlIGxhc3QgYmFsbCBhbmltYXRlZCB0aGVuIHdlIHdhbnQgdG8gZHJvcCBidWJibGVzIGlmIGV4aXN0ZWRcbiAgICAgICAgaWYoKG9ycGhhbnMubGVuZ3RoID4gMCkgJiYgKGluZGV4ID09IGJ1YmJsZXMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICBVSS5hbmltYXRlVmFuaXNoKGJ1YmJsZURvbSwgYnViYmxlLCBVSS5kcm9wQnViYmxlcyhvcnBoYW5zKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIFVJLmFuaW1hdGVWYW5pc2goYnViYmxlRG9tLCBidWJibGUpO1xuICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGdldEFuZ2xlRnJvbURldmljZSAoZGV2aWNlWFkpIHtcbi8vICAgIGFsZXJ0KFwiaW4gdGhlIGdldCBBbmdsZVwiKTtcbiAgICBsZXQgQnViYmxlWFkgPSB7XG4gICAgICAgIHg6IFVJLmN1cnJlbnRCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBVSS5jdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAvMixcbiAgICAgICAgeTogVUkuY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgVUkuY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8yXG4gICAgfTtcbiAgICBcbiAgICBsZXQgZmlyZUFuZ2xlID0gTWF0aC5hdGFuKChkZXZpY2VYWS54IC0gQnViYmxlWFkueCkgLyAoQnViYmxlWFkueSAtIGRldmljZVhZLnkpKTtcbiAgICBcbi8vICAgIGxldCBmaXJlQW5nbGUgPSBNYXRoLmF0YW4yKChkZXZpY2VYWS54IC0gQnViYmxlWFkueCkgLCAoQnViYmxlWFkueSAtIGRldmljZVhZLnkpKTtcblxuICAgIFxuICAgICAvL2lmIHRoZSBwbGF5ZXIgZmlyZWQgdGhlIGJhbGwgYXQgYXByb3hpbWF0bHkgaG9yaXpvbnRhbCBsZXZlbFxuLy8gICAgaWYoZGV2aWNlWFkueSA+IEJ1YmJsZVhZLnkpIHtcbi8vICAgICAgICBmaXJlQW5nbGUgPSBmaXJlQW5nbGUgKyBNYXRoLlBJO1xuLy8gICAgfVxuICAgIFxuICAgIHJldHVybiBmaXJlQW5nbGU7XG59XG5cbiIsImltcG9ydCAqIGFzIEJ1YmJsZSBmcm9tIFwiLi9idWJibGUuanNcIjtcbmltcG9ydCAqIGFzIEJvYXJkIGZyb20gXCIuL01vZGVsL0JvYXJkLmpzXCI7XG5cbmV4cG9ydCBsZXQgbmV3R2FtZURpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRfZ2FtZV9kaWFsb2dcIik7XG5leHBvcnQgbGV0IGN1cnJlbnRCdWJibGU7XG5leHBvcnQgbGV0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZVwiKTtcbmV4cG9ydCBsZXQgbmV3R2FtZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3X2dhbWVfYnV0dG9uXCIpO1xuZXhwb3J0IGxldCB0b3BiYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvcGJhclwiKTtcbmV4cG9ydCBsZXQgZm9vdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb290ZXJcIik7XG5cbmV4cG9ydCBsZXQgYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpO1xuXG5sZXQgc2NvcmVEb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjb3JlXCIpO1xubGV0IHRpbWVEb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRpbWVyXCIpO1xuXG5cbmV4cG9ydCBsZXQgYm9hcmRXaWR0aDtcbmV4cG9ydCBsZXQgYm9hcmRIZWlnaHQ7XG5cbmV4cG9ydCBsZXQgc3ByaXRlUmFkaXVzID0gMDtcbmV4cG9ydCBsZXQgYnViYmxlUmFkaXVzID0gMDtcbmV4cG9ydCBsZXQgdHdvU2lkZXNFbXB0eVNwYWNlID0gMDtcblxuLy8gbnVtYmVyIG9mIGNvbCBpbiB0aGUgYm9hcmRcbmxldCBudW1PZkNvbDtcbi8vIG51bWJlciBvZiByb3dzIGluIHRoZSBib2FyZFxubGV0IG51bU9mUm93O1xuXG5sZXQgYm9hcmRJbml0aWF0ZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICBudW1PZkNvbCA9IEJvYXJkLk5VTV9DT0wgLyAyOyAgXG4gICAgbnVtT2ZSb3cgPSBCb2FyZC5OVU1fUk9XO1xuICAgIGJvYXJkSW5pdGlhdGVkID0gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlRGlhbG9nICgpIHtcbiAgICBuZXdHYW1lRGlhbG9nLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICBuZXdHYW1lRGlhbG9nLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn1cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEJhbGxBbmltYXRpb24gKGZpcmVkQnViYmxlLCBhbmdsZSwgZHVyYXRpb24sIGRpc3RhbmNlLCBhbmltYXRpb25DYWxsYmFjaykge1xuLy8gICAgbGV0IGFuZ2xlID0gZ2V0QW5nbGVGcm9tRGV2aWNlKGRldmljZVhZKTtcbi8vICAgIGxldCBkaXN0YW5jZSA9IDEwMDA7XG4gICAgLy8gbGV0IHVzIGFzc3VtZSB0aGF0IHdlIHdpbGwgZmlyZSB0aGUgYmFsbCBmb3IgMTAwMHB4IGZvciBub3dcbiAgICBsZXQgZGlzdGFuY2VYID0gTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2U7XG4gICAgbGV0IGRpc3RhbmNlWSA9IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgIFxuICAgIGxldCBudW1iZXJPZkl0ZXJhdGlvbnMgPSBNYXRoLmNlaWwoZHVyYXRpb24gLyAxNik7IFxuICAgIGxldCB4RXZlcnlGcmFtZSA9IGRpc3RhbmNlWCAvIG51bWJlck9mSXRlcmF0aW9ucztcbiAgICBsZXQgeUV2ZXJ5RnJhbWUgPSBkaXN0YW5jZVkgLyBudW1iZXJPZkl0ZXJhdGlvbnM7XG4gICAgXG4gICAgICAgIFxuLy8gICAgbGV0IGFuaW1hdGlvbkxvb3AgPSBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAocGFyc2VGbG9hdChmaXJlZEJ1YmJsZS5kb20uc3R5bGUubGVmdCkgKyB4RXZlcnlGcmFtZSkgKyBcInB4XCI7XG4vLyAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRvcCA9IChwYXJzZUZsb2F0KGZpcmVkQnViYmxlLmRvbS5zdHlsZS50b3ApIC0geUV2ZXJ5RnJhbWUpICsgXCJweFwiO1xuLy8gICAgICAgIFxuLy8gICAgICAgIG51bWJlck9mSXRlcmF0aW9ucyAtLTtcbi8vICAgICAgICBpZiAobnVtYmVyT2ZJdGVyYXRpb25zID09PSAwKSB7XG4vLyAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGxvb3BJRCk7XG4vLyAgICAgICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrKCk7XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICBsb29wSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XG4vLyAgICAgICAgfVxuLy8gICAgfVxuLy8gICAgXG4vLyAgICBsZXQgbG9vcElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkxvb3ApO1xuICAgIFxuICAgIGZpcmVkQnViYmxlLmRvbS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrKCk7XG4gICAgICAgIGZpcmVkQnViYmxlLmRvbS5yZW1vdmVFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRyYW5zaXRpb24gPSBcInRyYW5zZm9ybSBcIiArIChkdXJhdGlvbi8xMDAwKSArIFwicyBlYXNlLW91dFwiO1xuICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS50cmFuc2l0aW9uID0gXCItd2Via2l0LXRyYW5zZm9ybSBcIiArIChkdXJhdGlvbi8xMDAwKSArIFwicyBlYXNlLW91dFwiO1xuLy8gICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRyYW5zaXRpb24gPSBcIi13ZWJraXQtdHJhbnNmb3JtIFwiICsgMSArIFwicyBlYXNlLW91dFwiO1xuLy8gICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRyYW5zaXRpb24gPSBcInRyYW5zZm9ybSBcIiArIDEgKyBcInMgZWFzZS1vdXRcIjtcblxuXG4vLyAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRyYW5zaXRpb24gPSBcInRyYW5zZm9ybSBcIiArIDAuNSArIFwicyBsaW5lYXJcIjtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IFwidHJhbnNsYXRlKFwiICsgZGlzdGFuY2VYICsgXCJweCxcIiArICgtZGlzdGFuY2VZICsgc3ByaXRlUmFkaXVzKSArIFwicHgpXCI7XG4gICAgICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIGRpc3RhbmNlWCArIFwicHgsXCIgKyAoLWRpc3RhbmNlWSArIHNwcml0ZVJhZGl1cykgKyBcInB4KVwiOyAgICAgICAgXG4gICAgfSwgMjApO1xuXG5cbn0gICBcbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlTmV4dEJ1YmJsZSgpIHtcbiAgICBpZihjdXJyZW50QnViYmxlKSB7XG4gICAgICAgIFxuICAgIH1cbiAgICBjdXJyZW50QnViYmxlID0gQnViYmxlLmNyZWF0ZSgtMSwgLTEpO1xuICAgIFxuICAgIC8vIG1ha2UgdGhlIG5ldyBidWJibGUgdGhlIGN1cnJlbnQgYnViYmxlLCB0aGVuIGFkZCBpdCB0byB0aGUgZG9tXG4gICAgY3VycmVudEJ1YmJsZS5kb20uY2xhc3NMaXN0LmFkZChcImN1cnJfYnViYmxlXCIpO1xuICAgIFxuLy8gICAgYm9hcmQuYXBwZW5kQ2hpbGQoY3VycmVudEJ1YmJsZS5kb20pOyAgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZSAoKSB7XG4gICAgXG4gICAgbGV0IGdhbWVXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBnYW1lSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgbGV0IHNjYWxlVG9GaXRYID0gZ2FtZVdpZHRoIC8gNzIwOyAvLyB0aGUgZ2FtZSB3aWxsIGJlIHBsYXlhYmxlIGluIHBvcnRyYWl0IG1vZGUsIHNvIDcyMCBmb3IgaG9yaXpvbnRhbCBhbmQgMTI4MCBmb3IgdmVydGljYWxcbiAgICBsZXQgc2NhbGVUb0ZpdFkgPSBnYW1lSGVpZ2h0IC8gMTI4MDtcbiAgICBsZXQgb3B0aW1hbFJhdGlvID0gTWF0aC5taW4oc2NhbGVUb0ZpdFgsIHNjYWxlVG9GaXRZKTtcbi8vICAgIHZhciBvcHRpbWFsUmF0aW8gPSBNYXRoLm1heChzY2FsZVRvRml0WCwgc2NhbGVUb0ZpdFkpO1xuXG4gICAgYm9hcmRXaWR0aCA9ICg3MjAgKiBvcHRpbWFsUmF0aW8pO1xuICAgIGJvYXJkSGVpZ2h0ID0gKCgxMjgwICogb3B0aW1hbFJhdGlvKSAtICh0b3BiYXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgZm9vdGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCkpO1xuICAgIGJ1YmJsZVJhZGl1cyA9IChib2FyZFdpZHRoIC8gKG51bU9mQ29sICsxKSkgLyAyO1xuICAgIHNwcml0ZVJhZGl1cyA9IGJ1YmJsZVJhZGl1cyAvIDAuODg7XG4gICAgXG4gICAgLy8gdXBkYXRlIHRoZSBudW1iZXIgb2YgYWxsb3dlZCByb3dzIHRvIGRldGVjdCBnYW1lIG92ZXJcbiAgICBCb2FyZC5zZXROdW1iZXJPZkFsbG93ZWRSb3dzKE1hdGguZmxvb3IoYm9hcmRIZWlnaHQgLyAoYnViYmxlUmFkaXVzKjIpICkpO1xuICAgIFxuICAgIGJvYXJkLnN0eWxlLndpZHRoID0gYm9hcmRXaWR0aCArIFwicHhcIjtcbiAgICBib2FyZC5zdHlsZS5oZWlnaHQgPSBib2FyZEhlaWdodCArIFwicHhcIjtcbiAgICBcbiAgICBcbiAgICBcbi8vICAgIGN1cnJlbnRCdWJibGUubGVmdCA9ICgoYm9hcmRXaWR0aCAvIDIpIC0gKGJ1YmJsZVJhZGl1cykpICsgXCJweFwiO1xuLy8gICAgY3VycmVudEJ1YmJsZS50b3AgPSAoYm9hcmRIZWlnaHQgLSAoYnViYmxlUmFkaXVzICogMykpICsgXCJweFwiO1xuICAgIFxuICAgIGRyYXdCb2FyZCgpO1xuLy8gICAgbGV0IGJ1YmJsZVdpZHRoID0gKG5ld0JvYXJkV2lkdGggLyBudW1PZkNvbCArMyk7XG4vLyAgICAvLyB1cGRhdGUgZ2xvYmFsIGJ1YmJsZVJhZGl1cyB2YXJpYWJsZVxuLy8gICAgXG4vLy8vICAgIGNzc1JlbmRlcihidWJibGVXaWR0aCk7XG4vLyAgICAvLyByZXNpemUgdGhlIGN1cnJlbnRCdWJibGVcbi8vICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbi8vLy8gICAgICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAoIChuZXdCb2FyZFdpZHRoIC8gMikgLSAoYnViYmxlV2lkdGggLzIpICkgKyBcInB4XCI7XG4vLyAgICB9XG5cbiAgICBcblxufVxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIHNldE5ld0J1YmJsZVBvc2l0aW9uKCkge1xuICAgIGxldCB3aWR0aCA9IChzcHJpdGVSYWRpdXMgKiAyKSArIFwicHhcIjtcbiAgICBsZXQgbGVmdCA9ICgoYm9hcmRXaWR0aCAvIDIpIC0gKHNwcml0ZVJhZGl1cykpICsgXCJweFwiO1xuICAgIGxldCB0b3AgPSAoYm9hcmRIZWlnaHQgLSAoc3ByaXRlUmFkaXVzICogMykpICsgXCJweFwiO1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiY3VycmVudFwiKTtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS5sZWZ0ID0gbGVmdDtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS50b3AgPSB0b3A7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS5oZWlnaHQgPSB3aWR0aDtcbi8vICAgIGN1cnJlbnRCdWJibGUuZG9tLmNsYXNzTGlzdC5hZGQoXCJjdXJyX2J1YmJsZVwiKTtcbn1cbiAgICBcblxuZXhwb3J0IGZ1bmN0aW9uIGRyb3BCdWJibGVzKG9ycGhhbkJ1YmJsZXMpIHtcbiAgICBsZXQgcGFydGlhbEFwcGxpY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgb3JwaGFuQnViYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ1YmJsZSA9IG9ycGhhbkJ1YmJsZXNbaV07XG4gICAgICAgICAgICBsZXQgYnViYmxlRG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYnViYmxlLnJvdyArIFwiXCIgKyBidWJibGUuY29sKTtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQm9hcmQuZGVsZXRlQnViYmxlKGJ1YmJsZSlcbiAgICAgICAgICAgICAgICBidWJibGVEb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRyYW5zaXRpb25lbmRcIik7XG4gICAgICAgICAgICAgICAgYnViYmxlRG9tLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgXG4vLyAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS50cmFuc2l0aW9uID0gXCJ0cmFuc2Zvcm0gXCIgKyAxLjIgKyBcInMgY3ViaWMtYmV6aWVyKDAuNTksLTAuMDUsIDAuNzQsIDAuMDUpXCI7XG4gICAgICAgICAgICBidWJibGVEb20uc3R5bGUudHJhbnNpdGlvbiA9IFwiLXdlYmtpdC10cmFuc2Zvcm0gXCIgKyAwLjggKyBcInMgY3ViaWMtYmV6aWVyKDAuNTksLTAuMDUsIDAuNzQsIDAuMDUpXCI7XG5cblxuICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IFwidHJhbnNsYXRlKFwiICsgMCArIFwicHgsXCIgKyAxNTAwICsgXCJweClcIjtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIDAgKyBcInB4LFwiICsgMTUwMCArIFwicHgpXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHBhcnRpYWxBcHBsaWNhdGlvbjtcbn1cblxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIGFuaW1hdGVWYW5pc2ggKGJ1YmJsZURvbSwgYnViYmxlLCBhbmltYXRlQ2FsbGJhY2spIHtcbiAgICBsZXQgbnVtT2ZJdGVyYXRpb24gPSAxNTtcbiAgICBsZXQgY291bnRlciA9IG51bU9mSXRlcmF0aW9uO1xuICAgIFxuICAgIGxldCBhbmltYXRlQnViYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZihjb3VudGVyID09IG51bU9mSXRlcmF0aW9uKSB7XG4gICAgICAgICAgICBidWJibGVEb20uc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gXCIzMy4zMzMzMzMzMyUgXCIgKyBidWJibGUuZ2V0SGVpZ2h0UG9zRnJvbVR5cGUoKSArIFwiJVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY291bnRlciA9PSBNYXRoLmZsb29yKG51bU9mSXRlcmF0aW9uICogMi8zKSkge1xuICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiNjYuNjY2NjY2NjclXCIgKyBidWJibGUuZ2V0SGVpZ2h0UG9zRnJvbVR5cGUoKSArIFwiJVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY291bnRlciA9PSBNYXRoLmZsb29yKG51bU9mSXRlcmF0aW9uICogMS8zKSkge1xuICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiMTAwJVwiICsgYnViYmxlLmdldEhlaWdodFBvc0Zyb21UeXBlKCkgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgICBpZihjb3VudGVyID09IDApIHtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5yZW1vdmUoKTtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGxvb3BJRCk7XG4gICAgICAgICAgICBpZihhbmltYXRlQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCB3YXMgdGhlIGxhc3QgYnViYmxlIHRvIGJlIGFuaW1hdGVkIHRoZW4gd2Ugd2FudCB0byBhbmltYXRlIG9ycGhhbnMgaWYgdGhlIGV4aXN0XG4gICAgICAgICAgICAgICAgYW5pbWF0ZUNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb3VudGVyIC0tO1xuICAgICAgICAgICAgbG9vcElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVCdWJibGUpOyAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSAgIFxuICAgIFxuICAgIGxldCBsb29wSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZUJ1YmJsZSk7XG59XG5cbiAgICBcbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBkcmF3Qm9hcmQoKSB7XG4gICAgbGV0IGJvYXJkQXJyYXkgPSBCb2FyZC5nZXRCb2FyZEFycmF5KCk7XG4vLyAgICBsZXQgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgbGV0IHdpZHRoID0gc3ByaXRlUmFkaXVzICogMjtcbiAgICBsZXQgaHRtbFN0cmluZyA9IFwiXCI7XG4gICAgXG4gICAgaWYoY3VycmVudEJ1YmJsZSkge1xuICAgICAgICBsZXQgbGVmdCA9ICgoYm9hcmRXaWR0aCAvIDIpIC0gKHNwcml0ZVJhZGl1cykpICsgXCJweFwiO1xuICAgICAgICBsZXQgdG9wID0gKGJvYXJkSGVpZ2h0IC0gKHNwcml0ZVJhZGl1cyAqIDMpKSArIFwicHhcIjtcbiAgICAgICAgaHRtbFN0cmluZyArPSBcIjxkaXYgaWQ9J2N1cnJlbnQnIGNsYXNzPSdidWJibGUgYnViYmxlXCIgKyBjdXJyZW50QnViYmxlLnR5cGUgKyBcIicgc3R5bGU9JyB3aWR0aDogXCIgKyB3aWR0aCArIFwicHg7IGhlaWdodDogXCIgK1xuICAgICAgICAgICAgICAgICAgICB3aWR0aCArIFwicHg7XCIgKyBcImxlZnQ6IFwiICsgKChib2FyZFdpZHRoIC8gMikgLSAoc3ByaXRlUmFkaXVzKSkgKyBcInB4O1wiICsgXCIgdG9wOiBcIiArXG4gICAgICAgICAgICAgICAgICAgIChib2FyZEhlaWdodCAtIChzcHJpdGVSYWRpdXMgKiAzKSkgKyBcInB4OycgPiA8L2Rpdj5cIjtcbiAgICAgICAgXG4vLyAgICAgICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUubGVmdCA9ICggKG5ld0JvYXJkV2lkdGggLyAyKSAtIChidWJibGVXaWR0aCAvMikgKSArIFwicHhcIjtcbiAgICB9XG4gICAgXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBCb2FyZC5OVU1fUk9XOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBudW1PZkNvbCAqIDI7IGorKykge1xuICAgICAgICAgICAgbGV0IGJ1YmJsZSA9IGJvYXJkQXJyYXlbaV1bal07XG4gICAgICAgICAgICAvLyB0aGVyZSBleGlzdCBhIGJ1YmJsZSBvbiB0aGF0IGluZGV4IChldmVuIHJvd3MgaGF2ZSBidWJibGUgb24gdGhlIG9kZCBjb2x1bW4gaW5kaWNpZXMpXG4gICAgICAgICAgICBpZihidWJibGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgbGVmdCA9IChqICogYnViYmxlUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBsZXQgdG9wID0gKGkgKiBidWJibGVSYWRpdXMgKiAyIC0gKHNwcml0ZVJhZGl1cyAqIDAuMTUgKiBpKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjb29yZHMgaW4gdGhlIGJ1YmJsZSBvYmplY3QgKHRoZXNlIGNvb3JkcyBhcmUgY29vcmRzIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGJ1YmJsZSlcbiAgICAgICAgICAgICAgICBidWJibGUuc2V0Q29vcmRzKGxlZnQgKyAgYm9hcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGJ1YmJsZVJhZGl1cywgdG9wICsgYm9hcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgYnViYmxlUmFkaXVzKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBodG1sU3RyaW5nICs9IFwiPGRpdiBpZD0nXCIgKyBpICsgXCJcIiArIGogKyBcIicgY2xhc3M9J2J1YmJsZSBidWJibGVcIiArIGJ1YmJsZS50eXBlICsgXCInIHN0eWxlPSdsZWZ0OiBcIiArIGxlZnQgKyBcInB4OyB0b3A6IFwiICsgdG9wICtcbiAgICAgICAgICAgICAgICAgICAgXCJweDsgd2lkdGg6IFwiICsgd2lkdGggKyBcInB4O2hlaWdodDogXCIgKyB3aWR0aCArIFwicHg7JyA+PC9kaXY+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBib2FyZC5pbm5lckhUTUwgPSBodG1sU3RyaW5nO1xuICAgIGN1cnJlbnRCdWJibGUuc2V0RE9NKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VycmVudFwiKSk7XG4vLyAgICBib2FyZC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4vLyAgICBjc3NSZW5kZXIoYnViYmxlUmFkaXVzICogMik7XG4vLyAgICBib2FyZEluaXRpYXRlZCA9IHRydWU7XG59XG4gICAgXG4vKlxuPT09PT09PT09PT09PT09PT09PT09PT09PVxuUmVuZGVyIHRpbWVyIGFuZCBzY29yZVxuPT09PT09PT09PT09PT09PT09PT09PT09PVxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclRpbWUodGltZXJTdGF0ZSkge1xuICAgIHRpbWVEb20udGV4dENvbnRlbnQgPSBcIlJlbWFpbmluZyB0aW1lIFwiICsgdGltZXJTdGF0ZS5taW4gKyBcIjpcIiArIHRpbWVyU3RhdGUuc2VjO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyU2NvcmUoc2NvcmVTdGF0ZSkge1xuICAgIHNjb3JlRG9tLnRleHRDb250ZW50ID0gXCJTY29yZTogXCIgKyBzY29yZVN0YXRlO1xufVxuXG4iXX0=
