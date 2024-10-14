import { endY, getLaunchArrowCoords } from './interactivityHandler';
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

export class Ball {
    constructor(x, y, vx, vy, radius = 30, color = 'blue') {
        this.position = {x: x, y: y};
        this.velocity = {x: vx, y: vy};
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

    update(launchVelocityX = undefined, launchVelocityY = undefined) {
        if (launchVelocityX !== undefined) {
            this.velocity.x = launchVelocityX;
            this.velocity.y = launchVelocityY;
            this.velocity.y += 0.30;
        }
        if (this.collisionData.horizontal === true) {
            console.log('horizontal flip expected');
            this.velocity.x = -this.velocity.x * 0.9;
            this.collisionData.horizontal = false;
        } else {this.position.x += this.velocity.x;};
        if (this.collisionData.vertical === true) {
            console.log('vertical flip expected');
            this.velocity.y = -this.velocity.y * 0.9;
            this.collisionData.vertical = false;
        } else {this.position.y += this.velocity.y;}

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

    getArrowHeadEdges() {
        const edgeAngleOffset = 200 * Math.PI / 180;
        const edgeLength = 50;
        const arrowTipCoords = getLaunchArrowCoords();

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
