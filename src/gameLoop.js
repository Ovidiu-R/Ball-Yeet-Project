import { Ball, launchArrow , Wall} from "./gameObjects";
import { basicHandler } from "./collisionHandler";
import { launchVelocity, getLaunchArrowCoords, endX, endY, startX } from "./interactivityHandler";
import { newBall, newArrow, goal, goalPost, winMessage } from ".";
import  { fpsCounter } from "./fpsCounter.js";
const fpsCap = 60;

let staticCanvas = document.getElementById('staticCanvas');
let sCtx = staticCanvas.getContext('2d');
let dynamicCanvas = document.getElementById('dynamicCanvas');
let dCtx = dynamicCanvas.getContext('2d');

setInterval(function(){
    if (startX !== undefined) {
        let arrowTip = getLaunchArrowCoords();
        newArrow.update(arrowTip.x, arrowTip.y, true);
    }
    
    if (launchVelocity !== undefined) {
        newBall.launch(launchVelocity.x, launchVelocity.y);
        launchVelocity = undefined;
    }
    basicHandler();
    newBall.update();
    
},1000/fpsCap); //  note ms = 1000/fps

export function gameLoop() {
    clearCanvas();
    fpsCounter();
                                        // if (startX !== undefined) {
                                        //     let arrowTip = getLaunchArrowCoords();
                                        //     newArrow.update(arrowTip.x, arrowTip.y, true);
                                        // }
                                        
                                        // if (launchVelocity !== undefined) {
                                        //     newBall.launch(launchVelocity.x, launchVelocity.y);
                                        //     launchVelocity = undefined;
                                        // }
    if (goalPost.drawn == false) {
        goalPost.draw();
        goalPost.drawn = true;
    }


                                        // basicHandler();
                                        // newBall.update();
    if (newBall.position.y <= goal.position.y) {
        goal.draw();
        newBall.draw();
    } else {
        newBall.draw();
        goal.draw();
    }
    if (newBall.hasScored) {
        winMessage.draw();
    }
    newArrow.draw();
    if(Wall.allInstances[0].drawn == false) {
        Wall.allInstances.forEach(obj => obj.draw());
        Wall.allInstances[0].drawn = true;
        console.log('draw background');
    }
   
    requestAnimationFrame(gameLoop);
    //Limit framerate by wrapping RAF in a setTimeout block. Simple method that would introduce desync as project complexity increases
    //Decoupling logic from RAF loop and running it in a separate TimeInterval thread and only updating graphics in RAF would be preferable in complex scenarios
    // setTimeout(() => {
    //     requestAnimationFrame(gameLoop);
    // }, 1000 / fpsCap)
}

// function drawStaticElements() {
    
// }

function clearCanvas() {
    //With destination-out, any non-transparent shape will erase existing content where it’s drawn.
    dCtx.globalCompositeOperation = 'destination-out';
    dCtx.fillStyle = "rgba(0, 0, 0, 0.3)"; // Light fade, can be darkened or adjusted
    dCtx.fillRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);
    //Switch back to default source-over to draw the current ball position normally on top
    dCtx.globalCompositeOperation = 'source-over'; // Restore default

}
