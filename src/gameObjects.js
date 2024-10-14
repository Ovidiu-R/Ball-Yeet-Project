import { endY, getLaunchArrowCoords } from './interactivityHandler';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gravity = 10; //Assume 1 meter equals 100 pixels and factor in Earth gravity
// const dt = 1 / 60; //

export class Ball {
    constructor(x, y, vx, vy, radius = 30, color = 'blue') {
        this.position = {x: x, y: y};
        this.velocity = {x: vx, y: vy};
        this.isLaunched = false;
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
        ctx.fill();
    }
    launch(launchVelocityX = undefined, launchVelocityY = undefined) {
        if (launchVelocityX !== undefined) {
            this.velocity.x = launchVelocityX;
            this.velocity.y = launchVelocityY;
            this.isLaunched = true;
            console.log (this.velocity.x, this.velocity.y);
        }
    }
    update() {
        if (this.isLaunched) {
            this.velocity.y += 0.15;
            // this.velocity.y += gravity * dt;
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
        // if (this.isLaunched && Math.abs(this.velocity.y) < 0.1){
        //     this.position.y = 500;
        // }

        //Gravity effect
        // this.velocity.y += 0.30;

        
    }

    isMouseOver(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.position.x) ** 2 + (mouseY - this.position.y) ** 2);
        return distance <= this.radius;
    }
}


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
        console.log('distance', distance);
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
