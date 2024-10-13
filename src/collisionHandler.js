import { newBall } from ".";
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export function basicHandler() {
    let collisionDetected = false;
if (newBall.position.y + newBall.velocity.y > canvas.height - newBall.radius ||
    newBall.position.y + newBall.velocity.y < newBall.radius) {
        collisionDetected = true;
        newBall.collisionData.vertical = true;
    }
 if (newBall.position.x + newBall.velocity.x > canvas.width - newBall.radius || 
     newBall.position.x + newBall.velocity.x < newBall.radius) {
        collisionDetected = true;
        newBall.collisionData.horizontal = true;
 }
 return collisionDetected;
}