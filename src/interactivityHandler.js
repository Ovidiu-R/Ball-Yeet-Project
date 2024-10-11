let startX, startY, endX, endY;
let powerScale = 0.1;;
canvas.addEventListener('mouseover', (e) => {
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
    const arrowX = startX - endX;
    const arrowY = startY - endY;
    return {arrowX, arrowY};
}

export function calculateLaunchVelocity(startX, startY, endX, endY) {
    const distanceX = endX - startX;  // FISHY
    const distanceY = endY - startY;  //LOGIC
    launchVelocityX = distanceX * powerScale;
    launchVelocityY = distanceY * powerScale;
    return {launchVelocityX, launchVelocityY};
};