import { Ball, launchArrow } from "./gameObjects";
import { basicHandler } from "./collisionHandler";
import { launchVelocity, getLaunchArrowCoords, endX, endY, startX } from "./interactivityHandler";
import { newBall, newArrow } from ".";
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
// let lastTime = performance.now();


export function gameLoop() {
    const currentTime = performance.now();
    // let dt = (currentTime - lastTime) / 1000;
    // lastTime = currentTime;

    clearCanvas();
    if (endX !== undefined) {
        let arrowTip = getLaunchArrowCoords();
        newArrow.update(arrowTip.x, arrowTip.y, true);
    }
    
    if (launchVelocity !== undefined) {
        newBall.launch(launchVelocity.x, launchVelocity.y);
        launchVelocity = undefined;
    }
    newBall.update();
    if (basicHandler()) {
        newBall.update();
    }
    newBall.draw();
    newArrow.draw();
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
