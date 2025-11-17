/*References: 
1. Collision Detection: https://youtu.be/r0sy-Cr6WHY?si=1mFX8Lgo2L2tjXLh
*/

//Handles collision detection between player and obstacles
export class CollisionDetector{
    static collide(player, obstacle) {
        return (
            obstacle.x < player.x + player.width &&
            obstacle.x + (obstacle.size || obstacle.width) > player.x &&
            obstacle.y < player.y + player.height &&
            obstacle.y + (obstacle.size || obstacle.height) > player.y
        );
    }
}
