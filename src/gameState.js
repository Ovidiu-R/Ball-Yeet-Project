const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export function scorePoint() {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';        // Align text to the right of the given x-coordinate
    ctx.textBaseline = 'middle';    // Align text to the bottom of the given y-coordinate

    // Place text in the bottom-right corner
    ctx.fillText('BOOM SHAKALAKA!', canvas.width / 2, 100);

}