(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _gameJs = require("./game.js");

var game = _interopRequireWildcard(_gameJs);

game.init();

},{"./game.js":3}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;
function Bubble(domElement) {
    this.dom = domElement;
}

var create = function create() {
    var bubbleDOM = document.createElement("div");
    bubbleDOM.classList.add("bubble");
    bubbleDOM.classList.add("bubble3");
    var newBubble = new Bubble(bubbleDOM);

    return newBubble;
};
exports.create = create;

},{}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _uiJs = require("./ui.js");

var UI = _interopRequireWildcard(_uiJs);

var _bubbleJs = require("./bubble.js");

var Bubble = _interopRequireWildcard(_bubbleJs);

var currentBubble = undefined;
var gameBoard = document.getElementById("game");
var board = document.getElementById("board");
var newGameButton = document.getElementById("new_game_button");

function init() {
    newGameButton.addEventListener("click", startGame);
}

function startGame() {
    newGameButton.removeEventListener("click", startGame);
    UI.hideDialog();

    // set the first current bubble
    currentBubble = getNextBubble();
    // add event listner for mouse clicks on the board
    gameBoard.addEventListener("touchstart", ballFiredHandler);
    gameBoard.addEventListener("click", ballFiredHandler);
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

    var angle = UI.getAngleFromDevice(coordinates, currentBubble);

    // let us assume that we will fire the ball for 1000px for now
    var distanceX = Math.sin(angle) * 800;
    var distanceY = Math.cos(angle) * 800;

    if (distanceY > 0) distanceY = distanceY * -1;

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

},{"./bubble.js":2,"./ui.js":4}],4:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;
exports.hideDialog = hideDialog;
exports.getAngleFromDevice = getAngleFromDevice;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _bubbleJs = require("./bubble.js");

var Bubble = _interopRequireWildcard(_bubbleJs);

var newGameDialog = document.getElementById("start_game_dialog");

function init() {}

function hideDialog() {
    newGameDialog.style.opacity = "0";
}

function getAngleFromDevice(deviceXY, currentBubble) {
    //    alert("in the get Angle");
    var BubbleXY = {
        x: currentBubble.dom.getBoundingClientRect().left + currentBubble.dom.getBoundingClientRect().width / 2,
        y: currentBubble.dom.getBoundingClientRect().top + currentBubble.dom.getBoundingClientRect().height / 2
    };

    var fireAngle = Math.atan((deviceXY.x - BubbleXY.x) / (BubbleXY.y - deviceXY.y));

    // if the player fired the ball at aproximatly horizontal level
    if (deviceXY.y > BubbleXY.y) {
        fireAngle = fireAngle + Math.PI;
    }

    return fireAngle;
}

},{"./bubble.js":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvYXBwLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2J1YmJsZS5qcyIsIi9ob21lL211aGFtbWFkL1BsYXlncm91bmQvQnViYmxlU2hvb3Rlci9qcy9nYW1lLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL3VpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztzQkNBc0IsV0FBVzs7SUFBckIsSUFBSTs7QUFFaEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOzs7Ozs7QUNGWixTQUFTLE1BQU0sQ0FBRSxVQUFVLEVBQUU7QUFDekIsUUFBSSxDQUFDLEdBQUcsR0FBRyxVQUFVLENBQUM7Q0FDekI7O0FBRU0sSUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQWU7QUFDNUIsUUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxhQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxhQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQyxRQUFJLFNBQVMsR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFdEMsV0FBTyxTQUFTLENBQUM7Q0FFcEIsQ0FBQTs7Ozs7Ozs7Ozs7b0JDWm1CLFNBQVM7O0lBQWpCLEVBQUU7O3dCQUNVLGFBQWE7O0lBQXpCLE1BQU07O0FBRWxCLElBQUksYUFBYSxZQUFBLENBQUM7QUFDbEIsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoRCxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFD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QUUsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEtBQUssR0FBRSxDQUFDO0FBQ3RHLFNBQUMsRUFBRSxhQUFhLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxNQUFNLEdBQUUsQ0FBQztLQUN6RyxDQUFDOztBQUVGLFFBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUEsSUFBSyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7OztBQUdqRixRQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRTtBQUN4QixpQkFBUyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO0tBQ25DOztBQUVELFdBQU8sU0FBUyxDQUFDO0NBQ3BCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIGdhbWUgZnJvbSBcIi4vZ2FtZS5qc1wiO1xuXG5nYW1lLmluaXQoKTsiLCJmdW5jdGlvbiBCdWJibGUgKGRvbUVsZW1lbnQpIHtcbiAgICB0aGlzLmRvbSA9IGRvbUVsZW1lbnQ7XG59XG5cbmV4cG9ydCBsZXQgY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBidWJibGVET00gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJ1YmJsZURPTS5jbGFzc0xpc3QuYWRkKFwiYnViYmxlXCIpO1xuICAgIGJ1YmJsZURPTS5jbGFzc0xpc3QuYWRkKFwiYnViYmxlM1wiKTtcbiAgICBsZXQgbmV3QnViYmxlID0gbmV3IEJ1YmJsZShidWJibGVET00pO1xuICAgIFxuICAgIHJldHVybiBuZXdCdWJibGU7XG4gICAgXG59IiwiaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vdWkuanNcIjtcbmltcG9ydCAqIGFzIEJ1YmJsZSBmcm9tIFwiLi9idWJibGUuanNcIjtcblxubGV0IGN1cnJlbnRCdWJibGU7XG5sZXQgZ2FtZUJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1lXCIpO1xubGV0IGJvYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcbmxldCBuZXdHYW1lQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXdfZ2FtZV9idXR0b25cIik7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICAgIG5ld0dhbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG59XG4gICAgXG5mdW5jdGlvbiBzdGFydEdhbWUgKCkge1xuICAgIG5ld0dhbWVCdXR0b24ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG4gICAgVUkuaGlkZURpYWxvZygpO1xuICAgIFxuICAgIC8vIHNldCB0aGUgZmlyc3QgY3VycmVudCBidWJibGVcbiAgICBjdXJyZW50QnViYmxlID0gZ2V0TmV4dEJ1YmJsZSgpO1xuICAgIC8vIGFkZCBldmVudCBsaXN0bmVyIGZvciBtb3VzZSBjbGlja3Mgb24gdGhlIGJvYXJkXG4gICAgZ2FtZUJvYXJkLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGJhbGxGaXJlZEhhbmRsZXIpO1xuICAgIGdhbWVCb2FyZC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYmFsbEZpcmVkSGFuZGxlcik7XG59XG5cbmZ1bmN0aW9uIGJhbGxGaXJlZEhhbmRsZXIoZXZlbnQpIHtcbiAgICBsZXQgY29vcmRpbmF0ZXMgPSB7fTtcbiAgICBpZihldmVudC50eXBlID09IFwidG91Y2hzdGFydFwiKSB7XG4gICAgICAgIGNvb3JkaW5hdGVzLnggPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgY29vcmRpbmF0ZXMueSA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gaGFuZGxpbmcgbW91c2VcbiAgICAgICAgY29vcmRpbmF0ZXMueCA9IGV2ZW50LnBhZ2VYO1xuICAgICAgICBjb29yZGluYXRlcy55ID0gZXZlbnQucGFnZVk7XG4gICAgfVxuICAgIFxuICAgIGxldCBhbmdsZSA9IFVJLmdldEFuZ2xlRnJvbURldmljZShjb29yZGluYXRlcywgY3VycmVudEJ1YmJsZSk7XG5cbiAgICAvLyBsZXQgdXMgYXNzdW1lIHRoYXQgd2Ugd2lsbCBmaXJlIHRoZSBiYWxsIGZvciAxMDAwcHggZm9yIG5vd1xuICAgIGxldCBkaXN0YW5jZVggPSAoTWF0aC5zaW4oYW5nbGUpICogODAwKSA7XG4gICAgbGV0IGRpc3RhbmNlWSA9ICAoTWF0aC5jb3MoYW5nbGUpICogODAwKTsgICAgXG4gICAgXG4gICAgaWYoZGlzdGFuY2VZID4gMClcbiAgICAgICAgZGlzdGFuY2VZID0gZGlzdGFuY2VZICogLTE7XG5cbiAgICBjdXJyZW50QnViYmxlLmRvbS5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZShcIiArIGRpc3RhbmNlWCArIFwicHgsXCIgKyBkaXN0YW5jZVkgKyBcInB4KVwiO1xuICAgIGN1cnJlbnRCdWJibGUuZG9tLnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9IFwidHJhbnNsYXRlKFwiICsgZGlzdGFuY2VYICsgXCJweCxcIiArIGRpc3RhbmNlWSArIFwicHgpXCI7XG4vLyAgICBjdXJyZW50QnViYmxlLmRvbS5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBcIi13ZWJraXQtdHJhbnNmb3JtOiBcIiArIFwidHJhbnNsYXRlKFwiICsgZGlzdGFuY2VYICsgXCJweCxcIiArIGRpc3RhbmNlWSArIFwicHgpXCIpO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbn1cblxuZnVuY3Rpb24gZ2V0TmV4dEJ1YmJsZSgpIHtcbiAgICB2YXIgbmV4dEJ1YmJsZSA9IEJ1YmJsZS5jcmVhdGUoKTtcbiAgICBcbiAgICAvLyBtYWtlIHRoZSBuZXcgYnViYmxlIHRoZSBjdXJyZW50IGJ1YmJsZSwgdGhlbiBhZGQgaXQgdG8gdGhlIGRvbVxuICAgIG5leHRCdWJibGUuZG9tLmNsYXNzTGlzdC5hZGQoXCJjdXJyX2J1YmJsZVwiKTtcbiAgICBib2FyZC5hcHBlbmRDaGlsZChuZXh0QnViYmxlLmRvbSk7XG4gICAgXG4gICAgcmV0dXJuIG5leHRCdWJibGU7XG59IiwiaW1wb3J0ICogYXMgQnViYmxlIGZyb20gXCIuL2J1YmJsZS5qc1wiO1xuXG5sZXQgbmV3R2FtZURpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRfZ2FtZV9kaWFsb2dcIik7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhpZGVEaWFsb2cgKCkge1xuICAgIG5ld0dhbWVEaWFsb2cuc3R5bGUub3BhY2l0eSA9IFwiMFwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QW5nbGVGcm9tRGV2aWNlIChkZXZpY2VYWSwgY3VycmVudEJ1YmJsZSkge1xuLy8gICAgYWxlcnQoXCJpbiB0aGUgZ2V0IEFuZ2xlXCIpO1xuICAgIGxldCBCdWJibGVYWSA9IHtcbiAgICAgICAgeDogY3VycmVudEJ1YmJsZS5kb20uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIGN1cnJlbnRCdWJibGUuZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoIC8yLFxuICAgICAgICB5OiBjdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyBjdXJyZW50QnViYmxlLmRvbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQgLzJcbiAgICB9O1xuICAgIFxuICAgIGxldCBmaXJlQW5nbGUgPSBNYXRoLmF0YW4oKGRldmljZVhZLnggLSBCdWJibGVYWS54KSAvIChCdWJibGVYWS55IC0gZGV2aWNlWFkueSkpO1xuICAgIFxuICAgIC8vIGlmIHRoZSBwbGF5ZXIgZmlyZWQgdGhlIGJhbGwgYXQgYXByb3hpbWF0bHkgaG9yaXpvbnRhbCBsZXZlbFxuICAgIGlmKGRldmljZVhZLnkgPiBCdWJibGVYWS55KSB7XG4gICAgICAgIGZpcmVBbmdsZSA9IGZpcmVBbmdsZSArIE1hdGguUEk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBmaXJlQW5nbGU7XG59XG4iXX0=
