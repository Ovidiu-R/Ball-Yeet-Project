import { endY, getLaunchArrowCoords } from './interactivityHandler';
import { playCollisionSound, setCollisionSoundVolume } from './collisionHandler';
import { newBall, canvasBackground, goalPost, newSlope } from ".";
import ebony from './media/ebony-small.jpg';
import bricks from './media/bricks-small.jpg';
import rust from './media/rust-small.jpg';
import metal1 from './media/metal-tiny1.jpg';
import metal2 from './media/metal-vent-tiny.jpg';
import walnut from './media/walnut-small.jpg';
import woodBackground from './media/wood-background-L.jpg';
let staticCanvas = document.getElementById('staticCanvas');
let sCtx = staticCanvas.getContext('2d');
let dynamicCanvas = document.getElementById('dynamicCanvas');
let dCtx = dynamicCanvas.getContext('2d');
let mainBackground, secondaryBackground, goalPostFill, goalFill, slopeEdge, slopeBackground;

// hoopFill = await loadImage (rust);
// B A L L

export class Ball {
    constructor(x, y, vx, vy, radius = 30, color = 'blue') {
        this.position = {x: x, y: y};
        this.velocity = {x: vx, y: vy};
        this.windSpeed = undefined;
        this.isLaunched = false;
        this.isGrounded = false;
        this.hasScored = false;
        this.radius = radius;
        this.color = color;
        this.collisionData = {
            horizontal: false,
            vertical: false
        };
    }

    draw() {
        dCtx.beginPath();
        dCtx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2, true);
        dCtx.closePath();
        dCtx.fillStyle = this.color;
        dCtx.strokeStyle = 'black';
        dCtx.lineWidth = 2;
        dCtx.fill();
        dCtx.stroke();
    }
    launch(launchVelocityX = undefined, launchVelocityY = undefined) {
        if (launchVelocityX !== undefined) {
            this.velocity.x = launchVelocityX;
            this.velocity.y = launchVelocityY;
            this.windSpeed = Math.random() * 0.2 - 0.1; //Apply a random wind vector between -2 and 2
            this.velocity.x += this.windSpeed;
            this.isLaunched = true;
        }
    }
    update() {
        if (this.isLaunched) {
            this.velocity.y += 0.25; //Apply gravity
            if (this.isGrounded) {   //Apply friction with velocity cutoff point
                this.velocity.x *= 0.99;
                // if (this.velocity.x > 0.01) {
                //     this.velocity.x *= 0.99;
                // } else {this.velocity.x = 0;}
                
            } else {
                // this.velocity.x += this.windSpeed; //Add wind speed while ball is airborne
            }             
        }

        //Flip velocity on and decrease velocity on each collision
        if (this.collisionData.horizontal === true) {
            this.velocity.x = -this.velocity.x * 0.8;
            this.collisionData.horizontal = false;
            setCollisionSoundVolume(Math.abs(this.velocity.x));
            playCollisionSound('standard');
        } else {this.position.x += this.velocity.x;};
        if (this.collisionData.vertical === true) {
            this.velocity.y = -this.velocity.y * 0.8;
            this.collisionData.vertical = false;
            if (this.isGrounded !== true && Math.abs(this.velocity.y <= 0.7)) {
                setCollisionSoundVolume(Math.abs(this.velocity.y));
                playCollisionSound('standard');
            }
        } else {this.position.y += this.velocity.y;}

        if (this.isLaunched && Math.abs(this.velocity.y) < 0.1 && this.position.y > (staticCanvas.height - this.radius - 150)){
            this.position.y = staticCanvas.height - this.radius -150;
            this.isGrounded = true;
        }
 
    }

    isMouseOver(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.position.x) ** 2 + (mouseY - this.position.y) ** 2);
        return distance <= this.radius;
    }
}

// A R R O W

export class launchArrow {
    constructor(originX, originY, endX, endY, color = 'black') {
        this.origin = {x: originX, y: originY};
        this.end = {x: endX, y: endY};
        this.tip = {x: undefined, y: undefined};
        this.visibility = false;
        this.color = color;
    }

    
    update(originX, originY, endX, endY, visibility) {
        this.origin = {x: originX, y: originY};
        this.end = {x: endX, y: endY};
        this.visibility = visibility;
    }

    getArrowLength() {
        const distance = Math.sqrt((this.origin.x - this.end.x) ** 2 + (this.origin.y - this.end.y) ** 2);
        // console.log('distance', distance);
        return distance;
    }

    getArrowHeadEdges() {
        const edgeAngleOffset = 200 * Math.PI / 180;
        let edgeLength;
        // this.end = getLaunchArrowCoords();
        this.tip = getLaunchArrowCoords();
        // const arrowTipCoords = getLaunchArrowCoords();

        if (this.getArrowLength() < 100) {
            edgeLength = this.getArrowLength() / 2;
        } else if (100 <= this.getArrowLength() <200){
            edgeLength = this.getArrowLength() / 3;
        } else {
            edgeLength = this.getArrowLength() / 4;
        }
        //Compute angle of the arrow shaft
        const shaftAngle = Math.atan2(this.end.y - this.origin.y, this.end.x - this.origin.x)

        //Calculate angles for left and right edges of arrowhead
        const leftEdgeAngle = shaftAngle + edgeAngleOffset;
        const rightEdgeAngle = shaftAngle - edgeAngleOffset;

        //Calculate coordinates for segments making up the left and right edges of the arrowhead
        const leftEdgeCoords = {
            x: this.end.x + edgeLength * Math.cos(leftEdgeAngle),
            y: this.end.y + edgeLength * Math.sin(leftEdgeAngle),
        }
        const rightEdgeCoords = {
            x: this.end.x + edgeLength * Math.cos(rightEdgeAngle),
            y: this.end.y + edgeLength * Math.sin(rightEdgeAngle),
        }
        return {leftEdgeCoords, rightEdgeCoords};
    }

    draw() {
        if (this.visibility === true) {
            //Draw arrow shaft
            dCtx.beginPath();
            dCtx.strokeStyle = this.color; 
            dCtx.lineWidth = this.getArrowLength() / 20;

            //Adjust shaft end coordinates based on line width
            const arrow = this.getArrowHeadEdges();             // Should move this logic elsewhere
            this.adjustEndCoordinates();
            
            dCtx.moveTo(this.origin.x, this.origin.y);
            dCtx.lineTo(this.end.x, this.end.y);
            dCtx.stroke();


            //Draw triangular arrow head
            dCtx.beginPath();
            dCtx.moveTo(this.tip.x, this.tip.y);
            dCtx.lineTo(arrow.leftEdgeCoords.x, arrow.leftEdgeCoords.y);
            dCtx.lineTo(arrow.rightEdgeCoords.x, arrow.rightEdgeCoords.y);
            dCtx.closePath(); 
            dCtx.fillStyle = this.color; 
            dCtx.fill(); 
        }
        
    }

    adjustEndCoordinates() {
        const direction = {
            x: this.end.x - this.origin.x,
            y: this.end.y - this.origin.y,
        };
        const directionMagnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
        const unitDirection = {
            x: direction.x / directionMagnitude,
            y: direction.y / directionMagnitude,
        };
        const offsetDistance = dCtx.lineWidth * 1.5;
        const adjustedEnd = {
            x: this.end.x - unitDirection.x * offsetDistance,
            y: this.end.y - unitDirection.y * offsetDistance,
        };
        this.update(newBall.position.x, newBall.position.y, adjustedEnd.x, adjustedEnd.y, false);
    }
}

// W A L L

export class Wall {
    static allInstances = []; //Hold all wall instances

    constructor (startX, startY, height, width, material = "metal") {
        this.bottomLeft = {x: startX, y: startY};
        this.topLeft = {x: startX, y: startY - height};
        this.topRight = {x: startX + width, y: startY - height};
        this.bottomRight = {x: startX + width, y: startY};
        this.drawn = false;
        this.material = material;
        Wall.allInstances.push(this);
    }

    draw() {
            const pattern = sCtx.createPattern(secondaryBackground, 'repeat');
            sCtx.beginPath();
            sCtx.moveTo(this.bottomLeft.x, this.bottomLeft.y);
            sCtx.lineTo(this.topLeft.x, this.topLeft.y);
            sCtx.lineTo(this.topRight.x, this.topRight.y);
            sCtx.lineTo(this.bottomRight.x, this.bottomRight.y);
            sCtx.closePath();
            sCtx.strokeStyle = 'black';
            sCtx.fillStyle = pattern;
            sCtx.lineWidth = 3;
            sCtx.fill(); 
            sCtx.stroke();   
    }
}

// S L O P E
export class Slope {
    static allInstances = []; //Hold all wall instances

    constructor (pointAx, pointAy, pointBx, pointBy, onGround = true) {
        console.log (pointAx, pointAy, pointBx, pointBy);
        if (pointAy < pointBy) {
            this.top = { x: pointAx, y: pointAy };
            this.bottom = { x: pointBx, y: pointBy };
        } else {
            this.top = { x: pointBx, y: pointBy };
            this.bottom = { x: pointAx, y: pointAy };
        }
        this.onGround = onGround;
        this.drawn = false;
        console.log(this.top, this.bottom);
        Slope.allInstances.push(this);
    }

    draw() {
        const slopeEdgeWidth = 10;
        const mainPattern = sCtx.createPattern(slopeBackground, 'repeat');
        const edgePattern = sCtx.createPattern(slopeEdge, 'repeat');
        if (this.onGround == true) {
            //Draw slope body
            sCtx.fillStyle = mainPattern;
            sCtx.beginPath();
            sCtx.moveTo(this.top.x, this.top.y);
            sCtx.lineTo(this.top.x, this.bottom.y);
            sCtx.lineTo(this.bottom.x, this.bottom.y);
            sCtx.closePath;
            sCtx.fill();

            //Draw slope edge
            sCtx.fillStyle = edgePattern;
            sCtx.strokeStyle = 'black';
            sCtx.lineWidth = 1;
            if (this.top.x > this.bottom.x) {
                sCtx.beginPath();
                sCtx.moveTo(this.top.x, this.top.y);
                sCtx.lineTo(this.bottom.x, this.bottom.y);
                sCtx.lineTo(this.bottom.x + slopeEdgeWidth, this.bottom.y);
                sCtx.lineTo(this.top.x + slopeEdgeWidth, this.top.y);
                sCtx.fill();  
                sCtx.stroke();
            } else {
                sCtx.beginPath();
                sCtx.moveTo(this.top.x, this.top.y);
                sCtx.lineTo(this.bottom.x, this.bottom.y);
                sCtx.lineTo(this.bottom.x - slopeEdgeWidth, this.bottom.y);
                sCtx.lineTo(this.top.x - slopeEdgeWidth, this.top.y);
                sCtx.fill();  
                sCtx.stroke();
            }
        } else {
            sCtx.fillStyle = mainPattern;
            sCtx.beginPath();
            sCtx.moveTo(this.top.x, this.top.y);
            sCtx.lineTo(this.bottom.x, this.top.y);
            sCtx.lineTo(this.bottom.x, this.bottom.y);
            sCtx.closePath;
            sCtx.fill();

            sCtx.fillStyle = edgePattern;
            sCtx.strokeStyle = 'black';
            sCtx.lineWidth = 1;
            if (this.top.x > this.bottom.x) {
                sCtx.beginPath();
                sCtx.moveTo(this.top.x, this.top.y);
                sCtx.lineTo(this.bottom.x, this.bottom.y);
                sCtx.lineTo(this.bottom.x - slopeEdgeWidth, this.bottom.y);
                sCtx.lineTo(this.top.x - slopeEdgeWidth, this.top.y);
                sCtx.fill();  
                sCtx.stroke();
            } else {
                sCtx.beginPath();
                sCtx.moveTo(this.top.x, this.top.y);
                sCtx.lineTo(this.bottom.x, this.bottom.y);
                sCtx.lineTo(this.bottom.x + slopeEdgeWidth, this.bottom.y);
                sCtx.lineTo(this.top.x + slopeEdgeWidth, this.top.y);
                sCtx.fill();  
                sCtx.stroke();
            }
        }
        
            
            

            
        
        // sCtx.beginPath();
        // sCtx.moveTo(this.top.x, this.top.y);
        // sCtx.lineTo(this.bottom.x, this.bottom.y);
        // sCtx.stroke();   
    }
}

// G O A L

export class Goal {
    constructor (centreX, centreY, verRadius, horRadius, girth) {
        this.position = { x: centreX, y: centreY };
        this.girth = girth;
        this.verRadius = verRadius;
        this.horRadius = horRadius;
        this.edges = {
            leftEdge: { x: centreX - this.horRadius, y: centreY},
            rightEdge: { x: centreX + this.horRadius, y: centreY}
        }
    }

    draw() {
        
        const pattern = dCtx.createPattern(goalFill, 'repeat');
        dCtx.strokeStyle = pattern;
        dCtx.beginPath();
        dCtx.ellipse ( this.position.x, this.position.y, this.horRadius, this.verRadius, 0, 0, 2 * Math.PI);
        // dCtx.strokeStyle = 'green'; 
        dCtx.lineWidth = this.girth;
        dCtx.stroke();
        dCtx.closePath(); 
    }
}

export class GoalPost {
    constructor (centreX, centreY, ellipseHeight, lineWidth = 10, color = 'black') {
        this.position = { x: centreX, y: centreY - ellipseHeight +5};
        this.lineWidth = lineWidth;
        this.color = color;
        this.drawn = false;
    }

    draw() {
        const pattern = sCtx.createPattern(goalPostFill, 'repeat');
        sCtx.lineWidth = this.lineWidth;
        sCtx.strokeStyle = pattern;
        sCtx.beginPath();
        sCtx.moveTo (this.position.x, this.position.y);
        sCtx.lineTo (this.position.x, this.position.y + 155);
        sCtx.lineTo (this.position.x - 30, this.position.y + 185);
        sCtx.moveTo (this.position.x, this.position.y + 155);
        sCtx.lineTo (this.position.x + 30, this.position.y + 185);
        sCtx.stroke();
        sCtx.closePath();
    }
}

// W I N   M E S S A G E

export class WinMessage {
    constructor (visibility = false, color = 'black') {
        this.visibility = visibility;
        this.color = color;
    }

    draw() {
        sCtx.font = '25px Verdana';
        sCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        sCtx.shadowBlue = 4;
        sCtx.fillStyle = this.color;
        sCtx.textAlign = 'center';        // Align text to the right of the given x-coordinate
        sCtx.textBaseline = 'top';    // Align text to the bottom of the given y-coordinate
    
        // Place text in the bottom-right corner
        sCtx.fillText('BOOM SHAKALAKA!', staticCanvas.width / 2, 20);
    }
}

export class CanvasBackground {
    constructor (loaded = false) {
        this.loaded = loaded;
    }
    draw() {
        const pattern = sCtx.createPattern(mainBackground, 'repeat');
        sCtx.fillStyle = pattern;
        sCtx.fillRect(0, 0, staticCanvas.width, staticCanvas.height);
    }
}

async function loadImage(src) {
    const image = new Image();
    image.src = src;
    await new Promise((resolve, reject) => {
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    });
    return image;
}

export async function loadImages() {
    try {
        mainBackground = await loadImage(ebony);
        secondaryBackground = await loadImage(bricks);
        goalPostFill = await loadImage(metal1);
        goalFill = await loadImage(metal2);
        slopeEdge = await loadImage(walnut);
        slopeBackground = await loadImage(woodBackground);
    } catch (error) {
        console.error(error);
    }
}

// async function scalePattern

export async function drawStaticCanvas() {
    
    if (canvasBackground.loaded !== true) {
        canvasBackground.draw();    
        canvasBackground.loaded = true;
    }

    if (goalPost.drawn == false) {
        goalPost.draw();
        goalPost.drawn = true;
    }

    if (Slope.allInstances[0].drawn == false) {
        Slope.allInstances.forEach(obj => obj.draw());
        Slope.allInstances[0].drawn = true;
        
    }

    if (Wall.allInstances[0].drawn == false) {
        Wall.allInstances.forEach(obj => obj.draw());
        Wall.allInstances[0].drawn = true;
    }


}

