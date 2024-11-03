import { endY, getLaunchArrowCoords } from './interactivityHandler';
// import { staticCanvas, dynamicCanvas, sCtx, dCtx } from ".";
let staticCanvas = document.getElementById('staticCanvas');
let sCtx = staticCanvas.getContext('2d');
let dynamicCanvas = document.getElementById('dynamicCanvas');
let dCtx = dynamicCanvas.getContext('2d');


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
        } else {this.position.x += this.velocity.x;};
        if (this.collisionData.vertical === true) {
            this.velocity.y = -this.velocity.y * 0.8;
            this.collisionData.vertical = false;
        } else {this.position.y += this.velocity.y;}

        if (this.isLaunched && Math.abs(this.velocity.y) < 0.1 && this.position.y > (staticCanvas.height - this.radius)){
            this.position.y = staticCanvas.height - this.radius;
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

    
    update(endX, endY, visibility) {
        this.end.x = endX;
        this.end.y = endY;
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
        this.end = getLaunchArrowCoords();
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
        this.update(adjustedEnd.x, adjustedEnd.y, false);
    }
}

// W A L L

export class Wall {
    static allInstances = []; //Hold all wall instances

    constructor (startX, startY, height, width) {
        this.bottomLeft = {x: startX, y: startY};
        this.topLeft = {x: startX, y: startY - height};
        this.topRight = {x: startX + width, y: startY - height};
        this.bottomRight = {x: startX + width, y: startY};
        this.drawn = false;
        Wall.allInstances.push(this);
    }

    draw() {
        sCtx.beginPath();
        sCtx.moveTo(this.bottomLeft.x, this.bottomLeft.y);
        sCtx.lineTo(this.topLeft.x, this.topLeft.y);
        sCtx.lineTo(this.topRight.x, this.topRight.y);
        sCtx.lineTo(this.bottomRight.x, this.bottomRight.y);
        sCtx.closePath();
        sCtx.strokeStyle = 'black';
        sCtx.fillStyle = 'brown';
        sCtx.lineWidth = 3;
        sCtx.fill();
        sCtx.stroke();
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

        dCtx.beginPath();
        dCtx.ellipse ( this.position.x, this.position.y, this.horRadius, this.verRadius, 0, 0, 2 * Math.PI);
        dCtx.strokeStyle = 'green'; 
        dCtx.lineWidth = this.girth;
        dCtx.stroke();
        dCtx.closePath(); 
    }
}

export class GoalPost {
    constructor (centreX, centreY, ellipseHeight, lineWidth = 7, color = 'black') {
        this.position = { x: centreX, y: centreY - ellipseHeight +5};
        this.lineWidth = lineWidth;
        this.color = color;
        this.drawn = false;
    }

    draw() {
        sCtx.beginPath();
        sCtx.moveTo (this.position.x, this.position.y);
        sCtx.lineWidth = this.lineWidth;
        sCtx.strokeStyle = this.color;
        sCtx.lineTo (this.position.x, this.position.y + 155);
        sCtx.lineTo (this.position.x - 30, this.position.y + 185);
        sCtx.moveTo (this.position.x, this.position.y + 155);
        sCtx.lineTo (this.position.x + 30, this.position.y + 185);
        sCtx.stroke();
        sCtx.closePath();
    }
}

export class WinMessage {
    constructor (visibility = false) {
        this.visibility = visibility;
    }

    draw() {
        sCtx.font = '25px Verdana';
        sCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        sCtx.shadowBlue = 4;
        sCtx.fillStyle = 'black';
        sCtx.textAlign = 'center';        // Align text to the right of the given x-coordinate
        sCtx.textBaseline = 'top';    // Align text to the bottom of the given y-coordinate
    
        // Place text in the bottom-right corner
        sCtx.fillText('BOOM SHAKALAKA!', staticCanvas.width / 2, 20);
    }
}
