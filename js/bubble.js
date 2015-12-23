import * as UI from "./ui.js";

function Bubble (domElement, row, col, type) {
    domElement.classList.add("bubble");
    domElement.classList.add("bubble" + type);
    this.dom = domElement;
    this.col = col;
    this.row = row;
    this.type = type;
}

Bubble.prototype.setType = function (type) {
    this.type = type;
}

Bubble.prototype.setDOM = function (newDom) {
    this.dom = newDom;
}

Bubble.prototype.setCoords = function (left, top) {
    this.left = left;
    this.top = top;
}

Bubble.prototype.setCol = function(col) {
    this.col = col;
}

Bubble.prototype.setRow = function (row) {
    this.row = row;
}

Bubble.prototype.getCoords = function () {
    return {
        left: this.left,
        top: this.top
    };
}

Bubble.prototype.changeType = function (type) {
    this.dom.classList.remove("bubble" + this.type);
    if (type === undefined) {
        type = Math.floor(Math.random() * 4);
    }
    this.setType(type);
    this.dom.classList.add("bubble" + type);
}

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
}

export let create = function (row, col, type) {
    let bubbleDOM = document.createElement("div");
    
    if (type === undefined) {
        type = Math.floor(Math.random() * 4);
    }
    let newBubble = new Bubble(bubbleDOM, row, col, type);
    
    return newBubble;
    
}

export let deepCopy = function (copiedBubble) {
    let newBubbleDom = document.createElement("div");
    newBubbleDom.style.left = copiedBubble.dom.style.left;
    newBubbleDom.style.top = copiedBubble.dom.style.top;
    newBubbleDom.style.width = copiedBubble.dom.style.width;
    newBubbleDom.style.height = copiedBubble.dom.style.height;
    
    return new Bubble (newBubbleDom, -1, -1, copiedBubble.type);
}