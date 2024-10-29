import './style.css';
import { Ball, Wall, launchArrow, Goal, GoalPost, WinMessage } from './gameObjects.js';
import { gameLoop } from './gameLoop.js';

export let newBall;
export let newArrow;
export let newWall, newWall2, goal, goalPost, winMessage;
// export let staticCanvas = document.getElementById('staticCanvas');
// export let sCtx = staticCanvas.getContext('2d');
// export let dynamicCanvas = document.getElementById('dynamicCanvas');
// export let dCtx = dynamicCanvas.getContext('2d');

document.addEventListener('DOMContentLoaded', () => {
    // staticCanvas.tabIndex = 0;
    // dynamicCanvas.tabIndex = 1;
    // dynamicCanvas.focus();

    //Create and export single instance of Ball class that will be used throughout the codebase
    
    newBall = new Ball (180, 550, 0, 0, 18, 'red');
    newArrow = new launchArrow (180, 550, 0, 0, 'black');
    newWall = new Wall (700, 700, 450, 50);
    newWall2 = new Wall (900, 350, 350, 50);
    goalPost = new GoalPost (1300, 540, 30);
    goal = new Goal (1300, 540, 30, 60, 10);
    winMessage = new WinMessage (false);
    gameLoop();
});