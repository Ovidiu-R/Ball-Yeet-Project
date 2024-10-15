import { Ball } from "./gameObjects";
import { newBall, newArrow } from ".";

const canvas = document.getElementById('gameCanvas');
let startY;
let powerScale = 0.20;
export let launchVelocity = undefined; //Will have to reset this once it has been altered
export let endX, endY, startX = undefined;
let mouseDownFlag = false;

function handleMouseDown(e) {
    mouseDownFlag = true;
    getMouseDownCoords(e);

    canvas.addEventListener('mousemove', trackMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
}

function getMouseDownCoords (e) {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    console.log('start', startX, startY);

}

function handleMouseUp(e) {
    getMouseUpCoords(e);

    canvas.removeEventListener('mousemove', trackMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    startX, startY = undefined;
    mouseDownFlag = false;
}

function getMouseUpCoords (e) {
    const rect = canvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
    console.log('end', endX, endY);

    //Calculate velocity when the mouse is released
    launchVelocity = calculateLaunchVelocity(startX, startY, endX, endY);
    console.log(launchVelocity);
}

function trackMouseMove(e) {
    if (!mouseDownFlag) return;

    const rect = canvas.getBoundingClientRect();
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;
}

canvas.addEventListener('mousemove', (e) => {
    // console.log('mouse is moving over canvas');
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    //Check if mouse cursor is over the ball.
    if (newBall.isMouseOver(mouseX, mouseY)) {
        canvas.addEventListener('mousedown', handleMouseDown);    
    } else {
        //Remove event listeners if mouse moves off ball
        canvas.removeEventListener('mousedown', handleMouseDown);
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