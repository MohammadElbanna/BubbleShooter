(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _gameJs = require("./game.js");

var game = _interopRequireWildcard(_gameJs);

game.init();

},{"./game.js":2}],2:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _uiJs = require("./ui.js");

var UI = _interopRequireWildcard(_uiJs);

function init() {
    window.addEventListener("click", startGame);
}

function startGame() {
    window.removeEventListener("click", startGame);
    UI.hideDialog();
}

},{"./ui.js":3}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.init = init;
exports.hideDialog = hideDialog;
var newGameDialog = document.getElementById("start_game_dialog");

function init() {}

function hideDialog() {
    newGameDialog.style.opacity = "0";
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvYXBwLmpzIiwiL2hvbWUvbXVoYW1tYWQvUGxheWdyb3VuZC9CdWJibGVTaG9vdGVyL2pzL2dhbWUuanMiLCIvaG9tZS9tdWhhbW1hZC9QbGF5Z3JvdW5kL0J1YmJsZVNob290ZXIvanMvdWkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O3NCQ0FzQixXQUFXOztJQUFyQixJQUFJOztBQUVoQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7Ozs7Ozs7Ozs7b0JDRlEsU0FBUzs7SUFBakIsRUFBRTs7QUFFUCxTQUFTLElBQUksR0FBRztBQUNuQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0NBQy9DOztBQUVELFNBQVMsU0FBUyxHQUFJO0FBQ2xCLFVBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDL0MsTUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFDO0NBQ25COzs7Ozs7OztBQ1RELElBQUksYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7QUFFMUQsU0FBUyxJQUFJLEdBQUksRUFFdkI7O0FBRU0sU0FBUyxVQUFVLEdBQUk7QUFDMUIsaUJBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztDQUNyQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBnYW1lIGZyb20gXCIuL2dhbWUuanNcIjtcblxuZ2FtZS5pbml0KCk7IiwiaW1wb3J0ICogYXMgVUkgZnJvbSBcIi4vdWkuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWUpO1xufVxuICAgIFxuZnVuY3Rpb24gc3RhcnRHYW1lICgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHN0YXJ0R2FtZSk7XG4gICAgVUkuaGlkZURpYWxvZygpO1xufSIsImxldCBuZXdHYW1lRGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGFydF9nYW1lX2RpYWxvZ1wiKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIFxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZURpYWxvZyAoKSB7XG4gICAgbmV3R2FtZURpYWxvZy5zdHlsZS5vcGFjaXR5ID0gXCIwXCI7XG59XG4iXX0=
