const allScores = JSON.parse(localStorage.getItem('allScores')) || {};
const userScore = storedData && allScores[storedData.username] ? allScores[storedData.username] : null;

//DOM elements for displaying personal highest scores
const easyHighestScore = document.getElementById("easy-highest-score");
const normalHighestScore = document.getElementById("normal-highest-score");
const hardHighestScore = document.getElementById("hard-highest-score");

//Updating personal highest score for the current user
if (storedData && storedData.isLoggedIn && userScore) {
    easyHighestScore.textContent = "EASY: " + userScore.highestScore["easy"];
    normalHighestScore.textContent = "NORMAL: " + userScore.highestScore["normal"];
    hardHighestScore.textContent = "HARD: " + userScore.highestScore["hard"];
} else {
    //Display 0 for all difficulties if user is not logged in
    easyHighestScore.textContent = "EASY: 0";
    normalHighestScore.textContent = "NORMAL: 0";
    hardHighestScore.textContent = "HARD: 0";
}


//Update leaderboard for each difficulty with the top 5 players
function updateLeaderboard(difficulty, difficultyUsername, difficultyScore){
    const allScores = JSON.parse(localStorage.getItem('allScores')) || {};
    
    //Get each user's highest score for each difficulty
    let players = {};
    for(const username in allScores){
        players[username] = allScores[username].highestScore[difficulty]
    }

    //Sort players by score in descending order and retrieve the top 5
    const sortedPlayers = Object.entries(players).sort((a, b) => b[1] - a[1]).slice(0,5);

    const leaderboardUsername = document.querySelectorAll(difficultyUsername);
    const leaderboardScore = document.querySelectorAll(difficultyScore);

    //Set each card's username and score default values
    leaderboardUsername.forEach(usernameSpan => usernameSpan.textContent = "No Player");
    leaderboardScore.forEach(usernameSpan => usernameSpan.textContent = "0");

    //Populate leaderboard with sorted player data
    sortedPlayers.forEach(([username, score], index) => {
        if (leaderboardUsername[index]) leaderboardUsername[index].textContent = username;
        if (leaderboardScore[index]) leaderboardScore[index].textContent = score;
        
    })
  
}

//Creates 5 leaderboard entries for each difficulty in the leaderboard box
function createLeaderboard(difficulty, containerSelector, listClassName) {
    const list = document.querySelector(containerSelector)
    
    //Helper function for adding a single leaderboard entry
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

    //Add 5 entries in the leaderboard
    while (list.children.length < 5){
        addEntries();
    }
}

//Make entries for each leaderboard box
createLeaderboard("easy", ".easy-list", "points");
createLeaderboard("normal", ".normal-list", "normal-points");
createLeaderboard("hard", ".hard-list", "points");

//Populate entries with user score data
updateLeaderboard("easy", ".easy-username", ".easy-back-side");
updateLeaderboard("normal", ".normal-username", ".normal-back-side");
updateLeaderboard("hard", ".hard-username", ".hard-back-side");