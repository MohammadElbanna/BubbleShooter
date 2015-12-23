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

function init(numRows, numCols) {
    exports.NUM_ROW = NUM_ROW = numRows;
    exports.NUM_COL = NUM_COL = numCols;

    createBoardArray();
}

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

},{"./../bubble.js":3,"./../ui.js":6}],2:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _gameJs = require("./game.js");

var game = _interopRequireWildcard(_gameJs);

game.init();

},{"./game.js":5}],3:[function(require,module,exports){
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

},{"./ui.js":6}],4:[function(require,module,exports){
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

},{"./Model/Board.js":1,"./ui.js":6}],5:[function(require,module,exports){
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

},{"./Model/Board.js":1,"./bubble.js":3,"./collisionDetector.js":4,"./ui.js":6}],6:[function(require,module,exports){
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
    }, false);
    firedBubble.dom.style.transition = "transform " + duration / 1000 + "s ease-out";
    firedBubble.dom.style.transition = "-webkit-transform " + duration / 1000 + "s ease-out";
    //    firedBubble.dom.style.transition = "-webkit-transform " + 1 + "s ease-out";
    //    firedBubble.dom.style.transition = "transform " + 1 + "s ease-out";

    //        firedBubble.dom.style.transition = "transform " + 0.5 + "s linear";
    setTimeout(function () {
        firedBubble.dom.style.webkitTransform = "translate(" + distanceX + "px," + (-distanceY + spriteRadius) + "px)";
        firedBubble.dom.style.transform = "translate(" + distanceX + "px," + (-distanceY + spriteRadius) + "px)";
    }, 50);
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
                bubbleDom.remove();
            }, false);

            //            bubbleDom.style.transition = "transform " + 1.2 + "s cubic-bezier(0.59,-0.05, 0.74, 0.05)";
            bubbleDom.style.transition = "-webkit-transform " + 0.8 + "s cubic-bezier(0.59,-0.05, 0.74, 0.05)";

            bubbleDom.style.transform = "translate(" + 100 + "px," + 1500 + "px)";
            bubbleDom.style.webkitTransform = "translate(" + 0 + "px," + 1500 + "px)";
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

},{"./Model/Board.js":1,"./bubble.js":3}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvTW9kZWwvQm9hcmQuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvYXBwLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2J1YmJsZS5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9jb2xsaXNpb25EZXRlY3Rvci5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9nYW1lLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL3VpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozt3QkNBd0IsZ0JBQWdCOztJQUE1QixNQUFNOztvQkFDRSxZQUFZOztJQUFwQixFQUFFOztBQUVQLElBQUksT0FBTyxZQUFBLENBQUU7O0FBQ2IsSUFBSSxPQUFPLFlBQUEsQ0FBQzs7O0FBRW5CLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsSUFBSSxLQUFLLEdBQUcsU0FBUixLQUFLLEdBQWU7QUFDcEIsUUFBSSxXQUFXLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztDQUV6QyxDQUFBOztBQUVNLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFhLE1BQU0sRUFBRSxNQUFNLEVBQUU7O0FBRTdDLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEIsVUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDNUQsUUFBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTs7S0FFbkI7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LEtBQUssR0FBRyxhQUFhLEdBQUcsS0FBSyxHQUFHLGNBQWMsQ0FBQzthQUN0RTtTQUNKO0tBQ0o7O0FBRUQsU0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsaUJBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7O0NBSTVEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIEJ1YmJsZSBmcm9tIFwiLi8uLi9idWJibGUuanNcIjtcbmltcG9ydCAqIGFzIFVJIGZyb20gXCIuLy4uL3VpLmpzXCI7XG5cbmV4cG9ydCBsZXQgTlVNX1JPVyA7XG5leHBvcnQgbGV0IE5VTV9DT0w7XG5cbmxldCBib2FyZEFycmF5ID0gW107XG5cbmxldCBCb2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnViYmxlQXJyYXkgPSBjcmVhdGVCdWJibGVBcnJheSgpO1xuICAgIFxufVxuXG5leHBvcnQgbGV0IGFkZEJ1YmJsZSA9IGZ1bmN0aW9uIChidWJibGUsIGNvb3Jkcykge1xuLy8gICAgbGV0IHJvd051bSA9IE1hdGguZmxvb3IoY29vcmRzLnkgLyAoVUkuYnViYmxlUmFkaXVzICogMikpO1xuICAgIGxldCByb3dOdW0gPSBjb29yZHMueTtcbiAgICBjb29yZHMueCA9IGNvb3Jkcy54IC0gVUkuYm9hcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICBpZihyb3dOdW0gJSAyID09IDApIHtcbi8vICAgICAgICBjb29yZHMueCA9IGNvb3Jkcy54IC0gVUkuc3ByaXRlUmFkaXVzIC8yXG4gICAgfVxuICAgIFxuICAgIGxldCBjb2xOdW07XG4vLyAgICBsZXQgY29sTnVtID0gTWF0aC5yb3VuZChjb29yZHMueCAvIChVSS5idWJibGVSYWRpdXMgKiAyKSk7IFxuLy8gICAgY29sTnVtIC09IDE7XG4vLyAgICBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvbE51bSAvIDIpICogMjtcbiAgICBcbiAgICBpZiAocm93TnVtICUgMiA9PT0gMCkge1xuICAgICBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvb3Jkcy54IC8gKFVJLmJ1YmJsZVJhZGl1cyAqIDIpKTsgXG5cbiAgICAgICAgY29sTnVtID0gKGNvbE51bSAqIDIpIC0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbE51bSA9IE1hdGguZmxvb3IoY29vcmRzLnggLyAoVUkuYnViYmxlUmFkaXVzICogMikpOyBcblxuICAgICAgICBjb2xOdW0gPSAoY29sTnVtICogMikgIDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFib2FyZEFycmF5W3Jvd051bV0pIHtcbiAgICAgICAgYm9hcmRBcnJheVtyb3dOdW1dID0gW107XG4gICAgICAgIE5VTV9ST1cgKys7XG4gICAgfVxuLy8gICAgZWxzZSBpZiAoYm9hcmRBcnJheVtyb3dOdW1dW2NvbE51bV0gIT0gZmFsc2UpIHtcbi8vICAgICAgICBiXG4vLyAgICB9XG4gICAgYnViYmxlLnNldENvbChjb2xOdW0pO1xuICAgIGJ1YmJsZS5zZXRSb3cocm93TnVtKTtcbiAgICBib2FyZEFycmF5W3Jvd051bV1bY29sTnVtXSA9IGJ1YmJsZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCAobnVtUm93cywgbnVtQ29scykge1xuICAgIE5VTV9ST1cgPSBudW1Sb3dzO1xuICAgIE5VTV9DT0wgPSBudW1Db2xzO1xuICAgIFxuICAgIGNyZWF0ZUJvYXJkQXJyYXkoKTsgICAgXG59XG5cbmV4cG9ydCBsZXQgZ2V0Qm9hcmRBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBib2FyZEFycmF5O1xufSBcblxuXG5cbi8vIHJldHVybiB0aGUgYnViYmxlIGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uIG9yIG51bGwgaWYgaXQgZG9lc24ndCBleGlzdFxuZnVuY3Rpb24gZ2V0QnViYmxlQXQocm93LCBjb2wpIHtcbiAgICBpZiAoIWJvYXJkQXJyYXlbcm93XSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGJvYXJkQXJyYXlbcm93XVtjb2xdO1xufVxuXG4vLyBnZXQgdGhlIGJ1YmJsZXMgdGhhdCBzdXJyb3VuZCBhIGJ1YmJsZVxuZnVuY3Rpb24gZ2V0QnViYmxlQXJvdW5kKHJvdywgY29sKSB7XG4gICAgdmFyIGJ1YmJsZUxpc3QgPSBbXTtcbiAgICBmb3IobGV0IGkgPSByb3cgLTE7IGkgPD0gcm93ICsgMTsgaSsrKSB7XG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBidWJibGVzIGluIHRoYXQgcm93XG4gICAgICAgIGZvcihsZXQgaiA9IGNvbCAtIDI7IGogPD0gY29sICsgMjsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gZ2V0QnViYmxlQXQoaSwgaik7XG4gICAgICAgICAgICBpZiAoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgYnViYmxlTGlzdC5wdXNoKGJ1YmJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJ1YmJsZUxpc3Q7XG59XG5cbi8vIGdldCB0aGUgY29ubmVjdGVkIGdyb3VwIG9mIGJ1YmJsZXMgKHRoYXQgc2hhcmUgdGhlIHNhbWUgY29sb3IsIG9yIG5vdCkgc3RhcnRpbmcgZnJvbSB0aGlzIGJ1YmJsZVxuZXhwb3J0IGZ1bmN0aW9uIGdldEdyb3VwIChidWJibGUsIGJ1YmJsZXNGb3VuZCwgZGlmZmVyZW50Q29sb3IpIHtcbiAgICBsZXQgY3VycmVudFJvdyA9IGJ1YmJsZS5yb3c7XG4gICAgaWYoIWJ1YmJsZXNGb3VuZFtjdXJyZW50Um93XSkge1xuICAgICAgICBidWJibGVzRm91bmRbY3VycmVudFJvd10gPSB7fTtcbiAgICB9XG4gICAgaWYoIWJ1YmJsZXNGb3VuZC5saXN0KSB7XG4gICAgICAgIGJ1YmJsZXNGb3VuZC5saXN0ID0gW107XG4gICAgfVxuICAgIGlmKGJ1YmJsZXNGb3VuZFtidWJibGUucm93XVtidWJibGUuY29sXSkge1xuICAgICAgICAvLyB3ZSBlbmQgdGhpcyBicmFuY2ggb2YgcmVjdXJzaW9uIGhlcmUgYmVjYXVzZSB3ZSd2ZSBiZWVuIHRvIHRoaXMgYnViYmxlIGJlZm9yZVxuICAgICAgICByZXR1cm4gYnViYmxlc0ZvdW5kO1xuICAgIH1cbiAgICBcbiAgICAvLyBhZGQgdGhlIGJ1YmJsZSB0byB0aGUgMkQgYXJyYXlcbiAgICBidWJibGVzRm91bmRbYnViYmxlLnJvd11bYnViYmxlLmNvbF0gPSBidWJibGU7XG4gICAgLy8gcHVzaCB0aGUgYnViYmxlIHRvIHRoZSBsaW5lYXIgbGlzdFxuICAgIGJ1YmJsZXNGb3VuZC5saXN0LnB1c2goYnViYmxlKTtcbiAgICAvLyBnZXQgYSBsaXN0IG9mIGJ1YmJsZXMgdGhhdCBzdXJyb3VuZCB0aGlzIGJ1YmJsZSBhbmQgYXJlIG9mIHRoZSBzYW1lIGNvbG9yXG4gICAgbGV0IHN1cnJvdW5kaW5nID0gZ2V0QnViYmxlQXJvdW5kKGJ1YmJsZS5yb3csIGJ1YmJsZS5jb2wpO1xuICAgIC8vIGZvciBldmVyeSBzdXJyb3VuZGluZyBidWJibGUgcmVjdXJzaXZlbHkgY2FsbCB0aGlzIGZ1bmN0aW9uIGFnYWluXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHN1cnJvdW5kaW5nLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmKHN1cnJvdW5kaW5nW2ldLnR5cGUgPT09IGJ1YmJsZS50eXBlIHx8IGRpZmZlcmVudENvbG9yKSB7XG4gICAgICAgICAgICBidWJibGVzRm91bmQgPSBnZXRHcm91cChzdXJyb3VuZGluZ1tpXSwgYnViYmxlc0ZvdW5kLCBkaWZmZXJlbnRDb2xvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGJ1YmJsZXNGb3VuZDtcbn1cbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBmaW5kT3JwaGFucyAoKSB7XG4gICAgbGV0IGNvbm5lY3RlZCA9IFtdO1xuICAgIGxldCBncm91cHMgPSBbXTtcbiAgICBsZXQgb3JwaGFucyA9IFtdO1xuICAgIC8vIGluaXRpYWxpemUgdGhlIHJvd3Mgb2YgdGhlIGNvbm5lY3RlZFxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBib2FyZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbm5lY3RlZFtpXSA9IFtdO1xuICAgIH1cbiAgICAvLyBsb29wIG9uIHRoZSBmaXJzdCByb3csIGJlY2F1c2UgaXQgc2hvdWxkIGJlIHRoZSByb290IG9mIGV2ZXJ5IGNvbm5lY3RlZCBncm91cFxuICAgIC8vIGluaXRpYWxseSBldmVyeXRoaW5nIGlzIE5PVCBjb25uZWN0ZWRcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYm9hcmRBcnJheVswXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgYnViYmxlID0gYm9hcmRBcnJheVswXVtpXTtcbiAgICAgICAgaWYoYnViYmxlICYmICFjb25uZWN0ZWRbMF1baV0pIHtcbiAgICAgICAgICAgIC8vIGhlcmUgd2UgcGFzcyB0cnVlLCBiZWNhdXNlIHdlIHdhbnQgdG8gbWF0Y2ggZm9yIGFueSBjb2xvclxuICAgICAgICAgICAgbGV0IGdyb3VwID0gZ2V0R3JvdXAoYnViYmxlLCB7fSwgdHJ1ZSk7XG4gICAgICAgICAgICBncm91cC5saXN0LmZvckVhY2goaXRlbSA9PiBjb25uZWN0ZWRbaXRlbS5yb3ddW2l0ZW0uY29sXSA9IHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIGxvb3AgdGhyb3VnaCBhbGwgdGhlIGJvYXJkIHRvIGRldGVjdCBvcnBoYW4gYnViYmxlcyBhZnRlciB3ZSBkZWNpZGVkIGNvbm5lY3RlZCBidWJibGVzIHdpdGggdGhlIGZpcnN0IHJvd1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBib2FyZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBzdGFydENvbCA9IGklMiA9PSAwID8gMSA6IDA7XG4gICAgICAgIGZvcihsZXQgaiA9IHN0YXJ0Q29sOyBqIDwgTlVNX0NPTDsgaiArPSAyKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gZ2V0QnViYmxlQXQoaSwgaik7XG4gICAgICAgICAgICBpZihidWJibGUgJiYgIWNvbm5lY3RlZFtpXVtqXSkge1xuICAgICAgICAgICAgICAgIG9ycGhhbnMucHVzaChidWJibGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBvcnBoYW5zO1xufVxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUJ1YmJsZShidWJibGUpIHtcbiAgICBkZWxldGUgYm9hcmRBcnJheVtidWJibGUucm93XVtidWJibGUuY29sXTtcbn1cblxuXG5sZXQgY3JlYXRlQm9hcmRBcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgTlVNX1JPVzsgaSsrKSB7XG4gICAgICAgIGxldCBzdGFydENvbCA9IGklMiA9PSAwID8gMSA6IDA7XG4gICAgICAgIGJvYXJkQXJyYXlbaV0gPSBbXTtcbiAgICAgICAgXG4gICAgICAgIGZvciAobGV0IGogPSBzdGFydENvbCA7IGogPCBOVU1fQ09MOyBqKz0gMikge1xuICAgICAgICAgICAgbGV0IGJ1YmJsZSA9IEJ1YmJsZS5jcmVhdGUoaSwgaik7XG4gICAgICAgICAgICBib2FyZEFycmF5W2ldW2pdID0gYnViYmxlO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSBcIi4vZ2FtZS5qc1wiO1xuXG5nYW1lLmluaXQoKTsiLCJpbXBvcnQgKiBhcyBVSSBmcm9tIFwiLi91aS5qc1wiO1xuXG5mdW5jdGlvbiBCdWJibGUgKGRvbUVsZW1lbnQsIHJvdywgY29sLCB0eXBlKSB7XG4gICAgZG9tRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIpO1xuICAgIGRvbUVsZW1lbnQuY2xhc3NMaXN0LmFkZChcImJ1YmJsZVwiICsgdHlwZSk7XG4gICAgdGhpcy5kb20gPSBkb21FbGVtZW50O1xuICAgIHRoaXMuY29sID0gY29sO1xuICAgIHRoaXMucm93ID0gcm93O1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0VHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRET00gPSBmdW5jdGlvbiAobmV3RG9tKSB7XG4gICAgdGhpcy5kb20gPSBuZXdEb207XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0Q29vcmRzID0gZnVuY3Rpb24gKGxlZnQsIHRvcCkge1xuICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgdGhpcy50b3AgPSB0b3A7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0Q29sID0gZnVuY3Rpb24oY29sKSB7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuc2V0Um93ID0gZnVuY3Rpb24gKHJvdykge1xuICAgIHRoaXMucm93ID0gcm93O1xufVxuXG5CdWJibGUucHJvdG90eXBlLmdldENvb3JkcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBsZWZ0OiB0aGlzLmxlZnQsXG4gICAgICAgIHRvcDogdGhpcy50b3BcbiAgICB9O1xufVxuXG5CdWJibGUucHJvdG90eXBlLmNoYW5nZVR5cGUgPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIHRoaXMuZG9tLmNsYXNzTGlzdC5yZW1vdmUoXCJidWJibGVcIiArIHRoaXMudHlwZSk7XG4gICAgaWYgKHR5cGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0eXBlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNCk7XG4gICAgfVxuICAgIHRoaXMuc2V0VHlwZSh0eXBlKTtcbiAgICB0aGlzLmRvbS5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIgKyB0eXBlKTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5nZXRIZWlnaHRQb3NGcm9tVHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy50eXBlID09IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmICh0aGlzLnR5cGUgPT0gMSkge1xuICAgICAgICByZXR1cm4gMzMuMzMzMzMzMzM7XG4gICAgfVxuICAgIGlmICh0aGlzLnR5cGUgPT0gMikge1xuICAgICAgICByZXR1cm4gNjYuNjY2NjY2Njc7XG4gICAgfVxuICAgIGlmICh0aGlzLnR5cGUgPT0gMykge1xuICAgICAgICByZXR1cm4gMTAwO1xuICAgIH1cbn1cblxuZXhwb3J0IGxldCBjcmVhdGUgPSBmdW5jdGlvbiAocm93LCBjb2wsIHR5cGUpIHtcbiAgICBsZXQgYnViYmxlRE9NID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHR5cGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICB9XG4gICAgbGV0IG5ld0J1YmJsZSA9IG5ldyBCdWJibGUoYnViYmxlRE9NLCByb3csIGNvbCwgdHlwZSk7XG4gICAgXG4gICAgcmV0dXJuIG5ld0J1YmJsZTtcbiAgICBcbn1cblxuZXhwb3J0IGxldCBkZWVwQ29weSA9IGZ1bmN0aW9uIChjb3BpZWRCdWJibGUpIHtcbiAgICBsZXQgbmV3QnViYmxlRG9tID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUubGVmdCA9IGNvcGllZEJ1YmJsZS5kb20uc3R5bGUubGVmdDtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUudG9wID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS50b3A7XG4gICAgbmV3QnViYmxlRG9tLnN0eWxlLndpZHRoID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS53aWR0aDtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUuaGVpZ2h0ID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS5oZWlnaHQ7XG4gICAgXG4gICAgcmV0dXJuIG5ldyBCdWJibGUgKG5ld0J1YmJsZURvbSwgLTEsIC0xLCBjb3BpZWRCdWJibGUudHlwZSk7XG59IiwiaW1wb3J0ICogYXMgQm9hcmQgZnJvbSBcIi4vTW9kZWwvQm9hcmQuanNcIjtcbmltcG9ydCAqIGFzIFVJIGZyb20gXCIuL3VpLmpzXCI7XG5cbmxldCBib2FyZEFycmF5ID0gQm9hcmQuZ2V0Qm9hcmRBcnJheSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZEludGVyc2VjdGlvbihhbmdsZSwgY3VyckJ1YmJsZSkge1xuICAgIGxldCBzdGFydENlbnRlclBvcyA9IHtcbiAgICAgICAgbGVmdDogY3VyckJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIFVJLnNwcml0ZVJhZGl1cyxcbiAgICAgICAgdG9wOiBjdXJyQnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBVSS5zcHJpdGVSYWRpdXNcbiAgICB9XG4gICAgXG4gICAgLy8gYW4gb2JqZWN0IHRoYXQgaG9sZHMgc29tZSBkYXRhIG9uIGEgY29sbGlzaW9uIGlmIGV4aXN0c1xuICAgIGxldCBjb2xsaXNpb24gPSBudWxsO1xuICAgIFxuICAgIGxldCBkeCA9IE1hdGguc2luKGFuZ2xlKTtcbiAgICBsZXQgZHkgPSAtTWF0aC5jb3MoYW5nbGUpO1xuICAgIFxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBCb2FyZC5OVU1fUk9XOyBpKyspIHtcbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBCb2FyZC5OVU1fQ09MIDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gYm9hcmRBcnJheVtpXVtqXTtcbiAgICAgICAgICAgIGlmKGJ1YmJsZSkge1xuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgY29vcmRzIG9mIHRoZSBjdXJyZW50IGJ1YmJsZVxuICAgICAgICAgICAgICAgIGxldCBidWJibGVDb29yZHMgPSBidWJibGUuZ2V0Q29vcmRzKCk7XG4gICAgICAgICAgICAgICAgbGV0IGRpc3RUb0J1YmJsZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCAtIGJ1YmJsZUNvb3Jkcy5sZWZ0LFxuICAgICAgICAgICAgICAgICAgICB5OiBzdGFydENlbnRlclBvcy50b3AgLSBidWJibGVDb29yZHMudG9wXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCB0ID0gZHggKiBkaXN0VG9CdWJibGUueCArIGR5ICogZGlzdFRvQnViYmxlLnk7XG4gICAgICAgICAgICAgICAgLy8gXG4gICAgICAgICAgICAgICAgbGV0IGV4ID0gLXQgKiBkeCArIHN0YXJ0Q2VudGVyUG9zLmxlZnQ7XG4gICAgICAgICAgICAgICAgbGV0IGV5ID0gLXQgKiBkeSArIHN0YXJ0Q2VudGVyUG9zLnRvcDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgZGlzdEVDID0gTWF0aC5zcXJ0KE1hdGgucG93KChleCAtIGJ1YmJsZUNvb3Jkcy5sZWZ0KSwgMikgLSBNYXRoLnBvdygoZXkgLSBidWJibGVDb29yZHMudG9wKSwgMikpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwcmVwZW5kaWN1bGFyIGRpc3RhbmNlIGJldHdlZW4gdGhlIHRyYWplY3RvcnkgYW5kIHRoZSBjZW50ZXIgb2YgdGhlIGNoZWNrZWQgb3V0IGJ1YmJsZSBpcyBncmVhdGVyIHRoYW4gMlIsIHRoZW4gTk8gY29sbGlzaW9uXG4gICAgICAgICAgICAgICAgaWYgKGRpc3RFQyA8IFVJLmJ1YmJsZVJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZHQgPSBNYXRoLnNxcnQoTWF0aC5wb3coVUkuYnViYmxlUmFkaXVzLCAyKSAtIE1hdGgucG93KGRpc3RFQywgMikpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgb2Zmc2V0MSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6ICh0IC0gZHQpICogZHgsXG4gICAgICAgICAgICAgICAgICAgICAgICB5OiAtKHQgLSBkdCkgKiBkeVxuICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQyID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogKHQgKyBkdCkgKiBkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IC0odCArIGR0KSAqIGR5XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdFRvRmlyc3RQb2ludCA9IE1hdGguc3FydChNYXRoLnBvdyhvZmZzZXQxLngsIDIpICsgTWF0aC5wb3cob2Zmc2V0MS55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBsZXQgZGlzdFRvU2Vjb25kUG9pbnQgPSBNYXRoLnNxcnQoTWF0aC5wb3cob2Zmc2V0Mi54ICwyKSArIE1hdGgucG93KG9mZnNldDIueSwgMikpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9sZHMgdGhlIG5ldyBkaXN0YW5jZSBmcm9tIHRoZSBzdGFydGluZyBwb2ludCBvZiBmaXJpbmcgYSBiYWxsIHRvIHRoZSBjb2xsaXNvbiBwb2ludCB0IFxuICAgICAgICAgICAgICAgICAgICBsZXQgbmV3RGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIC8vIGhvbGRzIHRoZSBjb2xsaXNpb24gcG9pbnQgY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbGxpc2lvbkNvb3JkcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpc3RUb0ZpcnN0UG9pbnQgPCBkaXN0VG9TZWNvbmRQb2ludCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RGlzdGFuY2UgPSBkaXN0VG9GaXJzdFBvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uQ29vcmRzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHN0YXJ0Q2VudGVyUG9zLmxlZnQgKyBvZmZzZXQxLngsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBzdGFydENlbnRlclBvcy50b3AgKyBvZmZzZXQxLnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBidWJibGUucm93ICsgMVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEaXN0YW5jZSA9IGRpc3RUb1NlY29uZFBvaW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uQ29vcmRzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHN0YXJ0Q2VudGVyUG9zLmxlZnQgLSBvZmZzZXQyLngsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBzdGFydENlbnRlclBvcy50b3AgKyBvZmZzZXQyLnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBidWJibGUucm93ICsgMVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhIGNvbGxpc2lvbiB3YXMgZGV0ZWN0ZWQgYW5kIHdhcyBkaXN0YW5jZSB3YXMgc21hbGxlciB0aGFuIHRoZSBzbWFsbGVzdCBjb2xsaXNpb24gZGlzdGFuZSB0aWxsIG5vd1xuICAgICAgICAgICAgICAgICAgICBpZighY29sbGlzaW9uIHx8IG5ld0Rpc3RhbmNlIDwgY29sbGlzaW9uLmRpc3RhbmNlVG9Db2xsaXNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpc2lvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXN0YW5jZVRvQ29sbGlzaW9uOiBuZXdEaXN0YW5jZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWJibGU6IGJ1YmJsZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb29yZHM6IGNvbGxpc2lvbkNvb3Jkc1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICB9XG4gICAgcmV0dXJuIGNvbGxpc2lvbjtcbiAgICB9IiwiaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vdWkuanNcIjtcbmltcG9ydCAqIGFzIEJ1YmJsZSBmcm9tIFwiLi9idWJibGUuanNcIjtcbmltcG9ydCAqIGFzIEJvYXJkIGZyb20gXCIuL01vZGVsL0JvYXJkLmpzXCI7XG5pbXBvcnQgKiBhcyBDb2xsaXNpb24gZnJvbSBcIi4vY29sbGlzaW9uRGV0ZWN0b3IuanNcIjtcblxubGV0IGJvYXJkIDtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIgLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFVJLm5ld0dhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIFVJLnJlc2l6ZSk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcIm9yaWVudGF0aW9uY2hhbmdlXCIsIFVJLnJlc2l6ZSk7XG4gICAgfSk7XG59XG4gICAgXG5mdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIEJvYXJkLmluaXQoNSwzMCk7XG4gICAgVUkuaW5pdCgpO1xuICAgIFVJLm5ld0dhbWVCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG4gICAgVUkuaGlkZURpYWxvZygpO1xuICAgIFxuLy8gICAgVUkuZHJhd0JvYXJkKCk7XG4gICAgXG4gICAgLy8gc2V0IHRoZSBmaXJzdCBuZXh0IGJ1YmJsZVxuICAgIFVJLnByZXBhcmVOZXh0QnViYmxlKCk7XG4gICAgVUkucmVzaXplKCk7XG4vLyAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICBcbiAgICBcbiAgICAvLyBhZGQgZXZlbnQgbGlzdG5lciBmb3IgbW91c2UgY2xpY2tzIG9uIHRoZSBib2FyZFxuICAgIFVJLmdhbWVCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBiYWxsRmlyZWRIYW5kbGVyKTtcbiAgICBVSS5nYW1lQm9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xufVxuXG5mdW5jdGlvbiBiYWxsRmlyZWRIYW5kbGVyKGV2ZW50KSB7XG4gICAgXG4gICAgbGV0IGNvb3JkaW5hdGVzID0ge307XG4gICAgaWYoZXZlbnQudHlwZSA9PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgICBjb29yZGluYXRlcy54ID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgIGNvb3JkaW5hdGVzLnkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIGhhbmRsaW5nIG1vdXNlXG4gICAgICAgIGNvb3JkaW5hdGVzLnggPSBldmVudC5wYWdlWDtcbiAgICAgICAgY29vcmRpbmF0ZXMueSA9IGV2ZW50LnBhZ2VZO1xuICAgIH1cbiAgICAvLyBnZXQgdGhlIGZpcmluZyBhbmdsZVxuICAgIGxldCBhbmdsZSA9IGdldEFuZ2xlRnJvbURldmljZShjb29yZGluYXRlcyk7XG4gICAgXG4gICAgLy8gZGVmYXVsdCBkaXN0YW5jZSBhbmQgZHVyYXRpb25cbiAgICBsZXQgYW5pbWF0aW9uRHVyYXRpb24gPSA3NTA7IC8vIDAuNzUgc2VjXG4gICAgbGV0IGRpc3RhbmNlID0gMTAwMDtcbiAgICBcbiAgICBsZXQgY29sbGlzaW9uSGFwcGVuZWQgPSBDb2xsaXNpb24uZmluZEludGVyc2VjdGlvbihhbmdsZSwgVUkuY3VycmVudEJ1YmJsZSk7XG4gICAgXG4gICAgbGV0IGFuaW1hdGlvbkNhbGxiYWNrO1xuICAgIGxldCBuZXdCdWJibGUgPSBCdWJibGUuZGVlcENvcHkoVUkuY3VycmVudEJ1YmJsZSk7XG4gICAgVUkuYm9hcmQuYXBwZW5kQ2hpbGQobmV3QnViYmxlLmRvbSk7XG4gICAgLy8gcmFuZG9tbHkgY2hhbmdlIHRoZSB0eXBlIHRvIGdldCBhIG5ldyBidWJibGUgd2l0aCBhIG5ldyBjb2xvclxuICAgIFVJLmN1cnJlbnRCdWJibGUuY2hhbmdlVHlwZSgpO1xuICAgIFxuICAgIC8vIGlmIGNvbGxpc2lvbiBvY2N1cnMgY2hhbmdlIGRpc3RhbmNlIGFuZCBkdXJhdGlvbi5cbiAgICBpZiAoY29sbGlzaW9uSGFwcGVuZWQpIHtcbiAgICAgICAgYW5pbWF0aW9uRHVyYXRpb24gPSBhbmltYXRpb25EdXJhdGlvbiAqIGNvbGxpc2lvbkhhcHBlbmVkLmRpc3RhbmNlVG9Db2xsaXNpb24gLyBkaXN0YW5jZTtcbiAgICAgICAgZGlzdGFuY2UgPSBjb2xsaXNpb25IYXBwZW5lZC5kaXN0YW5jZVRvQ29sbGlzaW9uO1xuICAgICAgICAvLyB1cGRhdGUgdGhlIGJvYXJkIHN0YXRlIHdpdGggdGhlIHBvc2l0aW9uIG9mIHRoZSBuZXcgYnViYmxlLiBhbHNvIHVwZGF0ZSB0aGUgY29sIGFuZCByb3cgb2YgdGhlIGJ1YmJsZSBvYmplY3QgaXRzZWxmXG4gICAgICAgIEJvYXJkLmFkZEJ1YmJsZShuZXdCdWJibGUsIGNvbGxpc2lvbkhhcHBlbmVkLmNvb3Jkcyk7XG4gICAgICAgIFxuICAgICAgICAvLyBjaGVjayBmb3IgZ3JvdXBzIHdpdGggdGhlIHNhbWUgY29sb3IgbGlrZSBvdXIgbmV3IGJ1YmJsZVxuICAgICAgICBsZXQgZ3JvdXAgPSBCb2FyZC5nZXRHcm91cChuZXdCdWJibGUsIHt9KTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBhbmltYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIHJlLXJlbmRlciBhbGwgdGhlIGRvbSB0cmVlIHdoZW4gdGhlIGFuaW1hdGlvbiBmaW5pc2ggdG8gcHV0IHRoZSBuZXcgYnViYmxlIGluIHRoZSBhcHByb3ByaWF0ZSBwb3NpdGlvblxuICAgICAgICAgICAgVUkuZHJhd0JvYXJkKCk7XG4gICAgICAgICAgICBpZihncm91cC5saXN0Lmxlbmd0aCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcG9wQnViYmxlcyhncm91cC5saXN0KTtcbi8vICAgICAgICAgICAgICAgIFVJLmRyYXdCb2FyZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSAvLyBlbmQgaWZcbiAgICBcbiAgICBlbHNlIHtcbiAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBuZXdCdWJibGUuZG9tLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfSAvLyBlbmQgZWxzZVxuICAgIFxuICAgIC8vIGZpcmUgdXAgdGhlIGFuaW1hdGlvblxuICAgIFVJLnN0YXJ0QmFsbEFuaW1hdGlvbihuZXdCdWJibGUsIGFuZ2xlLCBhbmltYXRpb25EdXJhdGlvbiwgZGlzdGFuY2UsIGFuaW1hdGlvbkNhbGxiYWNrKTtcbiAgICBcbiAgICBcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG59XG5cblxuZnVuY3Rpb24gcG9wQnViYmxlcyAoYnViYmxlcyl7XG4gICAgYnViYmxlcy5mb3JFYWNoKGJ1YmJsZSA9PiBCb2FyZC5kZWxldGVCdWJibGUoYnViYmxlKSk7XG4gICAgLy8gZ2V0IHRoZSBvcnBoYW5zIFxuICAgIGxldCBvcnBoYW5zID0gQm9hcmQuZmluZE9ycGhhbnMoKTtcbiAgICBcbiAgICBidWJibGVzLmZvckVhY2goIChidWJibGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBidWJibGVEb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWJibGUucm93ICsgXCJcIiArIGJ1YmJsZS5jb2wpO1xuICAgICAgICAvLyBpZiBpdCB3YXMgdGhlIGxhc3QgYmFsbCBhbmltYXRlZCB0aGVuIHdlIHdhbnQgdG8gZHJvcCBidWJibGVzIGlmIGV4aXN0ZWRcbiAgICAgICAgaWYoKG9ycGhhbnMubGVuZ3RoID4gMCkgJiYgKGluZGV4ID09IGJ1YmJsZXMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICBVSS5hbmltYXRlVmFuaXNoKGJ1YmJsZURvbSwgYnViYmxlLCBVSS5kcm9wQnViYmxlcyhvcnBoYW5zKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIFVJLmFuaW1hdGVWYW5pc2goYnViYmxlRG9tLCBidWJibGUpO1xuICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGdldEFuZ2xlRnJvbURldmljZSAoZGV2aWNlWFkpIHtcbi8vICAgIGFsZXJ0KFwiaW4gdGhlIGdldCBBbmdsZVwiKTtcbiAgICBsZXQgQnViYmxlWFkgPSB7XG4gICAgICAgIHg6IFVJLmN1cnJlbnRCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBVSS5jdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCAvMixcbiAgICAgICAgeTogVUkuY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgVUkuY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0IC8yXG4gICAgfTtcbiAgICBcbiAgICBsZXQgZmlyZUFuZ2xlID0gTWF0aC5hdGFuKChkZXZpY2VYWS54IC0gQnViYmxlWFkueCkgLyAoQnViYmxlWFkueSAtIGRldmljZVhZLnkpKTtcbiAgICBcbi8vICAgIGxldCBmaXJlQW5nbGUgPSBNYXRoLmF0YW4yKChkZXZpY2VYWS54IC0gQnViYmxlWFkueCkgLCAoQnViYmxlWFkueSAtIGRldmljZVhZLnkpKTtcblxuICAgIFxuICAgICAvL2lmIHRoZSBwbGF5ZXIgZmlyZWQgdGhlIGJhbGwgYXQgYXByb3hpbWF0bHkgaG9yaXpvbnRhbCBsZXZlbFxuLy8gICAgaWYoZGV2aWNlWFkueSA+IEJ1YmJsZVhZLnkpIHtcbi8vICAgICAgICBmaXJlQW5nbGUgPSBmaXJlQW5nbGUgKyBNYXRoLlBJO1xuLy8gICAgfVxuICAgIFxuICAgIHJldHVybiBmaXJlQW5nbGU7XG59XG5cbiIsImltcG9ydCAqIGFzIEJ1YmJsZSBmcm9tIFwiLi9idWJibGUuanNcIjtcbmltcG9ydCAqIGFzIEJvYXJkIGZyb20gXCIuL01vZGVsL0JvYXJkLmpzXCI7XG5cbmV4cG9ydCBsZXQgbmV3R2FtZURpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRfZ2FtZV9kaWFsb2dcIik7XG5leHBvcnQgbGV0IGN1cnJlbnRCdWJibGU7XG5leHBvcnQgbGV0IGdhbWVCb2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtZVwiKTtcbmV4cG9ydCBsZXQgbmV3R2FtZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3X2dhbWVfYnV0dG9uXCIpO1xuZXhwb3J0IGxldCB0b3BiYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvcGJhclwiKTtcbmV4cG9ydCBsZXQgZm9vdGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb290ZXJcIik7XG5cbmV4cG9ydCBsZXQgYm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpO1xuXG5cbmV4cG9ydCBsZXQgYm9hcmRXaWR0aDtcbmV4cG9ydCBsZXQgYm9hcmRIZWlnaHQ7XG5cbmV4cG9ydCBsZXQgc3ByaXRlUmFkaXVzID0gMDtcbmV4cG9ydCBsZXQgYnViYmxlUmFkaXVzID0gMDtcbmV4cG9ydCBsZXQgdHdvU2lkZXNFbXB0eVNwYWNlID0gMDtcblxuLy8gbnVtYmVyIG9mIGNvbCBpbiB0aGUgYm9hcmRcbmxldCBudW1PZkNvbDtcbi8vIG51bWJlciBvZiByb3dzIGluIHRoZSBib2FyZFxubGV0IG51bU9mUm93O1xuXG5sZXQgYm9hcmRJbml0aWF0ZWQ7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICBudW1PZkNvbCA9IEJvYXJkLk5VTV9DT0wgLyAyOyAgXG4gICAgbnVtT2ZSb3cgPSBCb2FyZC5OVU1fUk9XO1xuICAgIGJvYXJkSW5pdGlhdGVkID0gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaWRlRGlhbG9nICgpIHtcbiAgICBuZXdHYW1lRGlhbG9nLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICBuZXdHYW1lRGlhbG9nLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbn1cblxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydEJhbGxBbmltYXRpb24gKGZpcmVkQnViYmxlLCBhbmdsZSwgZHVyYXRpb24sIGRpc3RhbmNlLCBhbmltYXRpb25DYWxsYmFjaykge1xuLy8gICAgbGV0IGFuZ2xlID0gZ2V0QW5nbGVGcm9tRGV2aWNlKGRldmljZVhZKTtcbi8vICAgIGxldCBkaXN0YW5jZSA9IDEwMDA7XG4gICAgLy8gbGV0IHVzIGFzc3VtZSB0aGF0IHdlIHdpbGwgZmlyZSB0aGUgYmFsbCBmb3IgMTAwMHB4IGZvciBub3dcbiAgICBsZXQgZGlzdGFuY2VYID0gTWF0aC5zaW4oYW5nbGUpICogZGlzdGFuY2U7XG4gICAgbGV0IGRpc3RhbmNlWSA9IE1hdGguY29zKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgIFxuICAgIGxldCBudW1iZXJPZkl0ZXJhdGlvbnMgPSBNYXRoLmNlaWwoZHVyYXRpb24gLyAxNik7IFxuICAgIGxldCB4RXZlcnlGcmFtZSA9IGRpc3RhbmNlWCAvIG51bWJlck9mSXRlcmF0aW9ucztcbiAgICBsZXQgeUV2ZXJ5RnJhbWUgPSBkaXN0YW5jZVkgLyBudW1iZXJPZkl0ZXJhdGlvbnM7XG4gICAgXG4gICAgICAgIFxuLy8gICAgbGV0IGFuaW1hdGlvbkxvb3AgPSBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAocGFyc2VGbG9hdChmaXJlZEJ1YmJsZS5kb20uc3R5bGUubGVmdCkgKyB4RXZlcnlGcmFtZSkgKyBcInB4XCI7XG4vLyAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRvcCA9IChwYXJzZUZsb2F0KGZpcmVkQnViYmxlLmRvbS5zdHlsZS50b3ApIC0geUV2ZXJ5RnJhbWUpICsgXCJweFwiO1xuLy8gICAgICAgIFxuLy8gICAgICAgIG51bWJlck9mSXRlcmF0aW9ucyAtLTtcbi8vICAgICAgICBpZiAobnVtYmVyT2ZJdGVyYXRpb25zID09PSAwKSB7XG4vLyAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGxvb3BJRCk7XG4vLyAgICAgICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrKCk7XG4vLyAgICAgICAgfVxuLy8gICAgICAgIGVsc2Uge1xuLy8gICAgICAgICAgICBsb29wSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XG4vLyAgICAgICAgfVxuLy8gICAgfVxuLy8gICAgXG4vLyAgICBsZXQgbG9vcElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkxvb3ApO1xuICAgIFxuICAgIGZpcmVkQnViYmxlLmRvbS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrKCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS50cmFuc2l0aW9uID0gXCJ0cmFuc2Zvcm0gXCIgKyAoZHVyYXRpb24vMTAwMCkgKyBcInMgZWFzZS1vdXRcIjtcbiAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudHJhbnNpdGlvbiA9IFwiLXdlYmtpdC10cmFuc2Zvcm0gXCIgKyAoZHVyYXRpb24vMTAwMCkgKyBcInMgZWFzZS1vdXRcIjtcbi8vICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS50cmFuc2l0aW9uID0gXCItd2Via2l0LXRyYW5zZm9ybSBcIiArIDEgKyBcInMgZWFzZS1vdXRcIjtcbi8vICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS50cmFuc2l0aW9uID0gXCJ0cmFuc2Zvcm0gXCIgKyAxICsgXCJzIGVhc2Utb3V0XCI7XG5cblxuLy8gICAgICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS50cmFuc2l0aW9uID0gXCJ0cmFuc2Zvcm0gXCIgKyAwLjUgKyBcInMgbGluZWFyXCI7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIGRpc3RhbmNlWCArIFwicHgsXCIgKyAoLWRpc3RhbmNlWSArIHNwcml0ZVJhZGl1cykgKyBcInB4KVwiO1xuICAgICAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyBkaXN0YW5jZVggKyBcInB4LFwiICsgKC1kaXN0YW5jZVkgKyBzcHJpdGVSYWRpdXMpICsgXCJweClcIjsgICAgICAgIFxuICAgIH0sIDUwKTtcblxuXG59ICAgXG4gICAgXG5leHBvcnQgZnVuY3Rpb24gcHJlcGFyZU5leHRCdWJibGUoKSB7XG4gICAgaWYoY3VycmVudEJ1YmJsZSkge1xuICAgICAgICBcbiAgICB9XG4gICAgY3VycmVudEJ1YmJsZSA9IEJ1YmJsZS5jcmVhdGUoLTEsIC0xKTtcbiAgICBcbiAgICAvLyBtYWtlIHRoZSBuZXcgYnViYmxlIHRoZSBjdXJyZW50IGJ1YmJsZSwgdGhlbiBhZGQgaXQgdG8gdGhlIGRvbVxuICAgIGN1cnJlbnRCdWJibGUuZG9tLmNsYXNzTGlzdC5hZGQoXCJjdXJyX2J1YmJsZVwiKTtcbiAgICBcbi8vICAgIGJvYXJkLmFwcGVuZENoaWxkKGN1cnJlbnRCdWJibGUuZG9tKTsgICAgXG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNpemUgKCkge1xuICAgIFxuICAgIGxldCBnYW1lV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBsZXQgZ2FtZUhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIGxldCBzY2FsZVRvRml0WCA9IGdhbWVXaWR0aCAvIDcyMDsgLy8gdGhlIGdhbWUgd2lsbCBiZSBwbGF5YWJsZSBpbiBwb3J0cmFpdCBtb2RlLCBzbyA3MjAgZm9yIGhvcml6b250YWwgYW5kIDEyODAgZm9yIHZlcnRpY2FsXG4gICAgbGV0IHNjYWxlVG9GaXRZID0gZ2FtZUhlaWdodCAvIDEyODA7XG4gICAgbGV0IG9wdGltYWxSYXRpbyA9IE1hdGgubWluKHNjYWxlVG9GaXRYLCBzY2FsZVRvRml0WSk7XG4vLyAgICB2YXIgb3B0aW1hbFJhdGlvID0gTWF0aC5tYXgoc2NhbGVUb0ZpdFgsIHNjYWxlVG9GaXRZKTtcblxuICAgIGJvYXJkV2lkdGggPSAoNzIwICogb3B0aW1hbFJhdGlvKTtcbiAgICBib2FyZEhlaWdodCA9ICgoMTI4MCAqIG9wdGltYWxSYXRpbykgLSAodG9wYmFyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCArIGZvb3Rlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQpKTtcbiAgICBidWJibGVSYWRpdXMgPSAoYm9hcmRXaWR0aCAvIChudW1PZkNvbCArMSkpIC8gMjtcbiAgICBzcHJpdGVSYWRpdXMgPSBidWJibGVSYWRpdXMgLyAwLjg4O1xuICAgIFxuICAgIGJvYXJkLnN0eWxlLndpZHRoID0gYm9hcmRXaWR0aCArIFwicHhcIjtcbiAgICBib2FyZC5zdHlsZS5oZWlnaHQgPSBib2FyZEhlaWdodCArIFwicHhcIjtcbiAgICBcbiAgICBcbiAgICBcbi8vICAgIGN1cnJlbnRCdWJibGUubGVmdCA9ICgoYm9hcmRXaWR0aCAvIDIpIC0gKGJ1YmJsZVJhZGl1cykpICsgXCJweFwiO1xuLy8gICAgY3VycmVudEJ1YmJsZS50b3AgPSAoYm9hcmRIZWlnaHQgLSAoYnViYmxlUmFkaXVzICogMykpICsgXCJweFwiO1xuICAgIFxuICAgIGRyYXdCb2FyZCgpO1xuLy8gICAgbGV0IGJ1YmJsZVdpZHRoID0gKG5ld0JvYXJkV2lkdGggLyBudW1PZkNvbCArMyk7XG4vLyAgICAvLyB1cGRhdGUgZ2xvYmFsIGJ1YmJsZVJhZGl1cyB2YXJpYWJsZVxuLy8gICAgXG4vLy8vICAgIGNzc1JlbmRlcihidWJibGVXaWR0aCk7XG4vLyAgICAvLyByZXNpemUgdGhlIGN1cnJlbnRCdWJibGVcbi8vICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbi8vLy8gICAgICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAoIChuZXdCb2FyZFdpZHRoIC8gMikgLSAoYnViYmxlV2lkdGggLzIpICkgKyBcInB4XCI7XG4vLyAgICB9XG5cbiAgICBcblxufVxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIHNldE5ld0J1YmJsZVBvc2l0aW9uKCkge1xuICAgIGxldCB3aWR0aCA9IChzcHJpdGVSYWRpdXMgKiAyKSArIFwicHhcIjtcbiAgICBsZXQgbGVmdCA9ICgoYm9hcmRXaWR0aCAvIDIpIC0gKHNwcml0ZVJhZGl1cykpICsgXCJweFwiO1xuICAgIGxldCB0b3AgPSAoYm9hcmRIZWlnaHQgLSAoc3ByaXRlUmFkaXVzICogMykpICsgXCJweFwiO1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiY3VycmVudFwiKTtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS5sZWZ0ID0gbGVmdDtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS50b3AgPSB0b3A7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS5oZWlnaHQgPSB3aWR0aDtcbi8vICAgIGN1cnJlbnRCdWJibGUuZG9tLmNsYXNzTGlzdC5hZGQoXCJjdXJyX2J1YmJsZVwiKTtcbn1cbiAgICBcblxuZXhwb3J0IGZ1bmN0aW9uIGRyb3BCdWJibGVzKG9ycGhhbkJ1YmJsZXMpIHtcbiAgICBsZXQgcGFydGlhbEFwcGxpY2F0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgb3JwaGFuQnViYmxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGJ1YmJsZSA9IG9ycGhhbkJ1YmJsZXNbaV07XG4gICAgICAgICAgICBsZXQgYnViYmxlRG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYnViYmxlLnJvdyArIFwiXCIgKyBidWJibGUuY29sKTtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5hZGRFdmVudExpc3RlbmVyKFwidHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQm9hcmQuZGVsZXRlQnViYmxlKGJ1YmJsZSlcbiAgICAgICAgICAgICAgICBidWJibGVEb20ucmVtb3ZlKCk7XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICBcbi8vICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLnRyYW5zaXRpb24gPSBcInRyYW5zZm9ybSBcIiArIDEuMiArIFwicyBjdWJpYy1iZXppZXIoMC41OSwtMC4wNSwgMC43NCwgMC4wNSlcIjtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS50cmFuc2l0aW9uID0gXCItd2Via2l0LXRyYW5zZm9ybSBcIiArIDAuOCArIFwicyBjdWJpYy1iZXppZXIoMC41OSwtMC4wNSwgMC43NCwgMC4wNSlcIjtcblxuXG4gICAgICAgICAgICBidWJibGVEb20uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyAxMDAgKyBcInB4LFwiICsgMTUwMCArIFwicHgpXCI7XG4gICAgICAgICAgICBidWJibGVEb20uc3R5bGUud2Via2l0VHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyAwICsgXCJweCxcIiArIDE1MDAgKyBcInB4KVwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBwYXJ0aWFsQXBwbGljYXRpb247XG59XG5cbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRlVmFuaXNoIChidWJibGVEb20sIGJ1YmJsZSwgYW5pbWF0ZUNhbGxiYWNrKSB7XG4gICAgbGV0IG51bU9mSXRlcmF0aW9uID0gMTU7XG4gICAgbGV0IGNvdW50ZXIgPSBudW1PZkl0ZXJhdGlvbjtcbiAgICBcbiAgICBsZXQgYW5pbWF0ZUJ1YmJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoY291bnRlciA9PSBudW1PZkl0ZXJhdGlvbikge1xuICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiMzMuMzMzMzMzMzMlIFwiICsgYnViYmxlLmdldEhlaWdodFBvc0Zyb21UeXBlKCkgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNvdW50ZXIgPT0gTWF0aC5mbG9vcihudW1PZkl0ZXJhdGlvbiAqIDIvMykpIHtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjY2LjY2NjY2NjY3JVwiICsgYnViYmxlLmdldEhlaWdodFBvc0Zyb21UeXBlKCkgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNvdW50ZXIgPT0gTWF0aC5mbG9vcihudW1PZkl0ZXJhdGlvbiAqIDEvMykpIHtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjEwMCVcIiArIGJ1YmJsZS5nZXRIZWlnaHRQb3NGcm9tVHlwZSgpICsgXCIlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY291bnRlciA9PSAwKSB7XG4gICAgICAgICAgICBidWJibGVEb20ucmVtb3ZlKCk7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShsb29wSUQpO1xuICAgICAgICAgICAgaWYoYW5pbWF0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgd2FzIHRoZSBsYXN0IGJ1YmJsZSB0byBiZSBhbmltYXRlZCB0aGVuIHdlIHdhbnQgdG8gYW5pbWF0ZSBvcnBoYW5zIGlmIHRoZSBleGlzdFxuICAgICAgICAgICAgICAgIGFuaW1hdGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY291bnRlciAtLTtcbiAgICAgICAgICAgIGxvb3BJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQnViYmxlKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0gICBcbiAgICBcbiAgICBsZXQgbG9vcElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVCdWJibGUpO1xufVxuXG4gICAgXG4gICAgXG5leHBvcnQgZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICAgIGxldCBib2FyZEFycmF5ID0gQm9hcmQuZ2V0Qm9hcmRBcnJheSgpO1xuLy8gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCB3aWR0aCA9IHNwcml0ZVJhZGl1cyAqIDI7XG4gICAgbGV0IGh0bWxTdHJpbmcgPSBcIlwiO1xuICAgIFxuICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbiAgICAgICAgbGV0IGxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChzcHJpdGVSYWRpdXMpKSArIFwicHhcIjtcbiAgICAgICAgbGV0IHRvcCA9IChib2FyZEhlaWdodCAtIChzcHJpdGVSYWRpdXMgKiAzKSkgKyBcInB4XCI7XG4gICAgICAgIGh0bWxTdHJpbmcgKz0gXCI8ZGl2IGlkPSdjdXJyZW50JyBjbGFzcz0nYnViYmxlIGJ1YmJsZVwiICsgY3VycmVudEJ1YmJsZS50eXBlICsgXCInIHN0eWxlPScgd2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggKyBcInB4O1wiICsgXCJsZWZ0OiBcIiArICgoYm9hcmRXaWR0aCAvIDIpIC0gKHNwcml0ZVJhZGl1cykpICsgXCJweDtcIiArIFwiIHRvcDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAoYm9hcmRIZWlnaHQgLSAoc3ByaXRlUmFkaXVzICogMykpICsgXCJweDsnID4gPC9kaXY+XCI7XG4gICAgICAgIFxuLy8gICAgICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAoIChuZXdCb2FyZFdpZHRoIC8gMikgLSAoYnViYmxlV2lkdGggLzIpICkgKyBcInB4XCI7XG4gICAgfVxuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQm9hcmQuTlVNX1JPVzsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtT2ZDb2wgKiAyOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5W2ldW2pdO1xuICAgICAgICAgICAgLy8gdGhlcmUgZXhpc3QgYSBidWJibGUgb24gdGhhdCBpbmRleCAoZXZlbiByb3dzIGhhdmUgYnViYmxlIG9uIHRoZSBvZGQgY29sdW1uIGluZGljaWVzKVxuICAgICAgICAgICAgaWYoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnQgPSAoaiAqIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IChpICogYnViYmxlUmFkaXVzICogMiAtIChzcHJpdGVSYWRpdXMgKiAwLjE1ICogaSkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY29vcmRzIGluIHRoZSBidWJibGUgb2JqZWN0ICh0aGVzZSBjb29yZHMgYXJlIGNvb3JkcyBvZiB0aGUgY2VudGVyIG9mIHRoZSBidWJibGUpXG4gICAgICAgICAgICAgICAgYnViYmxlLnNldENvb3JkcyhsZWZ0ICsgIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBidWJibGVSYWRpdXMsIHRvcCArIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaHRtbFN0cmluZyArPSBcIjxkaXYgaWQ9J1wiICsgaSArIFwiXCIgKyBqICsgXCInIGNsYXNzPSdidWJibGUgYnViYmxlXCIgKyBidWJibGUudHlwZSArIFwiJyBzdHlsZT0nbGVmdDogXCIgKyBsZWZ0ICsgXCJweDsgdG9wOiBcIiArIHRvcCArXG4gICAgICAgICAgICAgICAgICAgIFwicHg7IHdpZHRoOiBcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6IFwiICsgd2lkdGggKyBcInB4OycgPjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYm9hcmQuaW5uZXJIVE1MID0gaHRtbFN0cmluZztcbiAgICBjdXJyZW50QnViYmxlLnNldERPTShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnRcIikpO1xuLy8gICAgYm9hcmQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuLy8gICAgY3NzUmVuZGVyKGJ1YmJsZVJhZGl1cyAqIDIpO1xuLy8gICAgYm9hcmRJbml0aWF0ZWQgPSB0cnVlO1xufVxuXG4iXX0=
