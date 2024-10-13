import { Ball, launchArrow } from "./gameObjects";
import { newBall } from ".";

const canvas = document.getElementById('gameCanvas');
let startX, startY, endX, endY;
let powerScale = 0.1;

function getMouseDownCoords (e) {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
}

function getMouseUpCoords (e) {
    const rect = canvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;

    //Calculate velocity when the mouse is released
    let launchVelocity = calculateLaunchVelocity(startX, startY, endX, endY);
    
    //Remove event listeners once the mouse button is released
    canvas.removeEventListener('mousedown', getMouseDownCoords);
    canvas.removeEventListener('mouseup', getMouseUpCoords);
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    //Check if mouse cursor is over the ball.
    if (newBall.isMouseOver(mouseX, mouseY)) {
        canvas.addEventListener('mousedown', getMouseDownCoords);
        canvas.addEventListener('mouseup', getMouseUpCoords);
            
    } else {
        //Remove event listeners if mouse moves off ball
        canvas.removeEventListener('mousedown', getMouseDownCoords);
        canvas.removeEventListener('mouseup', getMouseUpCoords);
    }    
});

export function getLaunchArrowCoords() {
    const arrowX = 2 * startX - endX;
    const arrowY = 2 * startY - endY;
    return {arrowX, arrowY};
}

export function calculateLaunchVelocity(startX, startY, endX, endY) {
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    launchVelocityX = - distanceX * powerScale;
    launchVelocityY = - distanceY * powerScale;
    return {launchVelocityX, launchVelocityY};
};