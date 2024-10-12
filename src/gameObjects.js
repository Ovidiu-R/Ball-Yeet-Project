import { getLaunchArrowCoords } from './interactivityHandler';
export class Ball {
    constructor(x, y, vx, vy, radius = 30, color = 'blue') {
        this.position = {x: x, y: y};
        this.velocity = {x: vx, y: vy};
        this.radius = radius;
        this.color = color;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI *2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Gravity effect
        this.velocity.y += 0.55;

        //Bouncing logic
        if (this.position.y + this.velocity.y > canvas.height - this.radius ||
           this.position.y + this.velocity.y < this.radius) {
                this.velocity.y = -this.velocity.y;
           }
        if (this.position.x + this.velocity.x > canvas.width - this.radius || 
            this.position.x + this.velocity.x < this.radius) {
                this.velocity.x = -this.velocity.x;
        }
        
    }

    isMouseOver(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return distance <= this.radius;
    }
}

export class launchArrow {
    constructor(originX, originY, endX, endY) {
        this.origin = {x: originX, y: originY};
        this.end = {x: endX, y: endY};
    }

    getArrowHeadEdges() {
        const leftEdgeAngle = 245 * Math.PI / 180;
        const rightEdgeAngle = 295 * Math.PI / 180;
        const edgeLength = 50;
        const arrowTipCoords = getLaunchArrowCoords();
        const leftEdgeCoords = {
            x: arrowTipCoords.arrowX + edgeLength * Math.cos(leftEdgeAngle),
            y: arrowTipCoords.arrowY + edgeLength * Math.sin(leftEdgeAngle),
        }
        const rightEdgeCoords = {
            x: arrowTipCoords.arrowX + edgeLength * Math.cos(rightEdgeAngle),
            y: arrowTipCoords.arrowY + edgeLength * Math.sin(rightEdgeAngle),
        }
        return {leftEdgeCoords, rightEdgeCoords};
    }

    draw(ctx) {
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
