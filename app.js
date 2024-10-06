document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let ball = {
        x: 100,
        y: 450,
        radius: 30,
        color: 'blue'
    };

    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI *2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath;
    }

    drawBall();
})