const allScores = JSON.parse(localStorage.getItem('allScores'));
const userScore = allScores[storedData.username];

const highestUserScore = document.getElementById("highest-user-score");

const easyHighestScore = document.getElementById("easy-highest-score");
const normalHighestScore = document.getElementById("normal-highest-score");
const hardHighestScore = document.getElementById("hard-highest-score");

easyHighestScore.textContent = "EASY: " + userScore.highestScore["easy"]
normalHighestScore.textContent = "NORMAL: " + userScore.highestScore["normal"]
hardHighestScore.textContent = "HARD: " + userScore.highestScore["hard"]


if(!storedData || storedData.isLoggedIn === false){
    highestUserScore.textContent = "YOUR BEST: 0";
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
        if(leaderboardUsername[index]){
            leaderboardUsername[index].textContent = username;
        }
        if(leaderboardScore[index]){
            leaderboardScore[index].textContent = score;
        }
    })
  
}

updateLeaderboard("easy", ".easy-username", ".easy-back-side");
updateLeaderboard("normal", ".normal-username", ".normal-back-side");
updateLeaderboard("hard", ".hard-username", ".hard-back-side");