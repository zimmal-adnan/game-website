export class GameOver{
    constructor(){
        this.gameOverTexts = ['Do better.', 'Are you even trying?', "You're supposed to DODGE that.", 'Aggaiinn??', 'Maybe try playing the game correctly!'];
        this.scores = {easy: [], normal: [], hard: []};
        this.highestScore = {easy: 0, normal: 0, hard: 0};
    }

    gameOverScreen(game){
        const gameOverScreen = document.getElementById('game-over-screen');
        gameOverScreen.classList.add('show');
        gameOverScreen.style.opacity = 1;
        gameOverScreen.style.pointerEvents = 'auto';

        
        const gameOverText = document.getElementById('gameOverText');
        gameOverText.textContent = this.gameOverTexts[Math.floor(Math.random() * this.gameOverTexts.length)];

        const finalScoreValue = game.score.getFinalScore();
        const finalScore = document.getElementById('finalScore');
        finalScore.textContent = "FINAL SCORE: " + finalScoreValue;

        this.saveScore(finalScoreValue, game.difficultyName);

        const restart = document.getElementById('restart');
        restart.addEventListener('click', () => window.location.reload());

    }

    saveScore(finalScoreValue, difficultyName){
        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {}; 
        
        //if user is logged in, get user's credentials
        const storedData = currentUser ? allUsers[currentUser.username] : null;

        if(storedData && storedData.isLoggedIn === true){
            let allScores = JSON.parse(localStorage.getItem('allScores')) || {};
            
            //if the current user doesn't have a score record, it makes a record for them
            if(!allScores[storedData.username]){
                allScores[storedData.username] = {
                    username: storedData.username,
                    scores: this.scores,
                    highestScore: this.highestScore
                };
            }

            let userScore = allScores[storedData.username];
            userScore.scores[difficultyName].push(finalScoreValue);

            userScore.highestScore["easy"] = Math.max(...userScore.scores.easy, 0);
            userScore.highestScore["normal"] = Math.max(...userScore.scores.normal, 0);
            userScore.highestScore["hard"] = Math.max(...userScore.scores.hard, 0);
            
            allScores[storedData.username] = userScore;
            localStorage.setItem('allScores', JSON.stringify(allScores));
        }
    }
}