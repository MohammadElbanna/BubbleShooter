function Bubble (domElement) {
    this.dom = domElement;
}

export let create = function () {
    let bubbleDOM = document.createElement("div");
    bubbleDOM.classList.add("bubble");
    bubbleDOM.classList.add("bubble3");
    let newBubble = new Bubble(bubbleDOM);
    
    return newBubble;
    
}