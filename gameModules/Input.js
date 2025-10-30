//Handles user input for the game
export class UserInput{
    constructor(game){
        this.game = game;
    }

    //Input event listeners
    inputs(){
        //On-screen left and right buttons
        document.getElementById('left').addEventListener('click', () => this.game.player.move("left"));
        document.getElementById('right').addEventListener('click', () => this.game.player.move("right"));
        document.getElementById('switch-world').addEventListener('click', () => this.game.switchWorld.worldSwitch());
        
        //Keyboard input for left and right movement
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.game.player.move("left");
            } else if (event.key === 'ArrowRight') {
                this.game.player.move("right");
            }
        });

        //Keyboard input for world switching
        document.addEventListener('keydown', (event) => {
            if(event.key === "B" || event.key === "b"){
                this.game.switchWorld.worldSwitch();
            }
        })
    }
}
