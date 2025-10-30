//Handles selection of game difficulty
export class SelectDifficulty{
    constructor(game){
        this.game = game;
    }

    //Sets up event listeners for difficulty selection buttons
    chooseDifficulty(){
        const playEasy = document.getElementById('play-easy');
        const playNormal = document.getElementById('play-normal');
        const playHard = document.getElementById('play-hard');

        const difficultyButtons = [playEasy, playNormal, playHard];

        difficultyButtons.forEach(difficulty => {
            //Add click event listeners to each difficulty button
            difficulty.addEventListener('click', () => {

                const gameStartScreen = document.getElementById('game-start-screen');
                gameStartScreen.style.opacity = 0;
                gameStartScreen.style.pointerEvents = 'none';
                
                //Adjusts game speed and difficulty name based on the selected button
                if(difficulty === playEasy) {
                    this.game.gameSpeed = 3;
                    this.game.difficultyName = 'easy';
                }
                if(difficulty === playNormal) {
                    this.game.gameSpeed = 5;
                    this.game.difficultyName = "normal";
                }
                if(difficulty === playHard) {
                    this.game.gameSpeed = 7;
                    this.game.difficultyName = "hard";
                }

                //Start the game countdown before the game begins
                this.game.startCountdown();
            });
        });
        
    }
}

