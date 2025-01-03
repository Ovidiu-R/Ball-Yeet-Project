import { newBall, goal } from ".";
import { Wall, Slope } from "./gameObjects";
import { scorePoint } from "./gameState";
import bounceSound from './media/basketball_bounce.mp3';
import hoopBounceSound from './media/basketball_hoop_bounce.mp3';
const canvas = document.getElementById('staticCanvas'); //Too lazy to import
const canvasD = document.getElementById('dynamicCanvas');
const offsetDistance = 4;
const slopeThreshold = 2;
const friction = 0.01;
const gravity = 0.25;
const elasticityCoeff = 0.8;
const repositionCoeff = 0.01;
const maxSpeed = 30;
const soundFiles = {
    standard: bounceSound,
    hoop: hoopBounceSound,
};
loadCollisionSounds(soundFiles);

//B O U N C E    A U D I O

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const gainNode = audioContext.createGain();

// Function to load and decode an audio file
async function loadSound(filePath) {
    const bounce = await fetch(filePath);
    const arrayBuffer = await bounce.arrayBuffer();
    return audioContext.decodeAudioData(arrayBuffer);
}

let collisionSounds = {};

//Function to preload all collision sounds
export async function loadCollisionSounds(soundFiles) {
    const sounds = {};
    for (const [key, filePath] of Object.entries(soundFiles)) {
        sounds[key] = await loadSound(filePath);
    }
    collisionSounds = sounds; // Assign all sounds at once
    console.log('Collision sounds loaded:', collisionSounds);
}

export function setCollisionSoundVolume(speed) {
    // Normalize speed to a range between 0 and 1
    const normalizedSpeed = Math.min(Math.max(speed / maxSpeed, 0), 1);

    // Map normalized speed to volume (optional: use a curve for smoother control)
    const volume = Math.pow(normalizedSpeed, 0.5); // Example: square root for a smoother increase

    // Set the volume
    gainNode.gain.value = volume;

    console.log(`Speed: ${speed}, Volume: ${volume.toFixed(2)}`);
}

// Function to play the collision sound using AudioBuffer
export function playCollisionSound(soundKey) {
    const collisionBuffer = collisionSounds[soundKey];
    if (!collisionBuffer) {
        console.warn (`Sound key "${soundKey}" not found.`);
        return;
    }

    const soundSource = audioContext.createBufferSource();
    soundSource.buffer = collisionBuffer;
    soundSource.connect(gainNode);
    gainNode.connect(audioContext.destination);
    soundSource.start(0); // Plays the sound immediately
}

//C O L L I S I O N    L O G I C

export function basicHandler() {
    checkCanvasEdges();
    checkWalls();
    checkSlopes();
    checkGoal();
}

function checkCanvasEdges() {
    if (newBall.position.y + newBall.velocity.y > canvas.height - newBall.radius ||
        newBall.position.y + newBall.velocity.y < newBall.radius) {
        newBall.collisionData.vertical = true;
        playCollisionSound('standard');
    }
    if (newBall.position.x + newBall.velocity.x > canvas.width - newBall.radius || 
        newBall.position.x + newBall.velocity.x < newBall.radius) {
        newBall.collisionData.horizontal = true;
        playCollisionSound('standard');
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
            playCollisionSound('hoop');
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
    setCollisionSoundVolume(Math.hypot(newVelocity.x, newVelocity.y));
    //Move ball back along bounce vector to ensure it doesn't get stuck in geometry and then modify ball velocity
    newBall.position = { x: newBall.position.x -= positionOffset.x, y: newBall.position.y -= positionOffset.y };
    newBall.velocity = { x: newVelocity.x * elasticityCoeff, y: newVelocity.y * elasticityCoeff }; //Factor in elasticity coefficient
}

function checkSlopes() {
    Slope.allInstances.forEach (slope => {
        const { top, bottom } = slope;
        let slopeVector = { x: bottom.x - top.x, y: bottom.y - top.y };
        let slopeAngle = Math.atan2(slopeVector.y, slopeVector.x);
        let AtoBall = { x: newBall.position.x - top.x, y: newBall.position.y - top.y };

        // Calculate perpendicular distance from ball center to slope line
        let numerator = Math.abs(slopeVector.y * AtoBall.x - slopeVector.x * AtoBall.y);
        let denominator = Math.sqrt(slopeVector.y ** 2 + slopeVector.x ** 2);
        let distance = numerator / denominator;

        // Check if the ball's center is within the bounds of the segment
        let dotProductSlope = slopeVector.x * slopeVector.x + slopeVector.y * slopeVector.y;
        let dotProductAtoBall = AtoBall.x * slopeVector.x + AtoBall.y * slopeVector.y;
        let projection = dotProductAtoBall / dotProductSlope;
            
        if (projection >= 0 && projection <= 1 && distance <= newBall.radius) {
            console.log('top', top, 'bottom', bottom);

            // Ball is in contact with this slope
            console.log("Ball is in contact with slope", slope);
            let normalSlopeVector = {x: - slopeVector.y, y: slopeVector.x };
            const magnitude = Math.sqrt(normalSlopeVector.x ** 2 + normalSlopeVector.y ** 2);
            const normalizedSlopeVector = { x: normalSlopeVector.x / magnitude, y: normalSlopeVector.y / magnitude };
            let normalSlopeDotProduct = AtoBall.x * normalSlopeVector.x + AtoBall.y * normalSlopeVector.y;

            // Find perpendicular and parallel components of velocity
            const dotProduct = newBall.velocity.x * normalizedSlopeVector.x + newBall.velocity.y * normalizedSlopeVector.y;
            const perpendicularVelocity = { x: normalizedSlopeVector.x * dotProduct, y: normalizedSlopeVector.y * dotProduct };
            const parallelVelocity = {
                x: newBall.velocity.x - perpendicularVelocity.x,
                y: newBall.velocity.y - perpendicularVelocity.y
            };

            // Check if the perpendicular velocity is below the threshold to transition to sliding
            if (slope.onGround && 
                (
                    (normalSlopeDotProduct > 0 && Math.hypot(perpendicularVelocity.x, perpendicularVelocity.y) < slopeThreshold - repositionCoeff) ||
                    (normalSlopeDotProduct < 0 && Math.hypot(perpendicularVelocity.x, perpendicularVelocity.y) < slopeThreshold + repositionCoeff)
                ) 
            ){
                // Set perpendicular velocity to zero for sliding
                newBall.velocity = parallelVelocity;
                newBall.velocity.y -= 0.25; // TEMPORARY FIX TO SHUT OFF GENERAL GRAVITY
                // Add gravity parallel to the slope
                const gravityAlongSlope = gravity * Math.sin(slopeAngle); // Use slope angle
                newBall.velocity.x += gravityAlongSlope * Math.cos(slopeAngle);
                newBall.velocity.y += gravityAlongSlope * Math.sin(slopeAngle);
                //Add friction while sliding
                const slopeFriction = friction * gravityAlongSlope;
                newBall.velocity.x -= slopeFriction * Math.cos(slopeAngle);
                newBall.velocity.y -= slopeFriction * Math.sin(slopeAngle);
            } else {
                console.log('SLOPE BOUNCE');
                // Handle bounce by subtracting 2*(v . n)*n and applying elasticity
                const bounceVelocity = {
                    x: newBall.velocity.x - 2 * perpendicularVelocity.x,
                    y: newBall.velocity.y - 2 * perpendicularVelocity.y
                };
                newBall.velocity.x = bounceVelocity.x * elasticityCoeff * 0.6;
                newBall.velocity.y = bounceVelocity.y * elasticityCoeff * 0.6;

                //Offset position to avoid overlaps  
                if (normalSlopeDotProduct > 0) {
                    // Ball is outside the slope; add offset to push it outward
                    newBall.position.x += normalSlopeVector.x * repositionCoeff;
                    newBall.position.y += normalSlopeVector.y * repositionCoeff;
                } else {
                    // Ball is inside the slope; subtract offset to push it outward
                    newBall.position.x -= normalSlopeVector.x * repositionCoeff;
                    newBall.position.y -= normalSlopeVector.y * repositionCoeff;
                }
                //Calculate perpendicular speed in order to adjust ball bounce volume
                const perpendicularMagnitude = Math.hypot(perpendicularVelocity.x, perpendicularVelocity.y);
                setCollisionSoundVolume(perpendicularMagnitude);
                playCollisionSound('standard');
            }
        } 
    });
}