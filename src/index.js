import './style.css';
import { Ball, launchArrow } from './gameObjects.js';
import { gameLoop } from './gameLoop.js';
import { fpsCounter } from './fpsCounter.js';

export let newBall;
export let newArrow;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    canvas.tabIndex = 0;
    canvas.focus();
    const ctx = canvas.getContext('2d');
    let raf;
    let mouseX;
    let mouseY;

    //Create and export single instance of Ball class that will be used throughout the codebase
    newBall = new Ball(100, 400, 0, 0, 18, 'red');
    newBall.draw(ctx);
    newArrow = new launchArrow (100, 400, 0, 0, 'black')
    gameLoop();
    


    // O L D   C O D E


    // let ball = {
    //     x: 100,
    //     y: 250,
    //     vx: 5,
    //     vy: 2,
    //     radius: 18,
    //     color: 'blue',

    //     draw() {
    //         ctx.beginPath();
    //         ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI *2, true);
    //         ctx.closePath();
    //         ctx.fillStyle = ball.color;
    //         ctx.fill();
    //     },
    // };

    // function clearCanvas() {
    //     ctx.fillStyle = "rgb(0 255 255 / 20%";
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }

    // function draw() {
    //     clearCanvas();
    //     ball.draw();
    //     ball.x += ball.vx;
    //     ball.y += ball.vy;
    //     console.log(ball.x, ball.y);
    //     ball.vy *= 0.99;
    //     ball.vy += 0.40;

    //     if (ball.y + ball.vy > canvas.height - ball.radius || ball.y + ball.vy < ball.radius) {
    //         ball.vy = -ball.vy;
    //     } 
    //     if (ball.x + ball.vx > canvas.width - ball.radius || ball.x + ball.vx < ball.radius) {
    //         ball.vx = -ball.vx;
    //     }

    //     raf = window.requestAnimationFrame(draw);
    // }

    // function startAnimation() {
    //     fpsCounter();
    //     if (!raf) {
    //         raf = window.requestAnimationFrame(draw);
    //     }
    // };

    // function stopAnimation() {
    //     if(raf) {
    //         window.cancelAnimationFrame(raf);
    //         raf = null;
    //     }

    // }

    // function controlToggle() {
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     clearCanvas();
    //     ball.x = mouseX - rect.left;
    //     ball.y = mouseY - rect.top;
    //     ball.draw();
    // }



    // // E V E N T   L I S T E N E R S

    // canvas.addEventListener('mouseover', startAnimation);

    // // canvas.addEventListener('mouseout', stopAnimation);
    
    // canvas.addEventListener('mousemove', function(e) {
    //     mouseX = e.clientX;
    //     mouseY = e.clientY;
    //     console.log(mouseX, mouseY);
    // })

    // canvas.addEventListener('keydown', (function() {
    //     fpsCounter();
    //     let isToggled = false;
    //     return function(event) {
    //         if(event.key ==='e') {
    //             isToggled = !isToggled;
    //             if(isToggled) {
    //                 stopAnimation();
    //                 controlToggle();
    //                 canvas.removeEventListener('mouseover', startAnimation);
    //                 canvas.addEventListener('mousemove', controlToggle); 
                    
    //             } else {
    //                 canvas.removeEventListener('mousemove', controlToggle);
    //                 startAnimation();
    //                 // canvas.addEventListener('mouseover', startAnimation);
    //             }
    //         }
    //     }
    // })());

    // ball.draw();
});