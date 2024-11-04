import { Ball, launchArrow , Wall} from "./gameObjects";
import { basicHandler } from "./collisionHandler";
import { launchVelocity, getLaunchArrowCoords, endX, endY, startX } from "./interactivityHandler";
import { newBall, newArrow, goal, goalPost, winMessage, canvasBackground } from ".";
import  { fpsCounter } from "./fpsCounter.js";
const fpsCap = 60;

let staticCanvas = document.getElementById('staticCanvas');
let sCtx = staticCanvas.getContext('2d');
let dynamicCanvas = document.getElementById('dynamicCanvas');
let dCtx = dynamicCanvas.getContext('2d');

//Do all of the heavy lifting inside the setInterval, which runs fpsCap times per second
setInterval(function(){
    if (startX !== undefined) {
        let arrowTip = getLaunchArrowCoords();
        newArrow.update(newBall.position.x, newBall.position.y, arrowTip.x, arrowTip.y, true);
    }
    
    if (launchVelocity !== undefined) {
        newBall.launch(launchVelocity.x, launchVelocity.y);
        launchVelocity = undefined;
    }
    basicHandler();
    newBall.update();
    
},1000/fpsCap); //  note ms = 1000/fps

//Draw everything every frame
export function gameLoop() {
    clearCanvas();
    fpsCounter();
    canvasBackground.draw();    

    if (goalPost.drawn == false) {
        goalPost.draw();
        goalPost.drawn = true;
    }
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
}


function clearCanvas() {
    //With destination-out, any non-transparent shape will erase existing content where it’s drawn.
    dCtx.globalCompositeOperation = 'destination-out';
    dCtx.fillStyle = "rgba(0, 0, 0, 0.2)"; // Light fade, can be darkened or adjusted
    dCtx.fillRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);
    //Switch back to default source-over to draw the current ball position normally on top
    dCtx.globalCompositeOperation = 'source-over'; // Restore default

}
