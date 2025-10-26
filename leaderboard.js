const allScores = JSON.parse(localStorage.getItem('allScores'));
const userScore = storedData ? allScores[storedData.username] : null;

const easyHighestScore = document.getElementById("easy-highest-score");
const normalHighestScore = document.getElementById("normal-highest-score");
const hardHighestScore = document.getElementById("hard-highest-score");


if (storedData && storedData.isLoggedIn && userScore) {
    easyHighestScore.textContent = "EASY: " + userScore.highestScore["easy"];
    normalHighestScore.textContent = "NORMAL: " + userScore.highestScore["normal"];
    hardHighestScore.textContent = "HARD: " + userScore.highestScore["hard"];
} else {
    easyHighestScore.textContent = "EASY: 0";
    normalHighestScore.textContent = "NORMAL: 0";
    hardHighestScore.textContent = "HARD: 0";
}


function updateLeaderboard(difficulty, difficultyUsername, difficultyScore){
    
    
    let players = {};

    for(const username in allScores){
        players[username] = allScores[username].highestScore[difficulty]
    }

    const sortedPlayers = Object.entries(players).sort((a, b) => b[1] - a[1]).slice(0,5);

    const leaderboardUsername = document.querySelectorAll(difficultyUsername);
    const leaderboardScore = document.querySelectorAll(difficultyScore);

    leaderboardUsername.forEach(usernameSpan => usernameSpan.textContent = "No Player");
    leaderboardScore.forEach(usernameSpan => usernameSpan.textContent = "0");

    sortedPlayers.forEach(([username, score], index) => {
        leaderboardUsername[index].textContent = username;
        leaderboardScore[index].textContent = score;
        
    })
  
}

updateLeaderboard("easy", ".easy-username", ".easy-back-side");
updateLeaderboard("normal", ".normal-username", ".normal-back-side");
updateLeaderboard("hard", ".hard-username", ".hard-back-side");