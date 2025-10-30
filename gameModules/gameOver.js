//Handles showing the game over screen and score management after collision
export class GameOver{
    constructor(){
        this.gameOverTexts = ['Do better.', 'Are you even trying?', "You're supposed to DODGE that.", 'Aggaiinn??', 'Maybe try playing the game correctly!'];
        this.scores = {easy: [], normal: [], hard: []}; //Store user's scores for each difficulty level
        this.highestScore = {easy: 0, normal: 0, hard: 0}; 
    }

    //Displays the game over screen
    gameOverScreen(game){
        const gameOverScreen = document.getElementById('game-over-screen');
        gameOverScreen.classList.add('show');
        gameOverScreen.style.opacity = 1;
        gameOverScreen.style.pointerEvents = 'auto';

        //Display random game over message
        const gameOverText = document.getElementById('gameOverText');
        gameOverText.textContent = this.gameOverTexts[Math.floor(Math.random() * this.gameOverTexts.length)];

        //Retrieve and display the player's final score
        const finalScoreValue = game.score.getFinalScore();
        const finalScore = document.getElementById('finalScore');
        finalScore.textContent = "FINAL SCORE: " + finalScoreValue;

        //Save the player's final score based on the current difficulty
        this.saveScore(finalScoreValue, game.difficultyName);

        //Reload the page on click
        const restart = document.getElementById('restart');
        restart.addEventListener('click', () => window.location.reload());

    }

    //Saves player's score to localStorage
    saveScore(finalScoreValue, difficultyName){
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {}; 
        
        //Retrieve's user credentials if logged in
        const storedData = currentUser ? allUsers[currentUser.username] : null;

        if(storedData && storedData.isLoggedIn === true){
            let allScores = JSON.parse(localStorage.getItem('allScores')) || {};
            
            //Create a score record for the user if it doesn't exist
            if(!allScores[storedData.username]){
                allScores[storedData.username] = {
                    username: storedData.username,
                    scores: this.scores,
                    highestScore: this.highestScore
                };
            }

            //Update the user's score for the difficulty
            let userScore = allScores[storedData.username];
            userScore.scores[difficultyName].push(finalScoreValue);

            //Update the highest scores for each difficulty
            userScore.highestScore["easy"] = Math.max(...userScore.scores.easy, 0);
            userScore.highestScore["normal"] = Math.max(...userScore.scores.normal, 0);
            userScore.highestScore["hard"] = Math.max(...userScore.scores.hard, 0);
            
            //Save the updated scores back to localStorage
            allScores[storedData.username] = userScore;
            localStorage.setItem('allScores', JSON.stringify(allScores));
        }
    }
}