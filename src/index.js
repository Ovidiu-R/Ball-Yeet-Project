import './style.css';
import { Ball, Wall, launchArrow, Goal, GoalPost, WinMessage } from './gameObjects.js';
import { gameLoop } from './gameLoop.js';

export let newBall;
export let newArrow;
export let newWall, newWall2, goal, goalPost, winMessage;
export let staticCanvas = document.getElementById('staticCanvas');
export let sCtx = staticCanvas.getContext('2d');
export let dynamicCanvas = document.getElementById('dynamicCanvas');
export let dCtx = dynamicCanvas.getContext('2d');

document.addEventListener('DOMContentLoaded', () => {
    // staticCanvas = document.getElementById('staticCanvas');
    // sCtx = staticCanvas.getContext('2d');
    // dynamicCanvas = document.getElementById('dynamicCanvas');
    // dCtx = dynamicCanvas.getContext('2d');

    // staticCanvas.tabIndex = 0;
    // dynamicCanvas.tabIndex = 1;
    // dynamicCanvas.focus();

    //Create and export single instance of Ball class that will be used throughout the codebase
    goalPost = new GoalPost (1200, 400, 30);
    newBall = new Ball (180, 450, 0, 0, 18, 'red');
    newArrow = new launchArrow (180, 450, 0, 0, 'black');
    newWall = new Wall (700, 600, 450, 50);
    newWall2 = new Wall (900, 600, 350, 50);
    goal = new Goal (1200, 400, 30, 60, 10);
    winMessage = new WinMessage (false);
    gameLoop();
});