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

export function gameLoop() {
    clearCanvas();
    fpsCounter();
    if (startX !== undefined) {
        let arrowTip = getLaunchArrowCoords();
        newArrow.update(arrowTip.x, arrowTip.y, true);
    }
    
    if (launchVelocity !== undefined) {
        newBall.launch(launchVelocity.x, launchVelocity.y);
        launchVelocity = undefined;
    }
    goalPost.draw();

    basicHandler();
    newBall.update();
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
   

    //Limit framerate by wrapping RAF in a setTimeout block. Simple method that would introduce desync as project complexity increases
    //Decoupling logic from RAF loop and running it in a separate TimeInterval thread and only updating graphics in RAF would be preferable in complex scenarios
    setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, 1000 / fpsCap)
}

function drawStaticElements() {
    
}

function clearCanvas() {
    dCtx.clearRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);
    // dCtx.fillStyle = "rgb(0 255 255 / 20%";
    // dCtx.fillRect(0, 0, dynamicCanvas.width, dynamicCanvas.height);
}
