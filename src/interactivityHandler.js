import { Ball } from "./gameObjects";
import { newBall } from ".";

const canvas = document.getElementById('gameCanvas');
let startY;
let powerScale = 0.12;
export let launchVelocity = undefined; //Will have to reset this once it has been altered
export let endX, endY, startX;
let mouseDownFlag = false;

function getMouseDownCoords (e) {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    console.log('start', startX, startY);
    mouseDownFlag = true;
}

function getMouseUpCoords (e) {
    const rect = canvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
    console.log('end', endX, endY);

    //Calculate velocity when the mouse is released
    launchVelocity = calculateLaunchVelocity(startX, startY, endX, endY);
    console.log(launchVelocity);
    //Remove event listeners once the mouse button is released
    canvas.removeEventListener('mousedown', getMouseDownCoords);
    canvas.removeEventListener('mouseup', getMouseUpCoords);
    mouseDownFlag = false;
    // endX, endY = undefined;
}


canvas.addEventListener('mousemove', (e) => {
    // console.log('mouse is moving over canvas');
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    //Check if mouse cursor is over the ball.
    if (newBall.isMouseOver(mouseX, mouseY)) {
        canvas.addEventListener('mousedown', getMouseDownCoords);
        if (mouseDownFlag) {
            canvas.addEventListener('mouseup', getMouseUpCoords);
        }
            
    } else {
        //Remove event listeners if mouse moves off ball
        canvas.removeEventListener('mousedown', getMouseDownCoords);
        // canvas.removeEventListener('mouseup', getMouseUpCoords);
    }    
});

export function getLaunchArrowCoords() {
    const arrowX = 2 * startX - endX;
    const arrowY = 2 * startY - endY;
    return { x: arrowX, y: arrowY};
}

export function calculateLaunchVelocity(startX, startY, endX, endY) {
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const launchVelocityX = - distanceX * powerScale;
    const launchVelocityY = - distanceY * powerScale;
    return {x: launchVelocityX, y: launchVelocityY};
};