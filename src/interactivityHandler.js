let startX, startY, endX, endY;
canvas.addEventListener('mouseover', (e) => {
    canvas.addEventListener('mousedown', (e) => {
        startX = e.clientX - canvas.getBoundingClientRect().left;
        startY = e.clientY - canvas.getBoundingClientRect().top;
    });
    canvas.addEventListener('mouseup', (e) => {
        endX = e.clientX - canvas.getBoundingClientRect().left;
        endY = e.clientY - canvas.getBoundingClientRect().top;
        calculateLaunchAngle(startX, startY, endX, endY);
        calculateLaunchPower(startX, startY, endX, endY);
    });
    
});

function calculateLaunchAngle(startX, startY, endX, endY) {

};

function calculateLaunchPower(startX, startY, endX, endY) {
};