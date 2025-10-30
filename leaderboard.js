const allScores = JSON.parse(localStorage.getItem('allScores')) || {};

const userScore = storedData && allScores[storedData.username] ? allScores[storedData.username] : null;

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
    const allScores = JSON.parse(localStorage.getItem('allScores')) || {};
    
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
        if (leaderboardUsername[index]) leaderboardUsername[index].textContent = username;
        if (leaderboardScore[index]) leaderboardScore[index].textContent = score;
        
    })
  
}

function createLeaderboard(difficulty, containerSelector, listClassName) {
    const list = document.querySelector(containerSelector)
    
    function addEntries(){
        const li = document.createElement('li');
        li.classList.add(listClassName);
        list.appendChild(li);

        const frontSide = document.createElement('div');
        frontSide.classList.add('front-side');
        li.appendChild(frontSide);

        const username = document.createElement('span');
        username.classList.add(`${difficulty}-username`);
        frontSide.appendChild(username);

        const backSide= document.createElement('div');
        backSide.classList.add(`${difficulty}-back-side`);
        li.appendChild(backSide);
    }

    while (list.children.length < 5){
        addEntries();
    }
}

createLeaderboard("easy", ".easy-list", "points");
createLeaderboard("normal", ".normal-list", "normal-points");
createLeaderboard("hard", ".hard-list", "points");

updateLeaderboard("easy", ".easy-username", ".easy-back-side");
updateLeaderboard("normal", ".normal-username", ".normal-back-side");
updateLeaderboard("hard", ".hard-username", ".hard-back-side");