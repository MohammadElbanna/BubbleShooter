import * as Board from "./Model/Board.js";
import * as UI from "./ui.js";

let boardArray = Board.getBoardArray();

export function findIntersection(angle, currBubble) {
    let startCenterPos = {
        left: currBubble.dom.getBoundingClientRect().left + UI.spriteRadius,
        top: currBubble.dom.getBoundingClientRect().top + UI.spriteRadius
    }
    
    // an object that holds some data on a collision if exists
    let collision = null;
    
    let dx = Math.sin(angle);
    let dy = -Math.cos(angle);
    
    for(let i = 0; i < Board.NUM_ROW; i++) {
        
        for(let j = 0; j < Board.NUM_COL ; j++) {
            let bubble = boardArray[i][j];
            if(bubble) {
                // get the coords of the current bubble
                let bubbleCoords = bubble.getCoords();
                let distToBubble = {
                    x: startCenterPos.left - bubbleCoords.left,
                    y: startCenterPos.top - bubbleCoords.top
                }
                
                let t = dx * distToBubble.x + dy * distToBubble.y;
                // 
                let ex = -t * dx + startCenterPos.left;
                let ey = -t * dy + startCenterPos.top;
                
                let distEC = Math.sqrt(Math.pow((ex - bubbleCoords.left), 2) - Math.pow((ey - bubbleCoords.top), 2));
                
                // if the prependicular distance between the trajectory and the center of the checked out bubble is greater than 2R, then NO collision
                if (distEC < UI.bubbleRadius) {
                    let dt = Math.sqrt(Math.pow(UI.bubbleRadius, 2) - Math.pow(distEC, 2));
                    let offset1 = {
                        x: (t - dt) * dx,
                        y: -(t - dt) * dy
                    };

                    let offset2 = {
                        x: (t + dt) * dx,
                        y: -(t + dt) * dy
                    };
                    
                    let distToFirstPoint = Math.sqrt(Math.pow(offset1.x, 2) + Math.pow(offset1.y, 2));
                    
                    let distToSecondPoint = Math.sqrt(Math.pow(offset2.x ,2) + Math.pow(offset2.y, 2));
                    
                    // holds the new distance from the starting point of firing a ball to the collison point t 
                    let newDistance;
                    // holds the collision point coordinates
                    let collisionCoords;
                    if (distToFirstPoint < distToSecondPoint) {
                        newDistance = distToFirstPoint;
                        collisionCoords = {
                            x: startCenterPos.left + offset1.x,
//                            y: startCenterPos.top + offset1.y
                            y: bubble.row + 1

                        }
                    }
                    else {
                        newDistance = distToSecondPoint;
                        collisionCoords = {
                            x: startCenterPos.left - offset2.x,
//                            y: startCenterPos.top + offset2.y
                            y: bubble.row + 1
                        }
                    }
                    
                    // if a collision was detected and was distance was smaller than the smallest collision distane till now
                    if(!collision || newDistance < collision.distanceToCollision) {
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