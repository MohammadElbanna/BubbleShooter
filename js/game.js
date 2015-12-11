import * as UI from "./ui.js";

export function init() {
    window.addEventListener("click", startGame);
}
    
function startGame () {
    window.removeEventListener("click", startGame);
    UI.hideDialog();
}