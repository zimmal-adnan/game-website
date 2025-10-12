document.addEventListener("DOMContentLoaded", () => {
    
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const container = canvas.parentElement;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    let gameOver = false;

    //===PLAYER===
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
            context.fillRect(this.x, this.y, this.width, this.height); 
            
        }

        move(direction){
            const step = canvas.width * 0.20;
            if(direction === "left" && this.x - step >= 0){
                this.x -= step;
            }
            if(direction === "right" && this.x + this.width + step <= canvas.width){
                this.x += step;
            }
        }
    }

    const playerWidth = 40;
    const playerHeight = 40;
    const x = (canvas.width / 2) - (playerWidth / 2);
    const y = canvas.height * 0.85;
    const player = new Player(x, y, playerWidth, playerHeight, 'blue');


    //===OBSTACLES===
    let gameSpeed = 4;
    const obstacles = [];
    const laneCount = 5;
    const laneWidth = canvas.width / laneCount;

    class Obstacle{
        constructor(x, y, color){
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocityY = gameSpeed;
        }

        update(){
            this.y += this.velocityY;
            this.draw();
        }
    }

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
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function spawnObstacle(){
        if(gameOver) return;

        const count = getRandomInt(1, 4);
        const usedLanes = new Set();
        for (let i = 0; i < count; i++){        
            let laneIndex;
            do {
                laneIndex = Math.floor(Math.random() * laneCount);
            } while (usedLanes.has(laneIndex));
            usedLanes.add(laneIndex);
            const x = laneIndex * laneWidth + (laneWidth / 2);
            const y = -70;
            const color = ["red", "green", "yellow", "purple"][Math.floor(Math.random() * 4)];
            
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
       
        
        //spawn next object at random times
        const nextSpawnDelay = getRandomInt(400, 800);
        setTimeout(spawnObstacle, nextSpawnDelay);
    }

    //===GAME OVER SCREEN===
    function showGameOver(){
        if(gameOver) return;
        gameOver = true;
        

        const gameOverScreen = document.getElementById('game-over-screen');
        gameOverScreen.style.opacity = 1;
        gameOverScreen.style.pointerEvents = 'auto';
    }
    //===RESTART GAME===
    document.getElementById('restart').addEventListener('click', () => window.location.reload());

    
    //===RUN GAME===
    function Update(){
        if(gameOver) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        player.draw();


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
    
    Update();
    spawnObstacle();

});

