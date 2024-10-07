document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let raf;

    let ball = {
        x: 100,
        y: 450,
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

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ball.draw();
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.y + ball.vy > canvas.height - ball.radius || ball.y + ball.vy < ball.radius) {
            ball.vy = -ball.vy;
        } 
        if (ball.x + ball.vx > canvas.width - ball.radius || ball.x + ball.vx < ball.radius) {
            ball.vx = -ball.vx;
        }

        raf = window.requestAnimationFrame(draw);
    }

    canvas.addEventListener('mouseover', (e) => {
        raf = window.requestAnimationFrame(draw);
    });

    canvas.addEventListener('mouseout', (e) => {
        window.cancelAnimationFrame(raf);
    });

    ball.draw();
})