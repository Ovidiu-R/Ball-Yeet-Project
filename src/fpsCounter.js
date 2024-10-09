const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

export function gameLoop(time) {
    //Calculate delta time between frames
    const deltaTime = time - lastTime;
    lastTime = time;

    frameCount++;

    if (frameCount >= 60) {
        fps = (1000 / deltaTime).toFixed(1); // Get smooth fps value
        frameCount = 0;
    }

    //Clear top left corner of canvas in order to update framerate value
    ctx.clearRect(0, 0, 100, 50);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`FPS: ${fps}`, 10, 30);
    requestAnimationFrame(gameLoop);
}