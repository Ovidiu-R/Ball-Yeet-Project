import { Ball, launchArrow } from "./gameObjects";

const canvas = document.getElementById('gameCanvas');
let startX, startY, endX, endY;
let powerScale = 0.1;;
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    //Check if mouse cursor is over the ball
    if ()


    canvas.addEventListener('mousedown', (e) => {
        startX = e.clientX - canvas.getBoundingClientRect().left;
        startY = e.clientY - canvas.getBoundingClientRect().top;
    });
    canvas.addEventListener('mouseup', (e) => {
        endX = e.clientX - canvas.getBoundingClientRect().left;
        endY = e.clientY - canvas.getBoundingClientRect().top;
        calculateLaunchVelocity(startX, startY, endX, endY);
    });
    
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