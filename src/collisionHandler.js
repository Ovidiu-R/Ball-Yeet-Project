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
        if (newBall.position.x + newBall.velocity.x >= obj.bottomLeft.x - newBall.radius && 
            newBall.position.x + newBall.velocity.x <= obj.bottomRight.x - newBall.radius &&
            newBall.position.y + newBall.velocity.y <= obj.topLeft.y) {
                newBall.collisionData.horizontal = true;

            }
        if (newBall.position.y + newBall.velocity.y > obj.topLeft.y - newBall.radius &&
            newBall.position.y + newBall.velocity.y > obj.bottomLeft.y - newBall.radius &&
            newBall.position.x + newBall.velocity.x < newBall.radius) {
            newBall.collisionData.vertical = true;
        }
    });
}