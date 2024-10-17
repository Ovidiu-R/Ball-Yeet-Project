import { Ball, launchArrow , Wall} from "./gameObjects";
import { basicHandler } from "./collisionHandler";
import { launchVelocity, getLaunchArrowCoords, endX, endY, startX } from "./interactivityHandler";
import { newBall, newArrow, newWall } from ".";
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
    basicHandler();
    newBall.update();
    
    newBall.draw();
    newArrow.draw();

    Wall.allInstances.forEach(obj => obj.draw());

    //Check game state(collision with goal should result in points or a level change, in which case the gameLoop should be ended instantly to save on resources and new level should be loaded
    //Draw ball
    //Draw walls
    //RequestAnimationFrame
    requestAnimationFrame(gameLoop);
}

function clearCanvas() {
        ctx.fillStyle = "rgb(0 255 255 / 20%";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
