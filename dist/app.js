(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;

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
    UI.currentBubble.changeType();

    // if collision occurs change distance and duration.
    if (collisionHappened) {
        animationDuration = animationDuration * collisionHappened.distanceToCollision / distance;
        distance = collisionHappened.distanceToCollision;

        animationCallback = function () {
            //            UI.currentBubble.dom.removeAttribute("id");
            Board.addBubble(newBubble, collisionHappened.coords);
            UI.drawBoard();
        };
    } // end if

    else {
            //        UI.setNewBubblePosition();
            animationCallback = function () {
                newBubble.dom.remove();
            };
        } // end else

    // fire up the animation
    UI.startBallAnimation(newBubble, angle, animationDuration, distance, animationCallback);

    event.preventDefault();
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

                htmlString += "<div class='bubble bubble" + bubble.type + "' style='left: " + left + "px; top: " + _top2 + "px; width: " + width + "px;height: " + width + "px;' ></div>";
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvTW9kZWwvQm9hcmQuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvYXBwLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2J1YmJsZS5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9jb2xsaXNpb25EZXRlY3Rvci5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9nYW1lLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL3VpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozt3QkNBd0IsZ0JBQWdCOztJQUE1QixNQUFNOztvQkFDRSxZQUFZOztJQUFwQixFQUFFOztBQUVQLElBQUksT0FBTyxZQUFBLENBQUU7O0FBQ2IsSUFBSSxPQUFPLFlBQUEsQ0FBQzs7O0FBRW5CLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsSUFBSSxLQUFLLEdBQUcsU0FBUixLQUFLLEdBQWU7QUFDcEIsUUFBSSxXQUFXLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztDQUV6QyxDQUFBOztBQUVNLElBQUksU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFhLE1BQU0sRUFBRSxNQUFNLEVBQUU7O0FBRTdDLFFBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEIsVUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLENBQUM7QUFDNUQsUUFBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTs7S0FFbkI7O0FB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RUQsU0FBSyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7QUFDN0IsaUJBQWEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7O0NBSTVEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIEJ1YmJsZSBmcm9tIFwiLi8uLi9idWJibGUuanNcIjtcbmltcG9ydCAqIGFzIFVJIGZyb20gXCIuLy4uL3VpLmpzXCI7XG5cbmV4cG9ydCBsZXQgTlVNX1JPVyA7XG5leHBvcnQgbGV0IE5VTV9DT0w7XG5cbmxldCBib2FyZEFycmF5ID0gW107XG5cbmxldCBCb2FyZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsZXQgYnViYmxlQXJyYXkgPSBjcmVhdGVCdWJibGVBcnJheSgpO1xuICAgIFxufVxuXG5leHBvcnQgbGV0IGFkZEJ1YmJsZSA9IGZ1bmN0aW9uIChidWJibGUsIGNvb3Jkcykge1xuLy8gICAgbGV0IHJvd051bSA9IE1hdGguZmxvb3IoY29vcmRzLnkgLyAoVUkuYnViYmxlUmFkaXVzICogMikpO1xuICAgIGxldCByb3dOdW0gPSBjb29yZHMueTtcbiAgICBjb29yZHMueCA9IGNvb3Jkcy54IC0gVUkuYm9hcmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICBpZihyb3dOdW0gJSAyID09IDApIHtcbi8vICAgICAgICBjb29yZHMueCA9IGNvb3Jkcy54IC0gVUkuc3ByaXRlUmFkaXVzIC8yXG4gICAgfVxuICAgIFxuICAgIGxldCBjb2xOdW07XG4vLyAgICBsZXQgY29sTnVtID0gTWF0aC5yb3VuZChjb29yZHMueCAvIChVSS5idWJibGVSYWRpdXMgKiAyKSk7IFxuLy8gICAgY29sTnVtIC09IDE7XG4vLyAgICBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvbE51bSAvIDIpICogMjtcbiAgICBcbiAgICBpZiAocm93TnVtICUgMiA9PT0gMCkge1xuICAgICBjb2xOdW0gPSBNYXRoLnJvdW5kKGNvb3Jkcy54IC8gKFVJLmJ1YmJsZVJhZGl1cyAqIDIpKTsgXG5cbiAgICAgICAgY29sTnVtID0gKGNvbE51bSAqIDIpIC0gMTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbE51bSA9IE1hdGguZmxvb3IoY29vcmRzLnggLyAoVUkuYnViYmxlUmFkaXVzICogMikpOyBcblxuICAgICAgICBjb2xOdW0gPSAoY29sTnVtICogMikgIDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFib2FyZEFycmF5W3Jvd051bV0pIHtcbiAgICAgICAgYm9hcmRBcnJheVtyb3dOdW1dID0gW107XG4gICAgICAgIE5VTV9ST1cgKys7XG4gICAgfVxuLy8gICAgZWxzZSBpZiAoYm9hcmRBcnJheVtyb3dOdW1dW2NvbE51bV0gIT0gZmFsc2UpIHtcbi8vICAgICAgICBiXG4vLyAgICB9XG4gICAgYnViYmxlLnNldENvbChjb2xOdW0pO1xuICAgIGJ1YmJsZS5zZXRSb3cocm93TnVtKTtcbiAgICBib2FyZEFycmF5W3Jvd051bV1bY29sTnVtXSA9IGJ1YmJsZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCAobnVtUm93cywgbnVtQ29scykge1xuICAgIE5VTV9ST1cgPSBudW1Sb3dzO1xuICAgIE5VTV9DT0wgPSBudW1Db2xzO1xuICAgIFxuICAgIGNyZWF0ZUJvYXJkQXJyYXkoKTsgICAgXG59XG5cbmV4cG9ydCBsZXQgZ2V0Qm9hcmRBcnJheSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBib2FyZEFycmF5O1xufSBcbiAgICBcbmxldCBjcmVhdGVCb2FyZEFycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvcihsZXQgaSA9IDA7IGkgPCBOVU1fUk9XOyBpKyspIHtcbiAgICAgICAgbGV0IHN0YXJ0Q29sID0gaSUyID09IDAgPyAxIDogMDtcbiAgICAgICAgYm9hcmRBcnJheVtpXSA9IFtdO1xuICAgICAgICBcbiAgICAgICAgZm9yIChsZXQgaiA9IHN0YXJ0Q29sIDsgaiA8IE5VTV9DT0w7IGorPSAyKSB7XG4gICAgICAgICAgICBsZXQgYnViYmxlID0gQnViYmxlLmNyZWF0ZShpLCBqKTtcbiAgICAgICAgICAgIGJvYXJkQXJyYXlbaV1bal0gPSBidWJibGU7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0ICogYXMgZ2FtZSBmcm9tIFwiLi9nYW1lLmpzXCI7XG5cbmdhbWUuaW5pdCgpOyIsImltcG9ydCAqIGFzIFVJIGZyb20gXCIuL3VpLmpzXCI7XG5cbmZ1bmN0aW9uIEJ1YmJsZSAoZG9tRWxlbWVudCwgcm93LCBjb2wsIHR5cGUpIHtcbiAgICBkb21FbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJidWJibGVcIik7XG4gICAgZG9tRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIgKyB0eXBlKTtcbiAgICB0aGlzLmRvbSA9IGRvbUVsZW1lbnQ7XG4gICAgdGhpcy5jb2wgPSBjb2w7XG4gICAgdGhpcy5yb3cgPSByb3c7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRUeXBlID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xufVxuXG5CdWJibGUucHJvdG90eXBlLnNldERPTSA9IGZ1bmN0aW9uIChuZXdEb20pIHtcbiAgICB0aGlzLmRvbSA9IG5ld0RvbTtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRDb29yZHMgPSBmdW5jdGlvbiAobGVmdCwgdG9wKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRDb2wgPSBmdW5jdGlvbihjb2wpIHtcbiAgICB0aGlzLmNvbCA9IGNvbDtcbn1cblxuQnViYmxlLnByb3RvdHlwZS5zZXRSb3cgPSBmdW5jdGlvbiAocm93KSB7XG4gICAgdGhpcy5yb3cgPSByb3c7XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuZ2V0Q29vcmRzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGxlZnQ6IHRoaXMubGVmdCxcbiAgICAgICAgdG9wOiB0aGlzLnRvcFxuICAgIH07XG59XG5cbkJ1YmJsZS5wcm90b3R5cGUuY2hhbmdlVHlwZSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgdGhpcy5kb20uY2xhc3NMaXN0LnJlbW92ZShcImJ1YmJsZVwiICsgdGhpcy50eXBlKTtcbiAgICBpZiAodHlwZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHR5cGUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA0KTtcbiAgICB9XG4gICAgdGhpcy5zZXRUeXBlKHR5cGUpO1xuICAgIHRoaXMuZG9tLmNsYXNzTGlzdC5hZGQoXCJidWJibGVcIiArIHR5cGUpO1xufVxuXG5leHBvcnQgbGV0IGNyZWF0ZSA9IGZ1bmN0aW9uIChyb3csIGNvbCwgdHlwZSkge1xuICAgIGxldCBidWJibGVET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIFxuICAgIGlmICh0eXBlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdHlwZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDQpO1xuICAgIH1cbiAgICBsZXQgbmV3QnViYmxlID0gbmV3IEJ1YmJsZShidWJibGVET00sIHJvdywgY29sLCB0eXBlKTtcbiAgICBcbiAgICByZXR1cm4gbmV3QnViYmxlO1xuICAgIFxufVxuXG5leHBvcnQgbGV0IGRlZXBDb3B5ID0gZnVuY3Rpb24gKGNvcGllZEJ1YmJsZSkge1xuICAgIGxldCBuZXdCdWJibGVEb20gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS5sZWZ0ID0gY29waWVkQnViYmxlLmRvbS5zdHlsZS5sZWZ0O1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS50b3AgPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLnRvcDtcbiAgICBuZXdCdWJibGVEb20uc3R5bGUud2lkdGggPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLndpZHRoO1xuICAgIG5ld0J1YmJsZURvbS5zdHlsZS5oZWlnaHQgPSBjb3BpZWRCdWJibGUuZG9tLnN0eWxlLmhlaWdodDtcbiAgICBcbiAgICByZXR1cm4gbmV3IEJ1YmJsZSAobmV3QnViYmxlRG9tLCAtMSwgLTEsIGNvcGllZEJ1YmJsZS50eXBlKTtcbn0iLCJpbXBvcnQgKiBhcyBCb2FyZCBmcm9tIFwiLi9Nb2RlbC9Cb2FyZC5qc1wiO1xuaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vdWkuanNcIjtcblxubGV0IGJvYXJkQXJyYXkgPSBCb2FyZC5nZXRCb2FyZEFycmF5KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW50ZXJzZWN0aW9uKGFuZ2xlLCBjdXJyQnViYmxlKSB7XG4gICAgbGV0IHN0YXJ0Q2VudGVyUG9zID0ge1xuICAgICAgICBsZWZ0OiBjdXJyQnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICsgVUkuc3ByaXRlUmFkaXVzLFxuICAgICAgICB0b3A6IGN1cnJCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIFVJLnNwcml0ZVJhZGl1c1xuICAgIH1cbiAgICBcbiAgICAvLyBhbiBvYmplY3QgdGhhdCBob2xkcyBzb21lIGRhdGEgb24gYSBjb2xsaXNpb24gaWYgZXhpc3RzXG4gICAgbGV0IGNvbGxpc2lvbiA9IG51bGw7XG4gICAgXG4gICAgbGV0IGR4ID0gTWF0aC5zaW4oYW5nbGUpO1xuICAgIGxldCBkeSA9IC1NYXRoLmNvcyhhbmdsZSk7XG4gICAgXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IEJvYXJkLk5VTV9ST1c7IGkrKykge1xuICAgICAgICBcbiAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IEJvYXJkLk5VTV9DT0wgOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5W2ldW2pdO1xuICAgICAgICAgICAgaWYoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBjb29yZHMgb2YgdGhlIGN1cnJlbnQgYnViYmxlXG4gICAgICAgICAgICAgICAgbGV0IGJ1YmJsZUNvb3JkcyA9IGJ1YmJsZS5nZXRDb29yZHMoKTtcbiAgICAgICAgICAgICAgICBsZXQgZGlzdFRvQnViYmxlID0ge1xuICAgICAgICAgICAgICAgICAgICB4OiBzdGFydENlbnRlclBvcy5sZWZ0IC0gYnViYmxlQ29vcmRzLmxlZnQsXG4gICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCAtIGJ1YmJsZUNvb3Jkcy50b3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IHQgPSBkeCAqIGRpc3RUb0J1YmJsZS54ICsgZHkgKiBkaXN0VG9CdWJibGUueTtcbiAgICAgICAgICAgICAgICAvLyBcbiAgICAgICAgICAgICAgICBsZXQgZXggPSAtdCAqIGR4ICsgc3RhcnRDZW50ZXJQb3MubGVmdDtcbiAgICAgICAgICAgICAgICBsZXQgZXkgPSAtdCAqIGR5ICsgc3RhcnRDZW50ZXJQb3MudG9wO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBkaXN0RUMgPSBNYXRoLnNxcnQoTWF0aC5wb3coKGV4IC0gYnViYmxlQ29vcmRzLmxlZnQpLCAyKSAtIE1hdGgucG93KChleSAtIGJ1YmJsZUNvb3Jkcy50b3ApLCAyKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHByZXBlbmRpY3VsYXIgZGlzdGFuY2UgYmV0d2VlbiB0aGUgdHJhamVjdG9yeSBhbmQgdGhlIGNlbnRlciBvZiB0aGUgY2hlY2tlZCBvdXQgYnViYmxlIGlzIGdyZWF0ZXIgdGhhbiAyUiwgdGhlbiBOTyBjb2xsaXNpb25cbiAgICAgICAgICAgICAgICBpZiAoZGlzdEVDIDwgVUkuYnViYmxlUmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBkdCA9IE1hdGguc3FydChNYXRoLnBvdyhVSS5idWJibGVSYWRpdXMsIDIpIC0gTWF0aC5wb3coZGlzdEVDLCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBvZmZzZXQxID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgeDogKHQgLSBkdCkgKiBkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHk6IC0odCAtIGR0KSAqIGR5XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IG9mZnNldDIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB4OiAodCArIGR0KSAqIGR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogLSh0ICsgZHQpICogZHlcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0VG9GaXJzdFBvaW50ID0gTWF0aC5zcXJ0KE1hdGgucG93KG9mZnNldDEueCwgMikgKyBNYXRoLnBvdyhvZmZzZXQxLnksIDIpKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGxldCBkaXN0VG9TZWNvbmRQb2ludCA9IE1hdGguc3FydChNYXRoLnBvdyhvZmZzZXQyLnggLDIpICsgTWF0aC5wb3cob2Zmc2V0Mi55LCAyKSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBob2xkcyB0aGUgbmV3IGRpc3RhbmNlIGZyb20gdGhlIHN0YXJ0aW5nIHBvaW50IG9mIGZpcmluZyBhIGJhbGwgdG8gdGhlIGNvbGxpc29uIHBvaW50IHQgXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9sZHMgdGhlIGNvbGxpc2lvbiBwb2ludCBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29sbGlzaW9uQ29vcmRzO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGlzdFRvRmlyc3RQb2ludCA8IGRpc3RUb1NlY29uZFBvaW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdEaXN0YW5jZSA9IGRpc3RUb0ZpcnN0UG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25Db29yZHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCArIG9mZnNldDEueCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCArIG9mZnNldDEueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGJ1YmJsZS5yb3cgKyAxXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Rpc3RhbmNlID0gZGlzdFRvU2Vjb25kUG9pbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xsaXNpb25Db29yZHMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogc3RhcnRDZW50ZXJQb3MubGVmdCAtIG9mZnNldDIueCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2VudGVyUG9zLnRvcCArIG9mZnNldDIueVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHk6IGJ1YmJsZS5yb3cgKyAxXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIGEgY29sbGlzaW9uIHdhcyBkZXRlY3RlZCBhbmQgd2FzIGRpc3RhbmNlIHdhcyBzbWFsbGVyIHRoYW4gdGhlIHNtYWxsZXN0IGNvbGxpc2lvbiBkaXN0YW5lIHRpbGwgbm93XG4gICAgICAgICAgICAgICAgICAgIGlmKCFjb2xsaXNpb24gfHwgbmV3RGlzdGFuY2UgPCBjb2xsaXNpb24uZGlzdGFuY2VUb0NvbGxpc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29sbGlzaW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlVG9Db2xsaXNpb246IG5ld0Rpc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1YmJsZTogYnViYmxlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvb3JkczogY29sbGlzaW9uQ29vcmRzXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIH1cbiAgICByZXR1cm4gY29sbGlzaW9uO1xuICAgIH0iLCJpbXBvcnQgKiBhcyBVSSBmcm9tIFwiLi91aS5qc1wiO1xuaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuL2J1YmJsZS5qc1wiO1xuaW1wb3J0ICogYXMgQm9hcmQgZnJvbSBcIi4vTW9kZWwvQm9hcmQuanNcIjtcbmltcG9ydCAqIGFzIENvbGxpc2lvbiBmcm9tIFwiLi9jb2xsaXNpb25EZXRlY3Rvci5qc1wiO1xuXG5sZXQgYm9hcmQgO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVUkubmV3R2FtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgVUkucmVzaXplKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwib3JpZW50YXRpb25jaGFuZ2VcIiwgVUkucmVzaXplKTtcbiAgICB9KTtcbn1cbiAgICBcbmZ1bmN0aW9uIHN0YXJ0R2FtZSAoKSB7XG4gICAgQm9hcmQuaW5pdCg1LDMwKTtcbiAgICBVSS5pbml0KCk7XG4gICAgVUkubmV3R2FtZUJ1dHRvbi5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc3RhcnRHYW1lKTtcbiAgICBVSS5oaWRlRGlhbG9nKCk7XG4gICAgXG4vLyAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICBcbiAgICAvLyBzZXQgdGhlIGZpcnN0IG5leHQgYnViYmxlXG4gICAgVUkucHJlcGFyZU5leHRCdWJibGUoKTtcbiAgICBVSS5yZXNpemUoKTtcbi8vICAgIFVJLmRyYXdCb2FyZCgpO1xuICAgIFxuICAgIFxuICAgIC8vIGFkZCBldmVudCBsaXN0bmVyIGZvciBtb3VzZSBjbGlja3Mgb24gdGhlIGJvYXJkXG4gICAgVUkuZ2FtZUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xuICAgIFVJLmdhbWVCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYmFsbEZpcmVkSGFuZGxlcik7XG59XG5cbmZ1bmN0aW9uIGJhbGxGaXJlZEhhbmRsZXIoZXZlbnQpIHtcbiAgICBcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB7fTtcbiAgICBpZihldmVudC50eXBlID09IFwidG91Y2hzdGFydFwiKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgY29vcmRpbmF0ZXMueSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gaGFuZGxpbmcgbW91c2VcbiAgICAgICAgY29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICBjb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XG4gICAgfVxuICAgIC8vIGdldCB0aGUgZmlyaW5nIGFuZ2xlXG4gICAgbGV0IGFuZ2xlID0gZ2V0QW5nbGVGcm9tRGV2aWNlKGNvb3JkaW5hdGVzKTtcbiAgICBcbiAgICAvLyBkZWZhdWx0IGRpc3RhbmNlIGFuZCBkdXJhdGlvblxuICAgIGxldCBhbmltYXRpb25EdXJhdGlvbiA9IDc1MDsgLy8gMC43NSBzZWNcbiAgICBsZXQgZGlzdGFuY2UgPSAxMDAwO1xuICAgIFxuICAgIGxldCBjb2xsaXNpb25IYXBwZW5lZCA9IENvbGxpc2lvbi5maW5kSW50ZXJzZWN0aW9uKGFuZ2xlLCBVSS5jdXJyZW50QnViYmxlKTtcbiAgICBcbiAgICBsZXQgYW5pbWF0aW9uQ2FsbGJhY2s7XG4gICAgbGV0IG5ld0J1YmJsZSA9IEJ1YmJsZS5kZWVwQ29weShVSS5jdXJyZW50QnViYmxlKTtcbiAgICBVSS5ib2FyZC5hcHBlbmRDaGlsZChuZXdCdWJibGUuZG9tKTtcbiAgICBVSS5jdXJyZW50QnViYmxlLmNoYW5nZVR5cGUoKTtcbiAgICBcbiAgICAvLyBpZiBjb2xsaXNpb24gb2NjdXJzIGNoYW5nZSBkaXN0YW5jZSBhbmQgZHVyYXRpb24uXG4gICAgaWYgKGNvbGxpc2lvbkhhcHBlbmVkKSB7XG4gICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uID0gYW5pbWF0aW9uRHVyYXRpb24gKiBjb2xsaXNpb25IYXBwZW5lZC5kaXN0YW5jZVRvQ29sbGlzaW9uIC8gZGlzdGFuY2U7XG4gICAgICAgIGRpc3RhbmNlID0gY29sbGlzaW9uSGFwcGVuZWQuZGlzdGFuY2VUb0NvbGxpc2lvbjtcbiAgICAgICAgXG4gICAgICAgIGFuaW1hdGlvbkNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICBVSS5jdXJyZW50QnViYmxlLmRvbS5yZW1vdmVBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICAgICAgICAgIEJvYXJkLmFkZEJ1YmJsZShuZXdCdWJibGUsIGNvbGxpc2lvbkhhcHBlbmVkLmNvb3Jkcyk7XG4gICAgICAgICAgICBVSS5kcmF3Qm9hcmQoKTtcbiAgICAgICAgfVxuICAgIH0gLy8gZW5kIGlmXG4gICAgXG4gICAgZWxzZSB7XG4vLyAgICAgICAgVUkuc2V0TmV3QnViYmxlUG9zaXRpb24oKTtcbiAgICAgICAgYW5pbWF0aW9uQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBuZXdCdWJibGUuZG9tLnJlbW92ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9IC8vIGVuZCBlbHNlXG4gICAgXG4gICAgLy8gZmlyZSB1cCB0aGUgYW5pbWF0aW9uXG4gICAgVUkuc3RhcnRCYWxsQW5pbWF0aW9uKG5ld0J1YmJsZSwgYW5nbGUsIGFuaW1hdGlvbkR1cmF0aW9uLCBkaXN0YW5jZSwgYW5pbWF0aW9uQ2FsbGJhY2spO1xuICAgIFxuICAgIFxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbn1cblxuZnVuY3Rpb24gZ2V0QW5nbGVGcm9tRGV2aWNlIChkZXZpY2VYWSkge1xuLy8gICAgYWxlcnQoXCJpbiB0aGUgZ2V0IEFuZ2xlXCIpO1xuICAgIGxldCBCdWJibGVYWSA9IHtcbiAgICAgICAgeDogVUkuY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIFVJLmN1cnJlbnRCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC8yLFxuICAgICAgICB5OiBVSS5jdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBVSS5jdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLzJcbiAgICB9O1xuICAgIFxuICAgIGxldCBmaXJlQW5nbGUgPSBNYXRoLmF0YW4oKGRldmljZVhZLnggLSBCdWJibGVYWS54KSAvIChCdWJibGVYWS55IC0gZGV2aWNlWFkueSkpO1xuICAgIFxuLy8gICAgbGV0IGZpcmVBbmdsZSA9IE1hdGguYXRhbjIoKGRldmljZVhZLnggLSBCdWJibGVYWS54KSAsIChCdWJibGVYWS55IC0gZGV2aWNlWFkueSkpO1xuXG4gICAgXG4gICAgIC8vaWYgdGhlIHBsYXllciBmaXJlZCB0aGUgYmFsbCBhdCBhcHJveGltYXRseSBob3Jpem9udGFsIGxldmVsXG4vLyAgICBpZihkZXZpY2VYWS55ID4gQnViYmxlWFkueSkge1xuLy8gICAgICAgIGZpcmVBbmdsZSA9IGZpcmVBbmdsZSArIE1hdGguUEk7XG4vLyAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZpcmVBbmdsZTtcbn1cblxuIiwiaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuL2J1YmJsZS5qc1wiO1xuaW1wb3J0ICogYXMgQm9hcmQgZnJvbSBcIi4vTW9kZWwvQm9hcmQuanNcIjtcblxuZXhwb3J0IGxldCBuZXdHYW1lRGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydF9nYW1lX2RpYWxvZ1wiKTtcbmV4cG9ydCBsZXQgY3VycmVudEJ1YmJsZTtcbmV4cG9ydCBsZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lXCIpO1xuZXhwb3J0IGxldCBuZXdHYW1lQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXdfZ2FtZV9idXR0b25cIik7XG5leHBvcnQgbGV0IHRvcGJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9wYmFyXCIpO1xuZXhwb3J0IGxldCBmb290ZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvb3RlclwiKTtcblxuZXhwb3J0IGxldCBib2FyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm9hcmRcIik7XG5cblxuZXhwb3J0IGxldCBib2FyZFdpZHRoO1xuZXhwb3J0IGxldCBib2FyZEhlaWdodDtcblxuZXhwb3J0IGxldCBzcHJpdGVSYWRpdXMgPSAwO1xuZXhwb3J0IGxldCBidWJibGVSYWRpdXMgPSAwO1xuZXhwb3J0IGxldCB0d29TaWRlc0VtcHR5U3BhY2UgPSAwO1xuXG4vLyBudW1iZXIgb2YgY29sIGluIHRoZSBib2FyZFxubGV0IG51bU9mQ29sO1xuLy8gbnVtYmVyIG9mIHJvd3MgaW4gdGhlIGJvYXJkXG5sZXQgbnVtT2ZSb3c7XG5cbmxldCBib2FyZEluaXRpYXRlZDtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIG51bU9mQ29sID0gQm9hcmQuTlVNX0NPTCAvIDI7ICBcbiAgICBudW1PZlJvdyA9IEJvYXJkLk5VTV9ST1c7XG4gICAgYm9hcmRJbml0aWF0ZWQgPSBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVEaWFsb2cgKCkge1xuICAgIG5ld0dhbWVEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xuICAgIG5ld0dhbWVEaWFsb2cuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0QmFsbEFuaW1hdGlvbiAoZmlyZWRCdWJibGUsIGFuZ2xlLCBkdXJhdGlvbiwgZGlzdGFuY2UsIGFuaW1hdGlvbkNhbGxiYWNrKSB7XG4vLyAgICBsZXQgYW5nbGUgPSBnZXRBbmdsZUZyb21EZXZpY2UoZGV2aWNlWFkpO1xuLy8gICAgbGV0IGRpc3RhbmNlID0gMTAwMDtcbiAgICAvLyBsZXQgdXMgYXNzdW1lIHRoYXQgd2Ugd2lsbCBmaXJlIHRoZSBiYWxsIGZvciAxMDAwcHggZm9yIG5vd1xuICAgIGxldCBkaXN0YW5jZVggPSBNYXRoLnNpbihhbmdsZSkgKiBkaXN0YW5jZTtcbiAgICBsZXQgZGlzdGFuY2VZID0gTWF0aC5jb3MoYW5nbGUpICogZGlzdGFuY2U7XG4gICAgXG4gICAgbGV0IG51bWJlck9mSXRlcmF0aW9ucyA9IE1hdGguY2VpbChkdXJhdGlvbiAvIDE2KTsgXG4gICAgbGV0IHhFdmVyeUZyYW1lID0gZGlzdGFuY2VYIC8gbnVtYmVyT2ZJdGVyYXRpb25zO1xuICAgIGxldCB5RXZlcnlGcmFtZSA9IGRpc3RhbmNlWSAvIG51bWJlck9mSXRlcmF0aW9ucztcbiAgICAgICAgXG4gICAgbGV0IGFuaW1hdGlvbkxvb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpcmVkQnViYmxlLmRvbS5zdHlsZS5sZWZ0ID0gKHBhcnNlRmxvYXQoZmlyZWRCdWJibGUuZG9tLnN0eWxlLmxlZnQpICsgeEV2ZXJ5RnJhbWUpICsgXCJweFwiO1xuICAgICAgICBmaXJlZEJ1YmJsZS5kb20uc3R5bGUudG9wID0gKHBhcnNlRmxvYXQoZmlyZWRCdWJibGUuZG9tLnN0eWxlLnRvcCkgLSB5RXZlcnlGcmFtZSkgKyBcInB4XCI7XG4gICAgICAgIFxuICAgICAgICBudW1iZXJPZkl0ZXJhdGlvbnMgLS07XG4gICAgICAgIGlmIChudW1iZXJPZkl0ZXJhdGlvbnMgPT09IDApIHtcbiAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKGxvb3BJRCk7XG4gICAgICAgICAgICBhbmltYXRpb25DYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbG9vcElEID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbkxvb3ApO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGxldCBsb29wSUQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0aW9uTG9vcCk7XG4gICAgXG4vLyAgICBVSS5maXJlZEJ1YmJsZS5kb20uc3R5bGUudHJhbnNmb3JtID0gXCJ0cmFuc2xhdGUoXCIgKyBkaXN0YW5jZVggKyBcInB4LFwiICsgZGlzdGFuY2VZICsgXCJweClcIjtcbn0gICBcbiAgICBcbmV4cG9ydCBmdW5jdGlvbiBwcmVwYXJlTmV4dEJ1YmJsZSgpIHtcbiAgICBpZihjdXJyZW50QnViYmxlKSB7XG4gICAgICAgIFxuICAgIH1cbiAgICBjdXJyZW50QnViYmxlID0gQnViYmxlLmNyZWF0ZSgtMSwgLTEpO1xuICAgIFxuICAgIC8vIG1ha2UgdGhlIG5ldyBidWJibGUgdGhlIGN1cnJlbnQgYnViYmxlLCB0aGVuIGFkZCBpdCB0byB0aGUgZG9tXG4gICAgY3VycmVudEJ1YmJsZS5kb20uY2xhc3NMaXN0LmFkZChcImN1cnJfYnViYmxlXCIpO1xuICAgIFxuLy8gICAgYm9hcmQuYXBwZW5kQ2hpbGQoY3VycmVudEJ1YmJsZS5kb20pOyAgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZSAoKSB7XG4gICAgXG4gICAgbGV0IGdhbWVXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCBnYW1lSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgbGV0IHNjYWxlVG9GaXRYID0gZ2FtZVdpZHRoIC8gNzIwOyAvLyB0aGUgZ2FtZSB3aWxsIGJlIHBsYXlhYmxlIGluIHBvcnRyYWl0IG1vZGUsIHNvIDcyMCBmb3IgaG9yaXpvbnRhbCBhbmQgMTI4MCBmb3IgdmVydGljYWxcbiAgICBsZXQgc2NhbGVUb0ZpdFkgPSBnYW1lSGVpZ2h0IC8gMTI4MDtcbiAgICBsZXQgb3B0aW1hbFJhdGlvID0gTWF0aC5taW4oc2NhbGVUb0ZpdFgsIHNjYWxlVG9GaXRZKTtcbi8vICAgIHZhciBvcHRpbWFsUmF0aW8gPSBNYXRoLm1heChzY2FsZVRvRml0WCwgc2NhbGVUb0ZpdFkpO1xuXG4gICAgYm9hcmRXaWR0aCA9ICg3MjAgKiBvcHRpbWFsUmF0aW8pO1xuICAgIGJvYXJkSGVpZ2h0ID0gKCgxMjgwICogb3B0aW1hbFJhdGlvKSAtICh0b3BiYXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0ICsgZm9vdGVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCkpO1xuICAgIGJ1YmJsZVJhZGl1cyA9IChib2FyZFdpZHRoIC8gKG51bU9mQ29sICsxKSkgLyAyO1xuICAgIHNwcml0ZVJhZGl1cyA9IGJ1YmJsZVJhZGl1cyAvIDAuODg7XG4gICAgXG4gICAgYm9hcmQuc3R5bGUud2lkdGggPSBib2FyZFdpZHRoICsgXCJweFwiO1xuICAgIGJvYXJkLnN0eWxlLmhlaWdodCA9IGJvYXJkSGVpZ2h0ICsgXCJweFwiO1xuICAgIFxuICAgIFxuICAgIFxuLy8gICAgY3VycmVudEJ1YmJsZS5sZWZ0ID0gKChib2FyZFdpZHRoIC8gMikgLSAoYnViYmxlUmFkaXVzKSkgKyBcInB4XCI7XG4vLyAgICBjdXJyZW50QnViYmxlLnRvcCA9IChib2FyZEhlaWdodCAtIChidWJibGVSYWRpdXMgKiAzKSkgKyBcInB4XCI7XG4gICAgXG4gICAgZHJhd0JvYXJkKCk7XG4vLyAgICBsZXQgYnViYmxlV2lkdGggPSAobmV3Qm9hcmRXaWR0aCAvIG51bU9mQ29sICszKTtcbi8vICAgIC8vIHVwZGF0ZSBnbG9iYWwgYnViYmxlUmFkaXVzIHZhcmlhYmxlXG4vLyAgICBcbi8vLy8gICAgY3NzUmVuZGVyKGJ1YmJsZVdpZHRoKTtcbi8vICAgIC8vIHJlc2l6ZSB0aGUgY3VycmVudEJ1YmJsZVxuLy8gICAgaWYoY3VycmVudEJ1YmJsZSkge1xuLy8vLyAgICAgICAgY3VycmVudEJ1YmJsZS5kb20uc3R5bGUubGVmdCA9ICggKG5ld0JvYXJkV2lkdGggLyAyKSAtIChidWJibGVXaWR0aCAvMikgKSArIFwicHhcIjtcbi8vICAgIH1cblxuICAgIFxuXG59XG4gICAgXG5leHBvcnQgZnVuY3Rpb24gc2V0TmV3QnViYmxlUG9zaXRpb24oKSB7XG4gICAgbGV0IHdpZHRoID0gKHNwcml0ZVJhZGl1cyAqIDIpICsgXCJweFwiO1xuICAgIGxldCBsZWZ0ID0gKChib2FyZFdpZHRoIC8gMikgLSAoc3ByaXRlUmFkaXVzKSkgKyBcInB4XCI7XG4gICAgbGV0IHRvcCA9IChib2FyZEhlaWdodCAtIChzcHJpdGVSYWRpdXMgKiAzKSkgKyBcInB4XCI7XG4gICAgY3VycmVudEJ1YmJsZS5kb20uc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJjdXJyZW50XCIpO1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSBsZWZ0O1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLnRvcCA9IHRvcDtcbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmhlaWdodCA9IHdpZHRoO1xuLy8gICAgY3VycmVudEJ1YmJsZS5kb20uY2xhc3NMaXN0LmFkZChcImN1cnJfYnViYmxlXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZHJhd0JvYXJkKCkge1xuICAgIGxldCBib2FyZEFycmF5ID0gQm9hcmQuZ2V0Qm9hcmRBcnJheSgpO1xuLy8gICAgbGV0IGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgIGxldCB3aWR0aCA9IHNwcml0ZVJhZGl1cyAqIDI7XG4gICAgbGV0IGh0bWxTdHJpbmcgPSBcIlwiO1xuICAgIFxuICAgIGlmKGN1cnJlbnRCdWJibGUpIHtcbiAgICAgICAgbGV0IGxlZnQgPSAoKGJvYXJkV2lkdGggLyAyKSAtIChzcHJpdGVSYWRpdXMpKSArIFwicHhcIjtcbiAgICAgICAgbGV0IHRvcCA9IChib2FyZEhlaWdodCAtIChzcHJpdGVSYWRpdXMgKiAzKSkgKyBcInB4XCI7XG4gICAgICAgIGh0bWxTdHJpbmcgKz0gXCI8ZGl2IGlkPSdjdXJyZW50JyBjbGFzcz0nYnViYmxlIGJ1YmJsZVwiICsgY3VycmVudEJ1YmJsZS50eXBlICsgXCInIHN0eWxlPScgd2lkdGg6IFwiICsgd2lkdGggKyBcInB4OyBoZWlnaHQ6IFwiICtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGggKyBcInB4O1wiICsgXCJsZWZ0OiBcIiArICgoYm9hcmRXaWR0aCAvIDIpIC0gKHNwcml0ZVJhZGl1cykpICsgXCJweDtcIiArIFwiIHRvcDogXCIgK1xuICAgICAgICAgICAgICAgICAgICAoYm9hcmRIZWlnaHQgLSAoc3ByaXRlUmFkaXVzICogMykpICsgXCJweDsnID4gPC9kaXY+XCI7XG4gICAgICAgIFxuLy8gICAgICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLmxlZnQgPSAoIChuZXdCb2FyZFdpZHRoIC8gMikgLSAoYnViYmxlV2lkdGggLzIpICkgKyBcInB4XCI7XG4gICAgfVxuICAgIFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgQm9hcmQuTlVNX1JPVzsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtT2ZDb2wgKiAyOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBidWJibGUgPSBib2FyZEFycmF5W2ldW2pdO1xuICAgICAgICAgICAgLy8gdGhlcmUgZXhpc3QgYSBidWJibGUgb24gdGhhdCBpbmRleCAoZXZlbiByb3dzIGhhdmUgYnViYmxlIG9uIHRoZSBvZGQgY29sdW1uIGluZGljaWVzKVxuICAgICAgICAgICAgaWYoYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0IGxlZnQgPSAoaiAqIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgbGV0IHRvcCA9IChpICogYnViYmxlUmFkaXVzICogMiAtIChzcHJpdGVSYWRpdXMgKiAwLjE1ICogaSkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY29vcmRzIGluIHRoZSBidWJibGUgb2JqZWN0ICh0aGVzZSBjb29yZHMgYXJlIGNvb3JkcyBvZiB0aGUgY2VudGVyIG9mIHRoZSBidWJibGUpXG4gICAgICAgICAgICAgICAgYnViYmxlLnNldENvb3JkcyhsZWZ0ICsgIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgKyBidWJibGVSYWRpdXMsIHRvcCArIGJvYXJkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGJ1YmJsZVJhZGl1cyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaHRtbFN0cmluZyArPSBcIjxkaXYgY2xhc3M9J2J1YmJsZSBidWJibGVcIiArIGJ1YmJsZS50eXBlICsgXCInIHN0eWxlPSdsZWZ0OiBcIiArIGxlZnQgKyBcInB4OyB0b3A6IFwiICsgdG9wICtcbiAgICAgICAgICAgICAgICAgICAgXCJweDsgd2lkdGg6IFwiICsgd2lkdGggKyBcInB4O2hlaWdodDogXCIgKyB3aWR0aCArIFwicHg7JyA+PC9kaXY+XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBib2FyZC5pbm5lckhUTUwgPSBodG1sU3RyaW5nO1xuICAgIGN1cnJlbnRCdWJibGUuc2V0RE9NKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY3VycmVudFwiKSk7XG4vLyAgICBib2FyZC5hcHBlbmRDaGlsZChmcmFnbWVudCk7XG4vLyAgICBjc3NSZW5kZXIoYnViYmxlUmFkaXVzICogMik7XG4vLyAgICBib2FyZEluaXRpYXRlZCA9IHRydWU7XG59XG5cbiJdfQ==
