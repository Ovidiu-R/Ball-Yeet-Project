import './style.css';
import { Ball, Wall, launchArrow, Goal, GoalPost, WinMessage, CanvasBackground } from './gameObjects.js';
import { gameLoop } from './gameLoop.js';

export let newBall;
export let newArrow;
export let newWall, newWall2, ground, goal, goalPost, winMessage, canvasBackground;
// export let staticCanvas = document.getElementById('staticCanvas');
// export let sCtx = staticCanvas.getContext('2d');
// export let dynamicCanvas = document.getElementById('dynamicCanvas');
// export let dCtx = dynamicCanvas.getContext('2d');

document.addEventListener('DOMContentLoaded', () => {
    // staticCanvas.tabIndex = 0;
    // dynamicCanvas.tabIndex = 1;
    // dynamicCanvas.focus();

    //Create and export single instance of Ball class that will be used throughout the codebase
    
    newBall = new Ball (180, 530, 0, 0, 18, 'red');
    newArrow = new launchArrow (180, 530, 0, 0, 'yellow');
    newWall = new Wall (700, 550, 320, 50);
    newWall2 = new Wall (900, 250, 250, 50);
    ground = new Wall (0, 700, 150, 1600);
    goalPost = new GoalPost (1300, 390, 30);
    goal = new Goal (1300, 390, 30, 60, 10);
    winMessage = new WinMessage (false, 'white');
    canvasBackground = new CanvasBackground();
    gameLoop();
});