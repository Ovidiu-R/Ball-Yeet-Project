import './style.css';
import { fpsCounter } from './fpsCounter.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const rect = canvas.getBoundingClientRect();
    canvas.tabIndex = 0;
    canvas.focus();
    const ctx = canvas.getContext('2d');
    let raf;
    let mouseX;
    let mouseY;


    class Ball {
        constructor(x, y, angle, power, radius = 30, color = 'blue') {
            this.position = {x: x, y: y};
            this.velocity = this.calculateVelocity(angle, power);
            this.radius = radius;
            this.color = color;
        }

        //Method to calculate initial velocity based on angle and power
        calculateVelocity(angle, power) {
            const radians = angle * (Math.PI / 180);
            return {
                x: power * Math.cos(radians),
                y: power * Math.sin(radians)
            };
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI *2, true);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            //Gravity effect
            this.velocity.y += 0.55;

            //Bouncing logic
            if (this.position.y + this.velocity.y > canvas.height - this.radius ||
               this.position.y + this.velocity.y < this.radius) {
                    this.velocity.y = -this.velocity.y;
               }
            if (this.position.x + this.velocity.x > canvas.width - this.radius || 
                this.position.x + this.velocity.x < this.radius) {
                    this.velocity.x = -this.velocity.x;
            }
            
        }
    }

    function gameLoop() {
        clearCanvas();
        //Draw ball
        //Draw walls
        //Update ball
        //Update walls if level changes
    }

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


    // O L D   C O D E


    let ball = {
        x: 100,
        y: 250,
        vx: 5,
        vy: 2,
        radius: 18,
        color: 'blue',

        draw() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI *2, true);
            ctx.closePath();
            ctx.fillStyle = ball.color;
            ctx.fill();
        },
    };

    function clearCanvas() {
        ctx.fillStyle = "rgb(0 255 255 / 20%";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        clearCanvas();
        ball.draw();
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy *= 0.99;
        ball.vy += 0.40;

        if (ball.y + ball.vy > canvas.height - ball.radius || ball.y + ball.vy < ball.radius) {
            ball.vy = -ball.vy;
        } 
        if (ball.x + ball.vx > canvas.width - ball.radius || ball.x + ball.vx < ball.radius) {
            ball.vx = -ball.vx;
        }

        raf = window.requestAnimationFrame(draw);
    }

    function startAnimation() {
        fpsCounter();
        if (!raf) {
            raf = window.requestAnimationFrame(draw);
        }
    };

    function stopAnimation() {
        if(raf) {
            window.cancelAnimationFrame(raf);
            raf = null;
        }

    }

    function controlToggle() {
        console.log('flag4');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        clearCanvas();
        ball.x = mouseX - rect.left;
        ball.y = mouseY - rect.top;
        console.log(ball.x);
        ball.draw();
    }



    // E V E N T   L I S T E N E R S

    canvas.addEventListener('mouseover', startAnimation);

    // canvas.addEventListener('mouseout', stopAnimation);
    
    canvas.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        console.log(mouseX, mouseY);
    })

    canvas.addEventListener('keydown', (function() {
        fpsCounter();
        let isToggled = false;
        return function(event) {
            if(event.key ==='e') {
                isToggled = !isToggled;
                if(isToggled) {
                    stopAnimation();
                    controlToggle();
                    canvas.removeEventListener('mouseover', startAnimation);
                    canvas.addEventListener('mousemove', controlToggle); 
                    
                } else {
                    canvas.removeEventListener('mousemove', controlToggle);
                    startAnimation();
                    // canvas.addEventListener('mouseover', startAnimation);
                }
            }
        }
    })());

    ball.draw();
});