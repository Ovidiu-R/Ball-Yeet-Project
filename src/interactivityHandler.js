// import { Ball } from "./gameObjects";
import { newBall, newArrow } from ".";

let dynamicCanvas = document.getElementById('dynamicCanvas');
let startY;
let powerScale = 0.20;
export let launchVelocity = undefined; //Will have to reset this once it has been altered
export let endX, endY, startX = undefined;
let mouseDownFlag = false;

function handleMouseDown(e) {
    mouseDownFlag = true;
    getMouseDownCoords(e);

    dynamicCanvas.addEventListener('mousemove', trackMouseMove);
    dynamicCanvas.addEventListener('mouseup', handleMouseUp);
}

function getMouseDownCoords (e) {
    const rect = dynamicCanvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    console.log('start', startX, startY);

}

function handleMouseUp(e) {
    getMouseUpCoords(e);

    dynamicCanvas.removeEventListener('mousemove', trackMouseMove);
    dynamicCanvas.removeEventListener('mouseup', handleMouseUp);
    startX, startY = undefined;
    mouseDownFlag = false;
}

function getMouseUpCoords (e) {
    const rect = dynamicCanvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
    console.log('end', endX, endY);

    //Calculate velocity when the mouse is released
    launchVelocity = calculateLaunchVelocity(startX, startY, endX, endY);
    newBall.isGrounded = false;
    console.log('launchvel', launchVelocity);
}

function trackMouseMove(e) {
    if (!mouseDownFlag) return;

    const rect = dynamicCanvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
}

dynamicCanvas.addEventListener('mousemove', (e) => {
    // console.log('mouse is moving over canvas');
    const rect = dynamicCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    //Check if mouse cursor is over the ball.
    if (newBall.isMouseOver(mouseX, mouseY)) {
        dynamicCanvas.addEventListener('mousedown', handleMouseDown);    
    } else {
        //Remove event listeners if mouse moves off ball
        dynamicCanvas.removeEventListener('mousedown', handleMouseDown);
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