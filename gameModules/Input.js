export class UserInput{
    constructor(game){
        this.game = game;
    }

    inputs(){
        document.getElementById('left').addEventListener('click', () => this.game.player.move("left"));
        document.getElementById('right').addEventListener('click', () => this.game.player.move("right"));
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.game.player.move("left");
            } else if (event.key === 'ArrowRight') {
                this.game.player.move("right");
            }
        });

        document.addEventListener('keydown', (event) => {
            if(event.key === "B" || event.key === "b"){
                this.game.switchWorld.worldSwitch();
            }
        })
    }
}
