//===CANVAS SETUP===
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d'); //tells the browser will be drawing in 2d mode
const container = canvas.parentElement;

canvas.width = container.clientWidth; //width and height based on parent container's dimensions
canvas.height = container.clientHeight;

let gameOver = false;

function getRandomInt(min, max){
    //generates random integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let isBlackWorld = false;

//===PLAYER===
//class defining a blueprint for the Player object
class Player{
    constructor(x, y, width, height, color){
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(){
        context.fillStyle = this.color;
        //makes a rectangle at the player's coordinates
        context.fillRect(this.x, this.y, this.width, this.height); 
        
    }


    move(direction){

        const step = canvas.width * 0.20;
        if(direction === "left" && this.x - step >= 0){
            this.x -= step; //moves player's x position 20% of the canvas's width
        }
        if(direction === "right" && this.x + this.width + step <= canvas.width){
            this.x += step;
        }
    }
}

//creating the player
const playerWidth = 40;
const playerHeight = 40;
const x = (canvas.width / 2) - (playerWidth / 2);
const y = canvas.height * 0.85;
const player = new Player(x, y, playerWidth, playerHeight, 'blue');



//===OBSTACLES===
let gameSpeed;
const obstacles = []; //stores all falling objects currently active
const laneCount = 5;
const laneWidth = canvas.width / laneCount; //divides canvas into 5 equal horizontal sections

//===SCORES===
class Score{
    constructor(elementId){
        this.value = 0;
        this.element = document.getElementById(elementId);
    }

    increase(amount) {
        this.value += amount; //adds to score
        this.updateDisplay(); //add to score on screen
    }
    updateDisplay() {
        //updates the HTML element's number
        this.element.textContent = "Score: " + Math.floor(this.value);
    }
    
}

const myScore = new Score("score");
myScore.updateDisplay();

//class to define shared behaviour between the different obstacles

class Obstacle{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocityY = gameSpeed;
    }

    
    update(){
        this.y += this.velocityY; //every frame the obstacle moves down and draws itself
        this.draw();
    }
}

//each shape simply defines the size and how to draw it on the canvas
class Square extends Obstacle{
    constructor(x, y, size, color){
        super(x, y, color);
        this.size = size
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    }
}

class Rectangle extends Obstacle {
    constructor(x, y, width, height, color) {
        super(x, y, color);
        this.width = width;
        this.height = height;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}
class WideRectangle extends Obstacle {
    constructor(x, y, width, height, color, laneSpan) {
        super(x, y, color);
        this.width = width;
        this.height = height;
        this.laneSpan = laneSpan;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}



//===SPAWNING OBSTACLES===

//remembers which lanes obstacles last appeared in
let lastUsedLanes = [];

//make sure obstacles appear in a lane and not in a random position
function spawnObstacle(){
    if(gameOver) return;

    // Randomly decide if this spawn should be a wide rectangle (20% chance)
    const spawnWideRectangle = Math.random() < 0.2;

    if(spawnWideRectangle) {
        // Spawn a wide rectangle that covers 2-4 lanes
        const laneSpan = getRandomInt(2, 4);
        
        // Pick a random starting lane that allows the rectangle to fit
        const maxStartLane = laneCount - laneSpan;
        const startLane = Math.floor(Math.random() * (maxStartLane + 1));
        
        // Calculate position and size
        const x = startLane * laneWidth;
        const y = -70;
        const width = laneSpan * laneWidth;
        const height = getRandomInt(40, 70);
        const color = isBlackWorld ? "black" : "red";
        
        const obstacle = new WideRectangle(x, y, width, height, color, laneSpan);
        obstacles.push(obstacle);
        
        // Mark all covered lanes as used
        const usedLanes = [];
        for(let i = 0; i < laneSpan; i++) {
            usedLanes.push(startLane + i);
        }
        lastUsedLanes = usedLanes;
        
    } else {
        // Original logic for spawning multiple small obstacles
        const obstacleNumber = getRandomInt(1, 4);
        const usedLanes = new Set();

        for (let i = 0; i < obstacleNumber; i++){        
            let laneIndex;
            
            do {
                laneIndex = Math.floor(Math.random() * laneCount);
            } 
            while (usedLanes.has(laneIndex)); 
            usedLanes.add(laneIndex);

            const x = laneIndex * laneWidth + (laneWidth / 2);
            const y = -70; 
            const color = isBlackWorld ? "black" : "red";

            const shapeType = Math.floor(Math.random() * 2);
            let obstacle;

            switch (shapeType) {
                case 0:
                    const size = getRandomInt(40, 80);
                    obstacle = new Square(x - size / 2, y, size, color);
                    break;
                case 1:
                    const rectangleWidth = getRandomInt(40, 80);
                    const rectangleHeight = getRandomInt(80, 70);
                    obstacle = new Rectangle(x - rectangleWidth / 2, y, rectangleWidth, rectangleHeight, color);
                    break;
            }
            obstacles.push(obstacle); 
        }     
        lastUsedLanes = Array.from(usedLanes);
    }
    const nextSpawnDelay = getRandomInt(600, 1000);
    setTimeout(spawnObstacle, nextSpawnDelay);
}

let scores = {easy: [], normal: [], hard: []};
let highestScore = {easy: 0, normal: 0, hard: 0};

//===GAME OVER SCREEN===
function showGameOver(){
    if(gameOver) return;

    //Update() stops. Score freezes.
    gameOver = true;
    
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.style.opacity = 1;
    gameOverScreen.style.pointerEvents = 'auto';

    let gameOverTexts = ['Do better.', 'Are you even trying?', "You're supposed to DODGE that.", 'Aggaiinn??', 'Maybe try playing the game correctly!']
    let gameOverText = document.getElementById('gameOverText');
    gameOverText.textContent = gameOverTexts[Math.floor(Math.random() * gameOverTexts.length)];

    const finalScoreValue = Math.floor(myScore.value);
    const finalScore = document.getElementById('finalScore');
    finalScore.textContent = finalScoreValue;
    
    //get current user from localStorage
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {}; //get allUsers from localStorage
    
    //if user is logged in, get user's credentials
    const storedData = currentUser ? allUsers[currentUser.username] : null;

    if(storedData && storedData.isLoggedIn === true){

        //JSON object to store scores of every user who has played
        let allScores = JSON.parse(localStorage.getItem('allScores')) || {};
        
        //if the current user doesn't have a score record, it makes a record for them
        if(!allScores[storedData.username]){
            allScores[storedData.username] = {
                username: storedData.username,
                scores: scores,
                highestScore: highestScore
            };
        }

        //get current user's score object
        let userScore = allScores[storedData.username];

        //add finalScoreValue to the array corresponding to the current difficulty
        userScore.scores[difficultyName].push(finalScoreValue);

        userScore.highestScore["easy"] = Math.max(...userScore.scores.easy, 0);
        userScore.highestScore["normal"] = Math.max(...userScore.scores.normal, 0);
        userScore.highestScore["hard"] = Math.max(...userScore.scores.hard, 0);
        
        //updating and saving modified userScore to allScore
        allScores[storedData.username] = userScore;
        localStorage.setItem('allScores', JSON.stringify(allScores));
    }

    const restart = document.getElementById('restart');
    restart.addEventListener('click', () => window.location.reload());
}

let canSwitch = true;
let switchCooldown = 5000;
const gameFeedback = document.getElementById("game-feedback");

function switchWorld() {
    if (gameOver) return;

    if (!canSwitch) {
        gameFeedback.textContent = "Cannot switch!" + count;
        return;
    }

    isBlackWorld = !isBlackWorld;
    canSwitch = false;
    
    let count = 5;
    gameFeedback.textContent = `Cannot switch! ${count}s`;

    const countDownInterval = setInterval(() => {
        count--;
        if (count <= 0) {
            clearInterval(countDownInterval);
            gameFeedback.textContent = ""; 
        } 
        else {
            gameFeedback.textContent = `Cannot switch! ${count}s`;
        }
    }, 1000);

    setTimeout(() => {
        canSwitch = true;
    }, switchCooldown);

    

    // Track which lanes are occupied by obstacles
    const occupiedLanes = new Set();
    
    // Find all lanes that have obstacles
    for (const obs of obstacles) {
        if (obs instanceof WideRectangle) {
            // For wide rectangles, mark all lanes they cover
            const startLane = Math.floor(obs.x / laneWidth);
            for (let i = 0; i < obs.laneSpan; i++) {
                occupiedLanes.add(startLane + i);
            }
        } else {
            // For regular obstacles, find their lane
            const laneIndex = Math.floor((obs.x + (obs.size || obs.width / 2)) / laneWidth);
            occupiedLanes.add(laneIndex);
        }
    }

    // Get the reference Y position from existing obstacles
    const refY = obstacles.length > 0 ? obstacles[0].y : -70;

    // Find all empty lanes
    const allLanes = [...Array(laneCount).keys()];
    const emptyLanes = allLanes.filter(lane => !occupiedLanes.has(lane));

    // Clear all existing obstacles
    obstacles.length = 0;

    // Decide whether to spawn a wide rectangle or multiple small obstacles
    const spawnWideRectangle = emptyLanes.length >= 2 && Math.random() < 0.3;

    if (spawnWideRectangle) {
        // Spawn a wide rectangle in the empty lanes
        const maxLaneSpan = Math.min(4, emptyLanes.length);
        const laneSpan = getRandomInt(2, maxLaneSpan);
        
        // Find consecutive empty lanes or use available ones
        let startLane = emptyLanes[0];
        
        // Try to find consecutive lanes if possible
        for (let i = 0; i <= emptyLanes.length - laneSpan; i++) {
            let consecutive = true;
            for (let j = 1; j < laneSpan; j++) {
                if (emptyLanes[i + j] !== emptyLanes[i] + j) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) {
                startLane = emptyLanes[i];
                break;
            }
        }
        
        const x = startLane * laneWidth;
        const y = refY;
        const width = laneSpan * laneWidth;
        const height = getRandomInt(40, 70);
        const color = isBlackWorld ? "black" : "red";
        
        const obstacle = new WideRectangle(x, y, width, height, color, laneSpan);
        obstacles.push(obstacle);
        
        lastUsedLanes = [];
        for (let i = 0; i < laneSpan; i++) {
            lastUsedLanes.push(startLane + i);
        }
        
    } else {
        // Spawn regular obstacles in empty lanes
        for (let laneIndex of emptyLanes) {
            const x = laneIndex * laneWidth + (laneWidth / 2);
            const y = refY;
            const color = isBlackWorld ? "black" : "red";
            const shapeType = Math.floor(Math.random() * 2);
            
            let obstacle;

            switch (shapeType) {
                case 0: {
                    const size = getRandomInt(40, 80);
                    obstacle = new Square(x - size / 2, y, size, color);
                    break;
                }
                case 1: {
                    const rectangleWidth = getRandomInt(40, 80);
                    const rectangleHeight = getRandomInt(40, 70);
                    obstacle = new Rectangle(x - rectangleWidth / 2, y, rectangleWidth, rectangleHeight, color);
                    break;
                }
            }

            obstacles.push(obstacle);
        }

        lastUsedLanes = emptyLanes;
    }
}

function StartGame(){
    const gameStartScreen = document.getElementById('game-start-screen');
    gameStartScreen.style.opacity = 1;
    gameStartScreen.style.pointerEvents = 'auto';
}

const playEasy = document.getElementById('play-easy');
const playNormal = document.getElementById('play-normal');
const playHard = document.getElementById('play-hard');

const difficultyButtons = [playEasy, playNormal, playHard];

let difficultyName = "";
difficultyButtons.forEach(difficulty => {
    difficulty.addEventListener('click', () => {
        
        const gameStartScreen = document.getElementById('game-start-screen');
        gameStartScreen.style.opacity = 0;
        gameStartScreen.style.pointerEvents = 'none';
        
    
        if(difficulty === playEasy) {
            gameSpeed = 3;
            difficultyName = 'easy';
        }
        if(difficulty === playNormal) {
            gameSpeed = 5;
            difficultyName = "normal";
        }
        if(difficulty === playHard) {
            gameSpeed = 8;
            difficultyName = "hard";
        }

        Update();
        spawnObstacle();
    });
});


//===RUN GAME===
function Update(){
    if(gameOver) return;

    //erases the previous frame to prepare for a new one
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    //increases score depending on the difficulty
    //every frame calls updateDisplay() so score on screen keeps rising
    myScore.increase(0.01 * gameSpeed); 

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.update(); //move obstacle down

        //if the obstacles y position is greater than the canvas' height remove it from the array
        if (obs.y > canvas.height) {
            obstacles.splice(i, 1); //remove from obstacle array
            continue; //no need to check for collision jump to the next obstacle
        }

        //===PLAYER AND OBSTACLE COLLISION===
        if(
            //left side
            obs.x < player.x + player.width &&
            //right side
            obs.x + (obs.size || obs.width) > player.x &&
            //top side
            obs.y < player.y + player.height &&
            //bottom side
            obs.y + (obs.size || obs.height) > player.y
        ){
            showGameOver();
            return;
        }
    }
    //runs many times per second
    requestAnimationFrame(Update);
}

//===PLAYER MOVEMENT===
document.getElementById('left').addEventListener('click', () => player.move("left"));
document.getElementById('right').addEventListener('click', () => player.move("right"));
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        player.move("left");
    } else if (event.key === 'ArrowRight') {
        player.move("right");
    }
});

document.addEventListener('keydown', (event) => {
    if(event.key === "B" || event.key === "b"){
        switchWorld();
    }
})

window.addEventListener("load", () => {
    myScore.updateDisplay();
    const startScreen = document.getElementById("game-start-screen");
    startScreen.style.opacity = 1;
    startScreen.style.pointerEvents = "auto";
});


