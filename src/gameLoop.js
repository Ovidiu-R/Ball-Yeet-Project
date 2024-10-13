import { Ball } from "./gameObjects";
import { basicHandler } from "./collisionHandler";
import { newBall } from ".";
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


export function gameLoop() {
    clearCanvas();
    newBall.update();
    if (basicHandler()) {
        
    }
    
    
    //Check for collisions a second time to make sure first collision resolution didn't cause another
    newBall.draw();
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
