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

function dropBubbles(orphanBubbles) {
    var partialApplication = function partialApplication() {
        var _loop = function (i) {
            var bubble = orphanBubbles[i];
            var bubbleDom = document.getElementById(bubble.row + "" + bubble.col);
            bubbleDom.addEventListener("transitionend", function () {
                Board.deleteBubble(bubble);
                bubbleDom.remove();
            }, false);
            bubbleDom.style.transform = "translate(" + 0 + "px," + 1500 + "px)";
            bubbleDom.style.webkitTransform = "translate(" + 0 + "px," + 1500 + "px)";
        };

        for (var i = 0; i < orphanBubbles.length; i++) {
            _loop(i);
        }
    };

    return partialApplication;
}

function popBubbles(bubbles) {
    bubbles.forEach(function (bubble) {
        return Board.deleteBubble(bubble);
    });
    var orphans = Board.findOrphans();

    bubbles.forEach(function (bubble, index) {
        var bubbleDom = document.getElementById(bubble.row + "" + bubble.col);
        // if it was the last ball animated then we want to drop bubbles if existed
        if (orphans.length > 0 && index == bubbles.length - 1) animateVanish(bubbleDom, bubble, dropBubbles(orphans));else animateVanish(bubbleDom, bubble);
    });
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

    var animationLoop = function animationLoop() {
        firedBubble.dom.style.left = parseFloat(firedBubble.dom.style.left) + xEveryFrame + "px";
        firedBubble.dom.style.top = parseFloat(firedBubble.dom.style.top) - yEveryFrame + "px";

        numberOfIterations--;
        if (numberOfIterations === 0) {
            cancelAnimationFrame(loopID);
            animationCallback();
        } else {
            loopID = requestAnimationFrame(animationLoop);
        }
    };

    var loopID = requestAnimationFrame(animationLoop);

    //    UI.firedBubble.dom.style.transform = "translate(" + distanceX + "px," + distanceY + "px)";
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvTW9kZWwvQm9hcmQuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvYXBwLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2J1YmJsZS5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9jb2xsaXNpb25EZXRlY3Rvci5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9nYW1lLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL3VpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozt3QkNBd0IsZ0JBQWdCOztJQUE1QixNQUFNOztvQkFDRSxZQUFZOztJQUFwQixFQUFFOztBQUVQLElBQUksT0FBTyxZQUFBLENBQUU7O0FBQ2IsSUFBSSxPQUFPLFlBQUEsQ0FBQzs7O0FBRW5CLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsSUFBSSxLQUFLLEdBQUcsU0FBUixLQUFLLEdBQWU7QUFDcEIsUUFBSSxXQUFXLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztDQUV6QyxDQUFBOztBQUVNLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFhLE1BQU0sRUFBRSxNQUFNLEVBQUU7O0FBRTdDLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEIsVUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDNUQsUUFBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTs7S0FFbkI7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Z2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuLy4uL2J1YmJsZS5qc1wiO1xuaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vLi4vdWkuanNcIjtcblxuZXhwb3J0IGxldCBOVU1fUk9XIDtcbmV4cG9ydCBsZXQgTlVNX0NPTDtcblxubGV0IGJvYXJkQXJyYXkgPSBbXTtcblxubGV0IEJvYXJkID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBidWJibGVBcnJheSA9IGNyZWF0ZUJ1YmJsZUFycmF5KCk7XG4gICAgXG59XG5cbmV4cG9ydCBsZXQgYWRkQnViYmxlID0gZnVuY3Rpb24gKGJ1YmJsZSwgY29vcmRzKSB7XG4vLyAgICBsZXQgcm93TnVtID0gTWF0aC5mbG9vcihjb29yZHMueSAvIChVSS5idWJibGVSYWRpdXMgKiAyKSk7XG4gICAgbGV0IHJvd051bSA9IGNvb3Jkcy55O1xuICAgIGNvb3Jkcy54ID0gY29vcmRzLnggLSBVSS5ib2FyZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgIGlmKHJvd051bSAlIDIgPT0gMCkge1xuLy8gICAgICAgIGNvb3Jkcy54ID0gY29vcmRzLnggLSBVSS5zcHJpdGVSYWRpdXMgLzJcbiAgICB9XG4gICAgXG4gICAgbGV0IGNvbE51bTtcbi8vICAgIGxldCBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvb3Jkcy54IC8gKFVJLmJ1YmJsZVJhZGl1cyAqIDIpKTsgXG4vLyAgICBjb2xOdW0gLT0gMTtcbi8vICAgIGNvbE51bSA9IE1hdGgucm91bmQoY29sTnVtIC8gMikgKiAyO1xuICAgIFxuICAgIGlmIChyb3dOdW0gJSAyID09PSAwKSB7XG4gICAgIGNvbE51bSA9IE1hdGgucm91bmQoY29vcmRzLnggLyAoVUkuYnViYmxlUmFkaXVzICogMikpOyBcblxuICAgICAgICBjb2xOdW0gPSAoY29sTnVtICogMikgLSAxO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29sTnVtID0gTWF0aC5mbG9vcihjb29yZHMueCAvIChVSS5idWJibGVSYWRpdXMgKiAyKSk7IFxuXG4gICAgICAgIGNvbE51bSA9IChjb2xOdW0gKiAyKSAgO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIWJvYXJkQXJyYXlbcm93TnVtXSkge1xuICAgICAgICBib2FyZEFycmF5W3Jvd051bV0gPSBbXTtcbiAgICAgICAgTlVNX1JPVyArKztcbiAgICB9XG4vLyAgICBlbHNlIGlmIChib2FyZEFycmF5W3Jvd051bV1bY29sTnVtXSAhPSBmYWxzZSkge1xuLy8gICAgICAgIGJcbi8vICAgIH1cbiAgICBidWJibGUuc2V0Q29sKGNvbE51bSk7XG4gICAgYnViYmxlLnNldFJvdyhyb3dOdW0pO1xuICAgIGJvYXJkQXJyYXlbcm93TnVtXVtjb2xOdW1dID0gYnViYmxlO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0IChudW1Sb3dzLCBudW1Db2xzKSB7XG4gICAgTlVNX1JPVyA9IG51bVJvd3M7XG4gICAgTlVNX0NPTCA9IG51bUNvbHM7XG4gICAgXG4gICAgY3JlYXRlQm9hcmRBcnJheSgpOyAgICBcbn1cblxuZXhwb3J0IGxldCBnZXRCb2FyZEFycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGJvYXJkQXJyYXk7XG59IFxuXG5cblxuLy8gcmV0dXJuIHRoZSBidWJibGUgYXQgdGhlIGN1cnJlbnQgcG9zaXRpb24gb3IgbnVsbCBpZiBpdCBkb2Vzbid0IGV4aXN0XG5mdW5jdGlvbiBnZXRCdWJibGVBdChyb3csIGNvbCkge1xuICAgIGlmICghYm9hcmRBcnJheVtyb3ddKVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gYm9hcmRBcnJheVtyb3ddW2NvbF07XG59XG5cbi8vIGdldCB0aGUgYnViYmxlcyB0aGF0IHN1cnJvdW5kIGEgYnViYmxlXG5mdW5jdGlvbiBnZXRCdWJibGVBcm91bmQocm93LCBjb2wpIHtcbiAgICB2YXIgYnViYmxlTGlzdCA9IFtdO1xuICAgIGZvcihsZXQgaSA9IHJvdyAtMTsgaSA8PSByb3cgKyAxOyBpKyspIHtcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGJ1YmJsZXMgaW4gdGhhdCByb3dcbiAgICAgICAgZm9yKGxldCBqID0gY29sIC0gMjsgaiA8PSBjb2wgKyAyOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBnZXRCdWJibGVBdChpLCBqKTtcbiAgICAgICAgICAgIGlmIChidWJibGUpIHtcbiAgICAgICAgICAgICAgICBidWJibGVMaXN0LnB1c2goYnViYmxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYnViYmxlTGlzdDtcbn1cblxuLy8gZ2V0IHRoZSBjb25uZWN0ZWQgZ3JvdXAgb2YgYnViYmxlcyAodGhhdCBzaGFyZSB0aGUgc2FtZSBjb2xvciwgb3Igbm90KSBzdGFydGluZyBmcm9tIHRoaXMgYnViYmxlXG5leHBvcnQgZnVuY3Rpb24gZ2V0R3JvdXAgKGJ1YmJsZSwgYnViYmxlc0ZvdW5kLCBkaWZmZXJlbnRDb2xvcikge1xuICAgIGxldCBjdXJyZW50Um93ID0gYnViYmxlLnJvdztcbiAgICBpZighYnViYmxlc0ZvdW5kW2N1cnJlbnRSb3ddKSB7XG4gICAgICAgIGJ1YmJsZXNGb3VuZFtjdXJyZW50Um93XSA9IHt9O1xuICAgIH1cbiAgICBpZighYnViYmxlc0ZvdW5kLmxpc3QpIHtcbiAgICAgICAgYnViYmxlc0ZvdW5kLmxpc3QgPSBbXTtcbiAgICB9XG4gICAgaWYoYnViYmxlc0ZvdW5kW2J1YmJsZS5yb3ddW2J1YmJsZS5jb2xdKSB7XG4gICAgICAgIC8vIHdlIGVuZCB0aGlzIGJyYW5jaCBvZiByZWN1cnNpb24gaGVyZSBiZWNhdXNlIHdlJ3ZlIGJlZW4gdG8gdGhpcyBidWJibGUgYmVmb3JlXG4gICAgICAgIHJldHVybiBidWJibGVzRm91bmQ7XG4gICAgfVxuICAgIFxuICAgIC8vIGFkZCB0aGUgYnViYmxlIHRvIHRoZSAyRCBhcnJheVxuICAgIGJ1YmJsZXNGb3VuZFtidWJibGUucm93XVtidWJibGUuY29sXSA9IGJ1YmJsZTtcbiAgICAvLyBwdXNoIHRoZSBidWJibGUgdG8gdGhlIGxpbmVhciBsaXN0XG4gICAgYnViYmxlc0ZvdW5kLmxpc3QucHVzaChidWJibGUpO1xuICAgIC8vIGdldCBhIGxpc3Qgb2YgYnViYmxlcyB0aGF0IHN1cnJvdW5kIHRoaXMgYnViYmxlIGFuZCBhcmUgb2YgdGhlIHNhbWUgY29sb3JcbiAgICBsZXQgc3Vycm91bmRpbmcgPSBnZXRCdWJibGVBcm91bmQoYnViYmxlLnJvdywgYnViYmxlLmNvbCk7XG4gICAgLy8gZm9yIGV2ZXJ5IHN1cnJvdW5kaW5nIGJ1YmJsZSByZWN1cnNpdmVseSBjYWxsIHRoaXMgZnVuY3Rpb24gYWdhaW5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgc3Vycm91bmRpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYoc3Vycm91bmRpbmdbaV0udHlwZSA9PT0gYnViYmxlLnR5cGUgfHwgZGlmZmVyZW50Q29sb3IpIHtcbiAgICAgICAgICAgIGJ1YmJsZXNGb3VuZCA9IGdldEdyb3VwKHN1cnJvdW5kaW5nW2ldLCBidWJibGVzRm91bmQsIGRpZmZlcmVudENvbG9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICByZXR1cm4gYnViYmxlc0ZvdW5kO1xufVxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRPcnBoYW5zICgpIHtcbiAgICBsZXQgY29ubmVjdGVkID0gW107XG4gICAgbGV0IGdyb3VwcyA9IFtdO1xuICAgIGxldCBvcnBoYW5zID0gW107XG4gICAgLy8gaW5pdGlhbGl6ZSB0aGUgcm93cyBvZiB0aGUgY29ubmVjdGVkXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGJvYXJkQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29ubmVjdGVkW2ldID0gW107XG4gICAgfVxuICAgIC8vIGxvb3Agb24gdGhlIGZpcnN0IHJvdywgYmVjYXVzZSBpdCBzaG91bGQgYmUgdGhlIHJvb3Qgb2YgZXZlcnkgY29ubmVjdGVkIGdyb3VwXG4gICAgLy8gaW5pdGlhbGx5IGV2ZXJ5dGhpbmcgaXMgTk9UIGNvbm5lY3RlZFxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBib2FyZEFycmF5WzBdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5WzBdW2ldO1xuICAgICAgICBpZihidWJibGUgJiYgIWNvbm5lY3RlZFswXVtpXSkge1xuICAgICAgICAgICAgLy8gaGVyZSB3ZSBwYXNzIHRydWUsIGJlY2F1c2Ugd2Ugd2FudCB0byBtYXRjaCBmb3IgYW55IGNvbG9yXG4gICAgICAgICAgICBsZXQgZ3JvdXAgPSBnZXRHcm91cChidWJibGUsIHt9LCB0cnVlKTtcbiAgICAgICAgICAgIGdyb3VwLmxpc3QuZm9yRWFjaChpdGVtID0+IGNvbm5lY3RlZFtpdGVtLnJvd11baXRlbS5jb2xdID0gdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gbG9vcCB0aHJvdWdoIGFsbCB0aGUgYm9hcmQgdG8gZGV0ZWN0IG9ycGhhbiBidWJibGVzIGFmdGVyIHdlIGRlY2lkZWQgY29ubmVjdGVkIGJ1YmJsZXMgd2l0aCB0aGUgZmlyc3Qgcm93XG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGJvYXJkQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHN0YXJ0Q29sID0gaSUyID09IDAgPyAxIDogMDtcbiAgICAgICAgZm9yKGxldCBqID0gc3RhcnRDb2w7IGogPCBOVU1fQ09MOyBqICs9IDIpIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBnZXRCdWJibGVBdChpLCBqKTtcbiAgICAgICAgICAgIGlmKGJ1YmJsZSAmJiAhY29ubmVjdGVkW2ldW2pdKSB7XG4gICAgICAgICAgICAgICAgb3JwaGFucy5wdXNoKGJ1YmJsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG9ycGhhbnM7XG59XG4gICAgXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlQnViYmxlKGJ1YmJsZSkge1xuICAgIGRlbGV0ZSBib2FyZEFycmF5W2J1YmJsZS5yb3ddW2J1YmJsZS5jb2xdO1xufVxuXG5cbmxldCBjcmVhdGVCb2FyZEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBOVU1fUk9XOyBpKyspIHtcbiAgICAgICAgbGV0IHN0YXJ0Q29sID0gaSUyID09IDAgPyAxIDogMDtcbiAgICAgICAgYm9hcmRBcnJheVtpXSA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29sIDsgaiA8IE5VTV9DT0w7IGorPSAyKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gQnViYmxlLmNyZWF0ZShpLCBqKTtcbiAgICAgICAgICAgIGJvYXJkQXJyYXlbaV1bal0gPSBidWJibGU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0ICogYXMgZ2FtZSBmcm9tIFwiLi9nYW1lLmpzXCI7XG5cbmdhbWUuaW5pdCgpOyIsImltcG9ydCAqIGFzIFVJIGZyb20gXCIuL3VpLmpzXCI7XG5cbmZ1bmN0aW9uIEJ1YmJsZSAoZG9tRWxlbWVudCwgcm93LCBjb2wsIHR5cGUpIHtcbiAgICBkb21FbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJidWJibGVcIik7XG4gICAgZG9tRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIgKyB0eXBlKTtcbiAgICB0aGlzLmRvbSA9IGRvbUVsZW1lbnQ7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xufVxuXG5CdWJibGUucHJvdG90eXBlLnNldERPTSA9IGZ1bmN0aW9uIChuZXdEb20pIHtcbiAgICB0aGlzLmRvbSA9IG5ld0RvbTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRDb29yZHMgPSBmdW5jdGlvbiAobGVmdCwgdG9wKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRDb2wgPSBmdW5jdGlvbihjb2wpIHtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRSb3cgPSBmdW5jdGlvbiAocm93KSB7XG4gICAgdGhpcy5yb3cgPSByb3c7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuZ2V0Q29vcmRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IHRoaXMubGVmdCxcbiAgICAgICAgdG9wOiB0aGlzLnRvcFxuICAgIH07XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuY2hhbmdlVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdGhpcy5kb20uY2xhc3NMaXN0LnJlbW92ZShcImJ1YmJsZVwiICsgdGhpcy50eXBlKTtcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHR5cGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICB9XG4gICAgdGhpcy5zZXRUeXBlKHR5cGUpO1xuICAgIHRoaXMuZG9tLmNsYXNzTGlzdC5hZGQoXCJidWJibGVcIiArIHR5cGUpO1xufVxuXG5CdWJibGUucHJvdG90eXBlLmdldEhlaWdodFBvc0Zyb21UeXBlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnR5cGUgPT0gMCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKHRoaXMudHlwZSA9PSAxKSB7XG4gICAgICAgIHJldHVybiAzMy4zMzMzMzMzMztcbiAgICB9XG4gICAgaWYgKHRoaXMudHlwZSA9PSAyKSB7XG4gICAgICAgIHJldHVybiA2Ni42NjY2NjY2NztcbiAgICB9XG4gICAgaWYgKHRoaXMudHlwZSA9PSAzKSB7XG4gICAgICAgIHJldHVybiAxMDA7XG4gICAgfVxufVxuXG5leHBvcnQgbGV0IGNyZWF0ZSA9IGZ1bmN0aW9uIChyb3csIGNvbCwgdHlwZSkge1xuICAgIGxldCBidWJibGVET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIFxuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdHlwZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpO1xuICAgIH1cbiAgICBsZXQgbmV3QnViYmxlID0gbmV3IEJ1YmJsZShidWJibGVET00sIHJvdywgY29sLCB0eXBlKTtcbiAgICBcbiAgICByZXR1cm4gbmV3QnViYmxlO1xuICAgIFxufVxuXG5leHBvcnQgbGV0IGRlZXBDb3B5ID0gZnVuY3Rpb24gKGNvcGllZEJ1YmJsZSkge1xuICAgIGxldCBuZXdCdWJibGVEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS5sZWZ0ID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS5sZWZ0O1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS50b3AgPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLnRvcDtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUud2lkdGggPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLndpZHRoO1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS5oZWlnaHQgPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLmhlaWdodDtcbiAgICBcbiAgICByZXR1cm4gbmV3IEJ1YmJsZSAobmV3QnViYmxlRG9tLCAtMSwgLTEsIGNvcGllZEJ1YmJsZS50eXBlKTtcbn0iLCJpbXBvcnQgKiBhcyBCb2FyZCBmcm9tIFwiLi9Nb2RlbC9Cb2FyZC5qc1wiO1xuaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vdWkuanNcIjtcblxubGV0IGJvYXJkQXJyYXkgPSBCb2FyZC5nZXRCb2FyZEFycmF5KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9uKGFuZ2xlLCBjdXJyQnViYmxlKSB7XG4gICAgbGV0IHN0YXJ0Q2VudGVyUG9zID0ge1xuICAgICAgICBsZWZ0OiBjdXJyQnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgVUkuc3ByaXRlUmFkaXVzLFxuICAgICAgICB0b3A6IGN1cnJCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIFVJLnNwcml0ZVJhZGl1c1xuICAgIH1cbiAgICBcbiAgICAvLyBhbiBvYmplY3QgdGhhdCBob2xkcyBzb21lIGRhdGEgb24gYSBjb2xsaXNpb24gaWYgZXhpc3RzXG4gICAgbGV0IGNvbGxpc2lvbiA9IG51bGw7XG4gICAgXG4gICAgbGV0IGR4ID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgIGxldCBkeSA9IC1NYXRoLmNvcyhhbmdsZSk7XG4gICAgXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IEJvYXJkLk5VTV9ST1c7IGkrKykge1xuICAgICAgICBcbiAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IEJvYXJkLk5VTV9DT0wgOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5W2ldW2pdO1xuICAgICAgICAgICAgaWYoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjb29yZHMgb2YgdGhlIGN1cnJlbnQgYnViYmxlXG4gICAgICAgICAgICAgICAgbGV0IGJ1YmJsZUNvb3JkcyA9IGJ1YmJsZS5nZXRDb29yZHMoKTtcbiAgICAgICAgICAgICAgICBsZXQgZGlzdFRvQnViYmxlID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiBzdGFydENlbnRlclBvcy5sZWZ0IC0gYnViYmxlQ29vcmRzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCAtIGJ1YmJsZUNvb3Jkcy50b3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IHQgPSBkeCAqIGRpc3RUb0J1YmJsZS54ICsgZHkgKiBkaXN0VG9CdWJibGUueTtcbiAgICAgICAgICAgICAgICAvLyBcbiAgICAgICAgICAgICAgICBsZXQgZXggPSAtdCAqIGR4ICsgc3RhcnRDZW50ZXJQb3MubGVmdDtcbiAgICAgICAgICAgICAgICBsZXQgZXkgPSAtdCAqIGR5ICsgc3RhcnRDZW50ZXJQb3MudG9wO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBkaXN0RUMgPSBNYXRoLnNxcnQoTWF0aC5wb3coKGV4IC0gYnViYmxlQ29vcmRzLmxlZnQpLCAyKSAtIE1hdGgucG93KChleSAtIGJ1YmJsZUNvb3Jkcy50b3ApLCAyKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZXBlbmRpY3VsYXIgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHJhamVjdG9yeSBhbmQgdGhlIGNlbnRlciBvZiB0aGUgY2hlY2tlZCBvdXQgYnViYmxlIGlzIGdyZWF0ZXIgdGhhbiAyUiwgdGhlbiBOTyBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICBpZiAoZGlzdEVDIDwgVUkuYnViYmxlUmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkdCA9IE1hdGguc3FydChNYXRoLnBvdyhVSS5idWJibGVSYWRpdXMsIDIpIC0gTWF0aC5wb3coZGlzdEVDLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQxID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogKHQgLSBkdCkgKiBkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IC0odCAtIGR0KSAqIGR5XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldDIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiAodCArIGR0KSAqIGR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogLSh0ICsgZHQpICogZHlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0VG9GaXJzdFBvaW50ID0gTWF0aC5zcXJ0KE1hdGgucG93KG9mZnNldDEueCwgMikgKyBNYXRoLnBvdyhvZmZzZXQxLnksIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0VG9TZWNvbmRQb2ludCA9IE1hdGguc3FydChNYXRoLnBvdyhvZmZzZXQyLnggLDIpICsgTWF0aC5wb3cob2Zmc2V0Mi55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBob2xkcyB0aGUgbmV3IGRpc3RhbmNlIGZyb20gdGhlIHN0YXJ0aW5nIHBvaW50IG9mIGZpcmluZyBhIGJhbGwgdG8gdGhlIGNvbGxpc29uIHBvaW50IHQgXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9sZHMgdGhlIGNvbGxpc2lvbiBwb2ludCBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sbGlzaW9uQ29vcmRzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdFRvRmlyc3RQb2ludCA8IGRpc3RUb1NlY29uZFBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEaXN0YW5jZSA9IGRpc3RUb0ZpcnN0UG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25Db29yZHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCArIG9mZnNldDEueCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCArIG9mZnNldDEueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGJ1YmJsZS5yb3cgKyAxXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Rpc3RhbmNlID0gZGlzdFRvU2Vjb25kUG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25Db29yZHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCAtIG9mZnNldDIueCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCArIG9mZnNldDIueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGJ1YmJsZS5yb3cgKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgY29sbGlzaW9uIHdhcyBkZXRlY3RlZCBhbmQgd2FzIGRpc3RhbmNlIHdhcyBzbWFsbGVyIHRoYW4gdGhlIHNtYWxsZXN0IGNvbGxpc2lvbiBkaXN0YW5lIHRpbGwgbm93XG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb2xsaXNpb24gfHwgbmV3RGlzdGFuY2UgPCBjb2xsaXNpb24uZGlzdGFuY2VUb0NvbGxpc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlVG9Db2xsaXNpb246IG5ld0Rpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZTogYnViYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29sbGlzaW9uQ29vcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICByZXR1cm4gY29sbGlzaW9uO1xuICAgIH0iLCJpbXBvcnQgKiBhcyBVSSBmcm9tIFwiLi91aS5qc1wiO1xuaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuL2J1YmJsZS5qc1wiO1xuaW1wb3J0ICogYXMgQm9hcmQgZnJvbSBcIi4vTW9kZWwvQm9hcmQuanNcIjtcbmltcG9ydCAqIGFzIENvbGxpc2lvbiBmcm9tIFwiLi9jb2xsaXNpb25EZXRlY3Rvci5qc1wiO1xuXG5sZXQgYm9hcmQgO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVUkubmV3R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgVUkucmVzaXplKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgVUkucmVzaXplKTtcbiAgICB9KTtcbn1cbiAgICBcbmZ1bmN0aW9uIHN0YXJ0R2FtZSAoKSB7XG4gICAgQm9hcmQuaW5pdCg1LDMwKTtcbiAgICBVSS5pbml0KCk7XG4gICAgVUkubmV3R2FtZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgICBVSS5oaWRlRGlhbG9nKCk7XG4gICAgXG4vLyAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICBcbiAgICAvLyBzZXQgdGhlIGZpcnN0IG5leHQgYnViYmxlXG4gICAgVUkucHJlcGFyZU5leHRCdWJibGUoKTtcbiAgICBVSS5yZXNpemUoKTtcbi8vICAgIFVJLmRyYXdCb2FyZCgpO1xuICAgIFxuICAgIFxuICAgIC8vIGFkZCBldmVudCBsaXN0bmVyIGZvciBtb3VzZSBjbGlja3Mgb24gdGhlIGJvYXJkXG4gICAgVUkuZ2FtZUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xuICAgIFVJLmdhbWVCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYmFsbEZpcmVkSGFuZGxlcik7XG59XG5cbmZ1bmN0aW9uIGJhbGxGaXJlZEhhbmRsZXIoZXZlbnQpIHtcbiAgICBcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB7fTtcbiAgICBpZihldmVudC50eXBlID09IFwidG91Y2hzdGFydFwiKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgY29vcmRpbmF0ZXMueSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gaGFuZGxpbmcgbW91c2VcbiAgICAgICAgY29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICBjb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XG4gICAgfVxuICAgIC8vIGdldCB0aGUgZmlyaW5nIGFuZ2xlXG4gICAgbGV0IGFuZ2xlID0gZ2V0QW5nbGVGcm9tRGV2aWNlKGNvb3JkaW5hdGVzKTtcbiAgICBcbiAgICAvLyBkZWZhdWx0IGRpc3RhbmNlIGFuZCBkdXJhdGlvblxuICAgIGxldCBhbmltYXRpb25EdXJhdGlvbiA9IDc1MDsgLy8gMC43NSBzZWNcbiAgICBsZXQgZGlzdGFuY2UgPSAxMDAwO1xuICAgIFxuICAgIGxldCBjb2xsaXNpb25IYXBwZW5lZCA9IENvbGxpc2lvbi5maW5kSW50ZXJzZWN0aW9uKGFuZ2xlLCBVSS5jdXJyZW50QnViYmxlKTtcbiAgICBcbiAgICBsZXQgYW5pbWF0aW9uQ2FsbGJhY2s7XG4gICAgbGV0IG5ld0J1YmJsZSA9IEJ1YmJsZS5kZWVwQ29weShVSS5jdXJyZW50QnViYmxlKTtcbiAgICBVSS5ib2FyZC5hcHBlbmRDaGlsZChuZXdCdWJibGUuZG9tKTtcbiAgICAvLyByYW5kb21seSBjaGFuZ2UgdGhlIHR5cGUgdG8gZ2V0IGEgbmV3IGJ1YmJsZSB3aXRoIGEgbmV3IGNvbG9yXG4gICAgVUkuY3VycmVudEJ1YmJsZS5jaGFuZ2VUeXBlKCk7XG4gICAgXG4gICAgLy8gaWYgY29sbGlzaW9uIG9jY3VycyBjaGFuZ2UgZGlzdGFuY2UgYW5kIGR1cmF0aW9uLlxuICAgIGlmIChjb2xsaXNpb25IYXBwZW5lZCkge1xuICAgICAgICBhbmltYXRpb25EdXJhdGlvbiA9IGFuaW1hdGlvbkR1cmF0aW9uICogY29sbGlzaW9uSGFwcGVuZWQuZGlzdGFuY2VUb0NvbGxpc2lvbiAvIGRpc3RhbmNlO1xuICAgICAgICBkaXN0YW5jZSA9IGNvbGxpc2lvbkhhcHBlbmVkLmRpc3RhbmNlVG9Db2xsaXNpb247XG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgYm9hcmQgc3RhdGUgd2l0aCB0aGUgcG9zaXRpb24gb2YgdGhlIG5ldyBidWJibGUuIGFsc28gdXBkYXRlIHRoZSBjb2wgYW5kIHJvdyBvZiB0aGUgYnViYmxlIG9iamVjdCBpdHNlbGZcbiAgICAgICAgQm9hcmQuYWRkQnViYmxlKG5ld0J1YmJsZSwgY29sbGlzaW9uSGFwcGVuZWQuY29vcmRzKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNoZWNrIGZvciBncm91cHMgd2l0aCB0aGUgc2FtZSBjb2xvciBsaWtlIG91ciBuZXcgYnViYmxlXG4gICAgICAgIGxldCBncm91cCA9IEJvYXJkLmdldEdyb3VwKG5ld0J1YmJsZSwge30pO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gcmUtcmVuZGVyIGFsbCB0aGUgZG9tIHRyZWUgd2hlbiB0aGUgYW5pbWF0aW9uIGZpbmlzaCB0byBwdXQgdGhlIG5ldyBidWJibGUgaW4gdGhlIGFwcHJvcHJpYXRlIHBvc2l0aW9uXG4gICAgICAgICAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICAgICAgICAgIGlmKGdyb3VwLmxpc3QubGVuZ3RoID49IDMpIHtcbiAgICAgICAgICAgICAgICBwb3BCdWJibGVzKGdyb3VwLmxpc3QpO1xuLy8gICAgICAgICAgICAgICAgVUkuZHJhd0JvYXJkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9IC8vIGVuZCBpZlxuICAgIFxuICAgIGVsc2Uge1xuICAgICAgICBhbmltYXRpb25DYWxsYmFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG5ld0J1YmJsZS5kb20ucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9IC8vIGVuZCBlbHNlXG4gICAgXG4gICAgLy8gZmlyZSB1cCB0aGUgYW5pbWF0aW9uXG4gICAgVUkuc3RhcnRCYWxsQW5pbWF0aW9uKG5ld0J1YmJsZSwgYW5nbGUsIGFuaW1hdGlvbkR1cmF0aW9uLCBkaXN0YW5jZSwgYW5pbWF0aW9uQ2FsbGJhY2spO1xuICAgIFxuICAgIFxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbn1cblxuZnVuY3Rpb24gZHJvcEJ1YmJsZXMob3JwaGFuQnViYmxlcykge1xuICAgIGxldCBwYXJ0aWFsQXBwbGljYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBvcnBoYW5CdWJibGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gb3JwaGFuQnViYmxlc1tpXTtcbiAgICAgICAgICAgIGxldCBidWJibGVEb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWJibGUucm93ICsgXCJcIiArIGJ1YmJsZS5jb2wpO1xuICAgICAgICAgICAgYnViYmxlRG9tLmFkZEV2ZW50TGlzdGVuZXIoXCJ0cmFuc2l0aW9uZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBCb2FyZC5kZWxldGVCdWJibGUoYnViYmxlKVxuICAgICAgICAgICAgICAgIGJ1YmJsZURvbS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIDAgKyBcInB4LFwiICsgMTUwMCArIFwicHgpXCI7XG4gICAgICAgICAgICBidWJibGVEb20uc3R5bGUud2Via2l0VHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyAwICsgXCJweCxcIiArIDE1MDAgKyBcInB4KVwiO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBwYXJ0aWFsQXBwbGljYXRpb247XG59XG5cblxuXG5cbmZ1bmN0aW9uIHBvcEJ1YmJsZXMgKGJ1YmJsZXMpe1xuICAgIGJ1YmJsZXMuZm9yRWFjaChidWJibGUgPT4gQm9hcmQuZGVsZXRlQnViYmxlKGJ1YmJsZSkpO1xuICAgIGxldCBvcnBoYW5zID0gQm9hcmQuZmluZE9ycGhhbnMoKTtcbiAgICBcbiAgICBidWJibGVzLmZvckVhY2goIChidWJibGUsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBidWJibGVEb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChidWJibGUucm93ICsgXCJcIiArIGJ1YmJsZS5jb2wpO1xuICAgICAgICAvLyBpZiBpdCB3YXMgdGhlIGxhc3QgYmFsbCBhbmltYXRlZCB0aGVuIHdlIHdhbnQgdG8gZHJvcCBidWJibGVzIGlmIGV4aXN0ZWRcbiAgICAgICAgaWYoKG9ycGhhbnMubGVuZ3RoID4gMCkgJiYgKGluZGV4ID09IGJ1YmJsZXMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICBhbmltYXRlVmFuaXNoKGJ1YmJsZURvbSwgYnViYmxlLCBkcm9wQnViYmxlcyhvcnBoYW5zKSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGFuaW1hdGVWYW5pc2goYnViYmxlRG9tLCBidWJibGUpO1xuICAgIH0pO1xufVxuXG5cblxuXG5mdW5jdGlvbiBhbmltYXRlVmFuaXNoIChidWJibGVEb20sIGJ1YmJsZSwgYW5pbWF0ZUNhbGxiYWNrKSB7XG4gICAgbGV0IG51bU9mSXRlcmF0aW9uID0gMTU7XG4gICAgbGV0IGNvdW50ZXIgPSBudW1PZkl0ZXJhdGlvbjtcbiAgICBcbiAgICBsZXQgYW5pbWF0ZUJ1YmJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoY291bnRlciA9PSBudW1PZkl0ZXJhdGlvbikge1xuICAgICAgICAgICAgYnViYmxlRG9tLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IFwiMzMuMzMzMzMzMzMlIFwiICsgYnViYmxlLmdldEhlaWdodFBvc0Zyb21UeXBlKCkgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNvdW50ZXIgPT0gTWF0aC5mbG9vcihudW1PZkl0ZXJhdGlvbiAqIDIvMykpIHtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjY2LjY2NjY2NjY3JVwiICsgYnViYmxlLmdldEhlaWdodFBvc0Zyb21UeXBlKCkgKyBcIiVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGNvdW50ZXIgPT0gTWF0aC5mbG9vcihudW1PZkl0ZXJhdGlvbiAqIDEvMykpIHtcbiAgICAgICAgICAgIGJ1YmJsZURvbS5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjEwMCVcIiArIGJ1YmJsZS5nZXRIZWlnaHRQb3NGcm9tVHlwZSgpICsgXCIlXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYoY291bnRlciA9PSAwKSB7XG4gICAgICAgICAgICBidWJibGVEb20ucmVtb3ZlKCk7XG4gICAgICAgICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShsb29wSUQpO1xuICAgICAgICAgICAgaWYoYW5pbWF0ZUNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgd2FzIHRoZSBsYXN0IGJ1YmJsZSB0byBiZSBhbmltYXRlZCB0aGVuIHdlIHdhbnQgdG8gYW5pbWF0ZSBvcnBoYW5zIGlmIHRoZSBleGlzdFxuICAgICAgICAgICAgICAgIGFuaW1hdGVDYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY291bnRlciAtLTtcbiAgICAgICAgICAgIGxvb3BJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlQnViYmxlKTsgICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH0gICBcbiAgICBcbiAgICBsZXQgbG9vcElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVCdWJibGUpO1xufVxuXG5mdW5jdGlvbiBnZXRBbmdsZUZyb21EZXZpY2UgKGRldmljZVhZKSB7XG4vLyAgICBhbGVydChcImluIHRoZSBnZXQgQW5nbGVcIik7XG4gICAgbGV0IEJ1YmJsZVhZID0ge1xuICAgICAgICB4OiBVSS5jdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgVUkuY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLzIsXG4gICAgICAgIHk6IFVJLmN1cnJlbnRCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIFVJLmN1cnJlbnRCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCAvMlxuICAgIH07XG4gICAgXG4gICAgbGV0IGZpcmVBbmdsZSA9IE1hdGguYXRhbigoZGV2aWNlWFkueCAtIEJ1YmJsZVhZLngpIC8gKEJ1YmJsZVhZLnkgLSBkZXZpY2VYWS55KSk7XG4gICAgXG4vLyAgICBsZXQgZmlyZUFuZ2xlID0gTWF0aC5hdGFuMigoZGV2aWNlWFkueCAtIEJ1YmJsZVhZLngpICwgKEJ1YmJsZVhZLnkgLSBkZXZpY2VYWS55KSk7XG5cbiAgICBcbiAgICAgLy9pZiB0aGUgcGxheWVyIGZpcmVkIHRoZSBiYWxsIGF0IGFwcm94aW1hdGx5IGhvcml6b250YWwgbGV2ZWxcbi8vICAgIGlmKGRldmljZVhZLnkgPiBCdWJibGVYWS55KSB7XG4vLyAgICAgICAgZmlyZUFuZ2xlID0gZmlyZUFuZ2xlICsgTWF0aC5QSTtcbi8vICAgIH1cbiAgICBcbiAgICByZXR1cm4gZmlyZUFuZ2xlO1xufVxuXG4iLCJpbXBvcnQgKiBhcyBCdWJibGUgZnJvbSBcIi4vYnViYmxlLmpzXCI7XG5pbXBvcnQgKiBhcyBCb2FyZCBmcm9tIFwiLi9Nb2RlbC9Cb2FyZC5qc1wiO1xuXG5leHBvcnQgbGV0IG5ld0dhbWVEaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0X2dhbWVfZGlhbG9nXCIpO1xuZXhwb3J0IGxldCBjdXJyZW50QnViYmxlO1xuZXhwb3J0IGxldCBnYW1lQm9hcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbWVcIik7XG5leHBvcnQgbGV0IG5ld0dhbWVCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm5ld19nYW1lX2J1dHRvblwiKTtcbmV4cG9ydCBsZXQgdG9wYmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3BiYXJcIik7XG5leHBvcnQgbGV0IGZvb3RlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZm9vdGVyXCIpO1xuXG5leHBvcnQgbGV0IGJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcblxuXG5leHBvcnQgbGV0IGJvYXJkV2lkdGg7XG5leHBvcnQgbGV0IGJvYXJkSGVpZ2h0O1xuXG5leHBvcnQgbGV0IHNwcml0ZVJhZGl1cyA9IDA7XG5leHBvcnQgbGV0IGJ1YmJsZVJhZGl1cyA9IDA7XG5leHBvcnQgbGV0IHR3b1NpZGVzRW1wdHlTcGFjZSA9IDA7XG5cbi8vIG51bWJlciBvZiBjb2wgaW4gdGhlIGJvYXJkXG5sZXQgbnVtT2ZDb2w7XG4vLyBudW1iZXIgb2Ygcm93cyBpbiB0aGUgYm9hcmRcbmxldCBudW1PZlJvdztcblxubGV0IGJvYXJkSW5pdGlhdGVkO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgbnVtT2ZDb2wgPSBCb2FyZC5OVU1fQ09MIC8gMjsgIFxuICAgIG51bU9mUm93ID0gQm9hcmQuTlVNX1JPVztcbiAgICBib2FyZEluaXRpYXRlZCA9IGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZURpYWxvZyAoKSB7XG4gICAgbmV3R2FtZURpYWxvZy5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG4gICAgbmV3R2FtZURpYWxvZy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRCYWxsQW5pbWF0aW9uIChmaXJlZEJ1YmJsZSwgYW5nbGUsIGR1cmF0aW9uLCBkaXN0YW5jZSwgYW5pbWF0aW9uQ2FsbGJhY2spIHtcbi8vICAgIGxldCBhbmdsZSA9IGdldEFuZ2xlRnJvbURldmljZShkZXZpY2VYWSk7XG4vLyAgICBsZXQgZGlzdGFuY2UgPSAxMDAwO1xuICAgIC8vIGxldCB1cyBhc3N1bWUgdGhhdCB3ZSB3aWxsIGZpcmUgdGhlIGJhbGwgZm9yIDEwMDBweCBmb3Igbm93XG4gICAgbGV0IGRpc3RhbmNlWCA9IE1hdGguc2luKGFuZ2xlKSAqIGRpc3RhbmNlO1xuICAgIGxldCBkaXN0YW5jZVkgPSBNYXRoLmNvcyhhbmdsZSkgKiBkaXN0YW5jZTtcbiAgICBcbiAgICBsZXQgbnVtYmVyT2ZJdGVyYXRpb25zID0gTWF0aC5jZWlsKGR1cmF0aW9uIC8gMTYpOyBcbiAgICBsZXQgeEV2ZXJ5RnJhbWUgPSBkaXN0YW5jZVggLyBudW1iZXJPZkl0ZXJhdGlvbnM7XG4gICAgbGV0IHlFdmVyeUZyYW1lID0gZGlzdGFuY2VZIC8gbnVtYmVyT2ZJdGVyYXRpb25zO1xuICAgICAgICBcbiAgICBsZXQgYW5pbWF0aW9uTG9vcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlyZWRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAocGFyc2VGbG9hdChmaXJlZEJ1YmJsZS5kb20uc3R5bGUubGVmdCkgKyB4RXZlcnlGcmFtZSkgKyBcInB4XCI7XG4gICAgICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS50b3AgPSAocGFyc2VGbG9hdChmaXJlZEJ1YmJsZS5kb20uc3R5bGUudG9wKSAtIHlFdmVyeUZyYW1lKSArIFwicHhcIjtcbiAgICAgICAgXG4gICAgICAgIG51bWJlck9mSXRlcmF0aW9ucyAtLTtcbiAgICAgICAgaWYgKG51bWJlck9mSXRlcmF0aW9ucyA9PT0gMCkge1xuICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUobG9vcElEKTtcbiAgICAgICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsb29wSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgbGV0IGxvb3BJRCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRpb25Mb29wKTtcbiAgICBcbi8vICAgIFVJLmZpcmVkQnViYmxlLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIGRpc3RhbmNlWCArIFwicHgsXCIgKyBkaXN0YW5jZVkgKyBcInB4KVwiO1xufSAgIFxuICAgIFxuZXhwb3J0IGZ1bmN0aW9uIHByZXBhcmVOZXh0QnViYmxlKCkge1xuICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbiAgICAgICAgXG4gICAgfVxuICAgIGN1cnJlbnRCdWJibGUgPSBCdWJibGUuY3JlYXRlKC0xLCAtMSk7XG4gICAgXG4gICAgLy8gbWFrZSB0aGUgbmV3IGJ1YmJsZSB0aGUgY3VycmVudCBidWJibGUsIHRoZW4gYWRkIGl0IHRvIHRoZSBkb21cbiAgICBjdXJyZW50QnViYmxlLmRvbS5jbGFzc0xpc3QuYWRkKFwiY3Vycl9idWJibGVcIik7XG4gICAgXG4vLyAgICBib2FyZC5hcHBlbmRDaGlsZChjdXJyZW50QnViYmxlLmRvbSk7ICAgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzaXplICgpIHtcbiAgICBcbiAgICBsZXQgZ2FtZVdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IGdhbWVIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICBsZXQgc2NhbGVUb0ZpdFggPSBnYW1lV2lkdGggLyA3MjA7IC8vIHRoZSBnYW1lIHdpbGwgYmUgcGxheWFibGUgaW4gcG9ydHJhaXQgbW9kZSwgc28gNzIwIGZvciBob3Jpem9udGFsIGFuZCAxMjgwIGZvciB2ZXJ0aWNhbFxuICAgIGxldCBzY2FsZVRvRml0WSA9IGdhbWVIZWlnaHQgLyAxMjgwO1xuICAgIGxldCBvcHRpbWFsUmF0aW8gPSBNYXRoLm1pbihzY2FsZVRvRml0WCwgc2NhbGVUb0ZpdFkpO1xuLy8gICAgdmFyIG9wdGltYWxSYXRpbyA9IE1hdGgubWF4KHNjYWxlVG9GaXRYLCBzY2FsZVRvRml0WSk7XG5cbiAgICBib2FyZFdpZHRoID0gKDcyMCAqIG9wdGltYWxSYXRpbyk7XG4gICAgYm9hcmRIZWlnaHQgPSAoKDEyODAgKiBvcHRpbWFsUmF0aW8pIC0gKHRvcGJhci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgKyBmb290ZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KSk7XG4gICAgYnViYmxlUmFkaXVzID0gKGJvYXJkV2lkdGggLyAobnVtT2ZDb2wgKzEpKSAvIDI7XG4gICAgc3ByaXRlUmFkaXVzID0gYnViYmxlUmFkaXVzIC8gMC44ODtcbiAgICBcbiAgICBib2FyZC5zdHlsZS53aWR0aCA9IGJvYXJkV2lkdGggKyBcInB4XCI7XG4gICAgYm9hcmQuc3R5bGUuaGVpZ2h0ID0gYm9hcmRIZWlnaHQgKyBcInB4XCI7XG4gICAgXG4gICAgXG4gICAgXG4vLyAgICBjdXJyZW50QnViYmxlLmxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChidWJibGVSYWRpdXMpKSArIFwicHhcIjtcbi8vICAgIGN1cnJlbnRCdWJibGUudG9wID0gKGJvYXJkSGVpZ2h0IC0gKGJ1YmJsZVJhZGl1cyAqIDMpKSArIFwicHhcIjtcbiAgICBcbiAgICBkcmF3Qm9hcmQoKTtcbi8vICAgIGxldCBidWJibGVXaWR0aCA9IChuZXdCb2FyZFdpZHRoIC8gbnVtT2ZDb2wgKzMpO1xuLy8gICAgLy8gdXBkYXRlIGdsb2JhbCBidWJibGVSYWRpdXMgdmFyaWFibGVcbi8vICAgIFxuLy8vLyAgICBjc3NSZW5kZXIoYnViYmxlV2lkdGgpO1xuLy8gICAgLy8gcmVzaXplIHRoZSBjdXJyZW50QnViYmxlXG4vLyAgICBpZihjdXJyZW50QnViYmxlKSB7XG4vLy8vICAgICAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS5sZWZ0ID0gKCAobmV3Qm9hcmRXaWR0aCAvIDIpIC0gKGJ1YmJsZVdpZHRoIC8yKSApICsgXCJweFwiO1xuLy8gICAgfVxuXG4gICAgXG5cbn1cbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBzZXROZXdCdWJibGVQb3NpdGlvbigpIHtcbiAgICBsZXQgd2lkdGggPSAoc3ByaXRlUmFkaXVzICogMikgKyBcInB4XCI7XG4gICAgbGV0IGxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChzcHJpdGVSYWRpdXMpKSArIFwicHhcIjtcbiAgICBsZXQgdG9wID0gKGJvYXJkSGVpZ2h0IC0gKHNwcml0ZVJhZGl1cyAqIDMpKSArIFwicHhcIjtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcImN1cnJlbnRcIik7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUubGVmdCA9IGxlZnQ7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUudG9wID0gdG9wO1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUuaGVpZ2h0ID0gd2lkdGg7XG4vLyAgICBjdXJyZW50QnViYmxlLmRvbS5jbGFzc0xpc3QuYWRkKFwiY3Vycl9idWJibGVcIik7XG59XG4gICAgXG4gICAgXG5leHBvcnQgZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICAgIGxldCBib2FyZEFycmF5ID0gQm9hcmQuZ2V0Qm9hcmRBcnJheSgpO1xuLy8gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCB3aWR0aCA9IHNwcml0ZVJhZGl1cyAqIDI7XG4gICAgbGV0IGh0bWxTdHJpbmcgPSBcIlwiO1xuICAgIFxuICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbiAgICAgICAgbGV0IGxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChzcHJpdGVSYWRpdXMpKSArIFwicHhcIjtcbiAgICAgICAgbGV0IHRvcCA9IChib2FyZEhlaWdodCAtIChzcHJpdGVSYWRpdXMgKiAzKSkgKyBcInB4XCI7XG4gICAgICAgIGh0bWxTdHJpbmcgKz0gXCI8ZGl2IGlkPSdjdXJyZW50JyBjbGFzcz0nYnViYmxlIGJ1YmJsZVwiICsgY3VycmVudEJ1YmJsZS50eXBlICsgXCInIHN0eWxlPScgd2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggKyBcInB4O1wiICsgXCJsZWZ0OiBcIiArICgoYm9hcmRXaWR0aCAvIDIpIC0gKHNwcml0ZVJhZGl1cykpICsgXCJweDtcIiArIFwiIHRvcDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAoYm9hcmRIZWlnaHQgLSAoc3ByaXRlUmFkaXVzICogMykpICsgXCJweDsnID4gPC9kaXY+XCI7XG4gICAgICAgIFxuLy8gICAgICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAoIChuZXdCb2FyZFdpZHRoIC8gMikgLSAoYnViYmxlV2lkdGggLzIpICkgKyBcInB4XCI7XG4gICAgfVxuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQm9hcmQuTlVNX1JPVzsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtT2ZDb2wgKiAyOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5W2ldW2pdO1xuICAgICAgICAgICAgLy8gdGhlcmUgZXhpc3QgYSBidWJibGUgb24gdGhhdCBpbmRleCAoZXZlbiByb3dzIGhhdmUgYnViYmxlIG9uIHRoZSBvZGQgY29sdW1uIGluZGljaWVzKVxuICAgICAgICAgICAgaWYoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnQgPSAoaiAqIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IChpICogYnViYmxlUmFkaXVzICogMiAtIChzcHJpdGVSYWRpdXMgKiAwLjE1ICogaSkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY29vcmRzIGluIHRoZSBidWJibGUgb2JqZWN0ICh0aGVzZSBjb29yZHMgYXJlIGNvb3JkcyBvZiB0aGUgY2VudGVyIG9mIHRoZSBidWJibGUpXG4gICAgICAgICAgICAgICAgYnViYmxlLnNldENvb3JkcyhsZWZ0ICsgIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBidWJibGVSYWRpdXMsIHRvcCArIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaHRtbFN0cmluZyArPSBcIjxkaXYgaWQ9J1wiICsgaSArIFwiXCIgKyBqICsgXCInIGNsYXNzPSdidWJibGUgYnViYmxlXCIgKyBidWJibGUudHlwZSArIFwiJyBzdHlsZT0nbGVmdDogXCIgKyBsZWZ0ICsgXCJweDsgdG9wOiBcIiArIHRvcCArXG4gICAgICAgICAgICAgICAgICAgIFwicHg7IHdpZHRoOiBcIiArIHdpZHRoICsgXCJweDtoZWlnaHQ6IFwiICsgd2lkdGggKyBcInB4OycgPjwvZGl2PlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYm9hcmQuaW5uZXJIVE1MID0gaHRtbFN0cmluZztcbiAgICBjdXJyZW50QnViYmxlLnNldERPTShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImN1cnJlbnRcIikpO1xuLy8gICAgYm9hcmQuYXBwZW5kQ2hpbGQoZnJhZ21lbnQpO1xuLy8gICAgY3NzUmVuZGVyKGJ1YmJsZVJhZGl1cyAqIDIpO1xuLy8gICAgYm9hcmRJbml0aWF0ZWQgPSB0cnVlO1xufVxuXG4iXX0=
