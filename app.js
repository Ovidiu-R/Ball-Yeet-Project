document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    canvas.tabIndex = 0;
    canvas.focus();
    const ctx = canvas.getContext('2d');
    let raf;

    let ball = {
        x: 100,
        y: 250,
        vx: 5,
        vy: 2,
        radius: 30,
        color: 'blue',

        draw() {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI *2, true);
            ctx.closePath();
            ctx.fillStyle = ball.color;
            ctx.fill();
        },
    };

    function clear() {
        ctx.fillStyle = "rgb(0 255 255 / 30%";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        clear();
        ball.draw();
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vy *= 0.99;
        ball.vy += 0.50;

        if (ball.y + ball.vy > canvas.height - ball.radius || ball.y + ball.vy < ball.radius) {
            ball.vy = -ball.vy;
        } 
        if (ball.x + ball.vx > canvas.width - ball.radius || ball.x + ball.vx < ball.radius) {
            ball.vx = -ball.vx;
        }

        raf = window.requestAnimationFrame(draw);
    }

    function startAnimation() {
        raf = window.requestAnimationFrame(draw);
    };
    canvas.addEventListener('mouseover', startAnimation);

    canvas.addEventListener('mouseout', (e) => {
        window.cancelAnimationFrame(raf);
    });

    function controlToggle(e) {
        clear();
        ball.x = e.clientX;
        ball.y = e.clientY;
        ball.draw();
    }

    canvas.addEventListener('keydown', (function() {
        console.log('flag 1');
        let isToggled = false;
        return function(event) {
            console.log('flag 2');
            if(event.key ==='e') {
                console.log('flag 3');
                isToggled = !isToggled;
                if(isToggled) {
                    canvas.removeEventListener('mouseover', startAnimation);
                    
                    canvas.addEventListener('mouseover', controlToggle(event)); 
                    
                } else {
                    canvas.removeEventListener('mouseover', controlToggle);
                    canvas.addEventListener('mouseover', startAnimation);
                }
            }
        }
    })());

    ball.draw();
})