//===CANVAS SETUP===
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d'); //tells the browser will be drawing in 2d mode
const container = canvas.parentElement;

canvas.width = container.clientWidth; //width and height based on parent container's dimensions
canvas.height = container.clientHeight;

let gameOver = false;



//remembers which lanes obstacles last appeared in
let lastUsedLanes = [];

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

class Circle extends Obstacle {
    constructor(x, y, radius, color) {
        super(x, y, color);
        this.radius = radius;
    }


    draw() {
        context.beginPath();
        context.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Triangle extends Obstacle {
    constructor(x, y, size, color) {
        super(x, y, color);
        this.size = size;
    }

    draw() {
        context.beginPath();
        context.moveTo(this.x + this.size / 2, this.y);
        context.lineTo(this.x, this.y + this.size);
        context.lineTo(this.x + this.size, this.y + this.size);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }
}


//===SPAWNING OBSTACLES===
function getRandomInt(min, max){
    //generates random integer
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//make sure obstacles appear in a lane and not in a random position
function spawnObstacle(){
    if(gameOver) return; //freezes obstacles when game is over

    const obstacleNumber = getRandomInt(1, 4); //randomly picks how many obstacles to spawn
    
    const usedLanes = new Set(); //Set ensures each obstacle spawns in a different lane
    

    for (let i = 0; i < obstacleNumber; i++){        
        let laneIndex; //random number between 0 to 4
        
        //this will happen at least once
        do {
            //pick 0 to 4
            laneIndex = Math.floor(Math.random() * laneCount);
        } 
        //returns true if laneIndex is already in the usedLanes Set
        //keep trying is lane is already used
        while (usedLanes.has(laneIndex)); 
        usedLanes.add(laneIndex); //mark used lane as used

        //spawns in the horizontal center of the lane
        const x = laneIndex * laneWidth + (laneWidth / 2);
        const y = -70; 
        const color = isBlackWorld ? "black" : ["red", "green", "yellow", "purple"][Math.floor(Math.random() * 4)];

        
        //Pick a random obstacle to spawn
        const shapeType = Math.floor(Math.random() * 4);
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
            case 2:
                const radius = getRandomInt(10, 30);
                obstacle = new Circle(x - radius, y, radius, color);
                break;
            case 3:
                const triangleSize = getRandomInt(30, 60);
                obstacle = new Triangle(x - triangleSize / 2, y, triangleSize, color);
                break;
        }
        obstacles.push(obstacle); 
    }
    
    //keeps a record for which lanes were just used
    lastUsedLanes = Array.from(usedLanes);
    
    //spawn next object at random times
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
    
    const storedData = JSON.parse(localStorage.getItem('userData'));

    if(storedData && storedData.isLoggedIn === true){
        
        let userScore = JSON.parse(localStorage.getItem('userScore')) || {
            username: storedData.username,
            scores: scores,
            highestScore: highestScore
        };

        userScore.scores[difficultyName].push(finalScoreValue);

        userScore.highestScore["easy"] = Math.max(...userScore.scores.easy, 0);
        userScore.highestScore["normal"] = Math.max(...userScore.scores.normal, 0);
        userScore.highestScore["hard"] = Math.max(...userScore.scores.hard, 0);
        
        localStorage.setItem('userScore', JSON.stringify(userScore));
    }

    const restart = document.getElementById('restart');
    restart.addEventListener('click', () => window.location.reload());
}



//toggle world switching
function switchWorld() {
    if (gameOver) return; //stops the function (cannot switch)

    //toggles the world state
    isBlackWorld = !isBlackWorld;

    //dictionary: key => lane index & value => obstacle in that lane
    const laneObstacles = {};
    
    //starts a loop for every existing obstacle on screen
    for (const obs of obstacles) {
        //finds out which lane the obstacle belongs to
        const laneIndex = Math.floor((obs.x + (obs.size || obs.width || obs.radius * 2) / 2) / laneWidth);
        
        //if no obstacle in that lane or if the obstacle's vertical position is lower on screen
        if (!laneObstacles[laneIndex] || obs.y > laneObstacles[laneIndex].y) {
            //store the current obstacle as the most relevant one for that lane
            laneObstacles[laneIndex] = obs; 
        }
    }

    //gets an array of all the lane numbers and converts them from strings to integers
    const usedLanes = Object.keys(laneObstacles).map(n => parseInt(n));

    //creates an array of all the lane indices
    const allLanes = [...Array(laneCount).keys()];

    //stores lanes that are unused
    const unusedLanes = allLanes.filter(lane => !usedLanes.includes(lane));

    //gives an array of the obstacles stored and checks if there is at least one obstacle
    //if there are obstacles, use the Y position of the first osbtacle
    //if no obstacles, use -70
    const refY = Object.values(laneObstacles).length > 0 ? Object.values(laneObstacles)[0].y : -70;

    //clears all existing obstacles from the screen and resets it
    obstacles.length = 0;

    //spawning new obstacles in empty lanes
    for (let laneIndex of unusedLanes) {
        const x = laneIndex * laneWidth + (laneWidth / 2);
        const y = refY; 
        const color = isBlackWorld ? "black" : "red"; 
        const shapeType = Math.floor(Math.random() * 4);
        
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
            case 2: {
                const radius = getRandomInt(10, 30);
                obstacle = new Circle(x - radius, y, radius, color);
                break;
            }
            case 3: {
                const triangleSize = getRandomInt(30, 60);
                obstacle = new Triangle(x - triangleSize / 2, y, triangleSize, color);
                break;
            }
        }

        obstacles.push(obstacle);
    }

    //stores which lanes were just used for the next world switch
    lastUsedLanes = unusedLanes;
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

    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    //increases score depending on the difficulty
    //every frame calls updateDisplay() so score on screen keeps rising
    myScore.increase(0.01 * gameSpeed); 

    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.update();

        if (obs.y > canvas.height) {
            obstacles.splice(i, 1);
            continue;
        }

        //===PLAYER AND OBSTACLE COLLISION===
        if(
            obs.x < player.x + player.width &&
            obs.x + (obs.size || obs.width || obs.radius * 2) > player.x &&
            obs.y < player.y + player.height &&
            obs.y + (obs.size || obs.height || obs.radius * 2) > player.y
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
    if(event.key === "b"){
        switchWorld()
    }
})

window.addEventListener("load", () => {
    myScore.updateDisplay();
    const startScreen = document.getElementById("game-start-screen");
    startScreen.style.opacity = 1;
    startScreen.style.pointerEvents = "auto";
});


