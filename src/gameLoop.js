import 

export function gameLoop() {
    clearCanvas();
    //Update ball position
    //Check for collisions (if collision, update ball velocity and position again in same loop)
    //Check for collisions a second time to make sure first collision resolution didn't cause another
    //Check game state(collision with goal should result in points or a level change, in which case the gameLoop should be ended instantly to save on resources and new level should be loaded
    //Draw ball
    //Draw walls
    //RequestAnimationFrame
}
