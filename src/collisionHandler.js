import { newBall, goal } from ".";
import { Wall } from "./gameObjects";
import { scorePoint } from "./gameState";
const canvas = document.getElementById('staticCanvas'); //Too lazy to import
const offsetDistance = 3;

export function basicHandler() {
    checkCanvasEdges();
    checkWalls();
    checkGoal();
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
        //Handle corner collisions
        Object.keys(obj).forEach((key) => {
            const corner = obj[key];
            const distance = Math.sqrt((corner.x - newBall.position.x) ** 2 + (corner.y - newBall.position.y) ** 2);
            if (distance <= newBall.radius) {
                console.log('CORNER!');
                getBounceVelocity(corner);
            }
        });
        //Handle 'flat' surface collisions
        if (newBall.position.x + newBall.velocity.x >= obj.bottomLeft.x - newBall.radius && 
            newBall.position.x + newBall.velocity.x <= obj.bottomRight.x + newBall.radius &&
            newBall.position.y + newBall.velocity.y >= obj.topLeft.y &&
            newBall.position.y + newBall.velocity.y <= obj.bottomLeft.y - newBall.radius) {
                newBall.collisionData.horizontal = true;

            }
        if (newBall.position.y + newBall.velocity.y >= obj.topLeft.y - newBall.radius &&
            newBall.position.y + newBall.velocity.y <= obj.bottomLeft.y + newBall.radius &&
            newBall.position.x + newBall.velocity.x >= obj.bottomLeft.x &&
            newBall.position.x + newBall.velocity.x <= obj.bottomRight.x) {
                newBall.collisionData.vertical = true;
        }
    });
}

function checkGoal() {
    //First check collision with sides of hoop and manage accordingly
    Object.keys(goal.edges).forEach((key) => {
        const rim = goal.edges[key];
        const distance = Math.sqrt((rim.x - newBall.position.x) ** 2 + (rim.y - newBall.position.y) ** 2);
        if (distance <= newBall.radius + (goal.girth / 2)) {
            console.log('EDGE!');
            //Calculate vector between ball center and edge centre
            const vector = {x: newBall.position.x - rim.x, y: newBall.position.y - rim.y};
            //Normalise to get unit vector
            const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            const normal = { x: vector.x / magnitude, y: vector.y / magnitude};
            //Find contact point by extending normal vector to radius of edge circle
            const contactPoint = {
                x: rim.x + normal.x * (goal.girth / 2),
                y: rim.y + normal.y * (goal.girth /2)
            };
            getBounceVelocity(contactPoint);
        }
    });

    //Check if ball enters hoop from above and if so award point
    if (newBall.position.x >= goal.edges.leftEdge.x &&
        newBall.position.x <= goal.edges.rightEdge.x &&
        newBall.position.y >= goal.position.y - goal.girth / 2 &&
        newBall.position.y <= goal.position.y + goal.girth / 2 &&
        newBall.velocity.y > 0 &&
        newBall.hasScored !== true
    ) {
        newBall.hasScored = true;
        console.log('SCORE!!!!');
        scorePoint();
    }
}

function getBounceVelocity(corner) {
    const normalVector = {x: corner.x - newBall.position.x, y: corner.y - newBall.position.y};
    const magnitude = Math.sqrt(normalVector.x ** 2 + normalVector.y ** 2);
    const normalized = { x: normalVector.x / magnitude, y: normalVector.y / magnitude};
    const positionOffset = { x: normalized.x * offsetDistance, y: normalized.y * offsetDistance };
    const dotProduct = newBall.velocity.x * normalized.x + newBall.velocity.y * normalized.y;
    // Vnew = v - 2(v*n)n
    const subtrahend = {x: normalized.x * dotProduct *2, y: normalized.y * dotProduct * 2};
    const newVelocity = { x: newBall.velocity.x - subtrahend.x, y: newBall.velocity.y - subtrahend.y };
    //Move ball back along bounce vector to ensure it doesn't get stuck in geometry and then modify ball velocity
    newBall.position = { x: newBall.position.x -= positionOffset.x, y: newBall.position.y -= positionOffset.y };
    newBall.velocity = { x: newVelocity.x * 0.8, y: newVelocity.y * 0.8 }; //Factor in elasticity coefficient
}