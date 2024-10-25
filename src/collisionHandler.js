import { newBall } from ".";
import { Wall } from "./gameObjects";
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export function basicHandler() {
    checkCanvasEdges();
    checkWalls();
}

function checkCanvasEdges() {
    if (newBall.position.y + newBall.velocity.y > canvas.height - newBall.radius ||
        newBall.position.y + newBall.velocity.y < newBall.radius) {
        newBall.collisionData.vertical = true;
    }
    if (newBall.position.x + newBall.velocity.x > canvas.width - newBall.radius || 
        newBall.position.x + newBall.velocity.x < newBall.radius) {
        newBall.collisionData.horizontal = true;
    }
}

function checkWalls() {
    Wall.allInstances.forEach (obj => {

        Object.keys(obj).forEach((key) => {
            const corner = obj[key];
            const distance = Math.sqrt((corner.x - newBall.position.x) ** 2 + (corner.y - newBall.position.y) ** 2);
            if (distance <= newBall.radius) {
                console.log('CORNER!');
                const normalVector = {x: corner.x - newBall.position.x, y: corner.y - newBall.position.y};
                const magnitude = Math.sqrt(normalVector.x ** 2 + normalVector.y ** 2);
                const normalized = { x: normalVector.x / magnitude, y: normalVector.y / magnitude};
                const dotProduct = newBall.velocity.x * normalized.x + newBall.velocity.y * normalized.y;
                // Vnew = v - 2(v*n)n
                const subtrahend = {x: normalized.x * dotProduct *2, y: normalized.y * dotProduct * 2};
                const newVelocity = { x: newBall.velocity.x - subtrahend.x, y: newBall.velocity.y - subtrahend.y };
                newBall.velocity = newVelocity;
            }
        });

        if (newBall.position.x + newBall.velocity.x >= obj.bottomLeft.x - newBall.radius && 
            newBall.position.x + newBall.velocity.x <= obj.bottomRight.x + newBall.radius &&
            newBall.position.y + newBall.velocity.y >= obj.topLeft.y) {
                newBall.collisionData.horizontal = true;

            }
        if (newBall.position.y + newBall.velocity.y >= obj.topLeft.y - newBall.radius &&
            newBall.position.y + newBall.velocity.y <= obj.bottomLeft.y - newBall.radius &&
            newBall.position.x + newBall.velocity.x >= obj.bottomLeft.x &&
            newBall.position.x + newBall.velocity.x <= obj.bottomRight.x) {
                newBall.collisionData.vertical = true;
        }
    });
}