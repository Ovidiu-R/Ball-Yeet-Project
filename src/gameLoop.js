import { Ball, launchArrow , Wall} from "./gameObjects";
import { basicHandler } from "./collisionHandler";
import { launchVelocity, getLaunchArrowCoords, endX, endY, startX } from "./interactivityHandler";
import { newBall, newArrow, goal, goalPost } from ".";
import  { fpsCounter } from "./fpsCounter.js";
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


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
    
    newArrow.draw();

    Wall.allInstances.forEach(obj => obj.draw());

    requestAnimationFrame(gameLoop);
}

function clearCanvas() {
        ctx.fillStyle = "rgb(0 255 255 / 20%";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
