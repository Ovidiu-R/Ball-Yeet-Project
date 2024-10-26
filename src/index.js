import './style.css';
import { Ball, Wall, launchArrow, Goal } from './gameObjects.js';
import { gameLoop } from './gameLoop.js';
import { fpsCounter } from './fpsCounter.js';

export let newBall;
export let newArrow;
export let newWall, newWall2, goal;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    canvas.tabIndex = 0;
    canvas.focus();
    const ctx = canvas.getContext('2d');
    // let raf;
    // let mouseX;
    // let mouseY;

    //Create and export single instance of Ball class that will be used throughout the codebase
    // newBall = new Ball(180, 450, 0, 0, 18, 'red');
    newBall = new Ball(180, 450, 0, 0, 18, 'red');

    newBall.draw();
    newArrow = new launchArrow (180, 450, 0, 0, 'black');
    newWall = new Wall (700, 600, 450, 50);
    newWall2 = new Wall (900, 600, 350, 50);
    goal = new Goal (1200, 400, 10);
    gameLoop();
});