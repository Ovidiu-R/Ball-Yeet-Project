import { endY, getLaunchArrowCoords } from './interactivityHandler';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }
    launch(launchVelocityX = undefined, launchVelocityY = undefined) {
        if (launchVelocityX !== undefined) {
            this.velocity.x = launchVelocityX;
            this.velocity.y = launchVelocityY;
            this.windSpeed = Math.random() * 0.2 - 0.1; //Apply a random wind vector between -2 and 2
            this.velocity.x += this.windSpeed;
            this.isLaunched = true;
            // console.log (this.velocity.x, this.velocity.y);
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
                this.velocity.x += this.windSpeed; //Add wind speed while ball is airborne
            }             
        }

        //Flip velocity on and decrease velocity on each collision
        if (this.collisionData.horizontal === true) {
            this.velocity.x = -this.velocity.x * 0.6;
            this.collisionData.horizontal = false;
        } else {this.position.x += this.velocity.x;};
        if (this.collisionData.vertical === true) {
            this.velocity.y = -this.velocity.y * 0.6;
            this.collisionData.vertical = false;
        } else {this.position.y += this.velocity.y;}

        if (this.isLaunched && Math.abs(this.velocity.y) < 0.1 && this.position.y > (canvas.height - this.radius)){
            this.position.y = canvas.height - this.radius;
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
    constructor(originX, originY, endX, endY, color) {
        this.origin = {x: originX, y: originY};
        this.end = {x: endX, y: endY};
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
        const arrowTipCoords = getLaunchArrowCoords();

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
            x: arrowTipCoords.x + edgeLength * Math.cos(leftEdgeAngle),
            y: arrowTipCoords.y + edgeLength * Math.sin(leftEdgeAngle),
        }
        const rightEdgeCoords = {
            x: arrowTipCoords.x + edgeLength * Math.cos(rightEdgeAngle),
            y: arrowTipCoords.y + edgeLength * Math.sin(rightEdgeAngle),
        }
        return {leftEdgeCoords, rightEdgeCoords};
    }

    draw() {
        if (this.visibility === true) {
            const arrow = this.getArrowHeadEdges();
            ctx.beginPath();
            ctx.moveTo(this.origin.x, this.origin.y);
            ctx.lineTo(this.end.x, this.end.y);
            ctx.lineTo(arrow.leftEdgeCoords.x, arrow.leftEdgeCoords.y);
            ctx.moveTo(this.end.x, this.end.y);
            ctx.lineTo(arrow.rightEdgeCoords.x, arrow.rightEdgeCoords.y);
            ctx.stroke();
        }
        
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

        Wall.allInstances.push(this);
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.bottomLeft.x, this.bottomLeft.y);
        ctx.lineTo(this.topLeft.x, this.topLeft.y);
        ctx.lineTo(this.topRight.x, this.topRight.y);
        ctx.lineTo(this.bottomRight.x, this.bottomRight.y);
        ctx.closePath();
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'brown';
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
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

        ctx.beginPath();
        ctx.ellipse ( this.position.x, this.position.y, this.horRadius, this.verRadius, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = 'green'; 
        ctx.lineWidth = this.girth;
        ctx.stroke();
        ctx.closePath(); 
    }
}

export class GoalPost {
    constructor (centreX, centreY, ellipseHeight, lineWidth = 7, color = 'black') {
        this.position = { x: centreX, y: centreY - ellipseHeight +5};
        this.lineWidth = lineWidth;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo (this.position.x, this.position.y);
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.lineTo (this.position.x, this.position.y + 155);
        ctx.lineTo (this.position.x - 30, this.position.y + 185);
        ctx.moveTo (this.position.x, this.position.y + 155);
        ctx.lineTo (this.position.x + 30, this.position.y + 185);
        ctx.stroke();
        ctx.closePath();
    }
}
