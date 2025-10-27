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
