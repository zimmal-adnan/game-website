document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const container = canvas.parentElement;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    let gameOver = false;

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

    document.getElementById('left').addEventListener('click', () => player.move("left"));
    document.getElementById('right').addEventListener('click', () => player.move("right"));

    let gameSpeed = 3;
    const obstacles = [];
    const laneCount = 5;
    const laneWidth = canvas.width / laneCount;
    let spawnTimer = 100;

    class Obstacle{
        constructor(x, y, width, height, color){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.velocityY = gameSpeed;
        }

        update(){
            this.y += this.velocityY;
            this.draw();
        }

        draw(){
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height); 
        }    
    }

    function RandomIntInRange(min, max){
        return Math.round(Math.random() * (max - min) + min);
    }

    function spawnObstacle(){
        const laneIndex = Math.floor(Math.random() * laneCount);
        let size = RandomIntInRange(40, 70);
        const x = laneIndex * laneWidth + (laneWidth / 2) - (size / 2);
        const y = -size;
        const color = "red";
        let obstacle =  new Obstacle(x, y, size, size, color);
        obstacles.push(obstacle); 
    }
    
    function checkCollision(rect1, rect2){
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }
    
    function showGameOver(){
        if(gameOver) return;
        gameOver = true;

        const gameOverScreen = document.getElementById('game-over-screen');
        gameOverScreen.style.opacity = 1;
        gameOverScreen.style.pointerEvents = 'auto';
    }

   

    function Update(){
        if(gameOver) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        player.draw();

        
        spawnTimer--; 
        if(spawnTimer <= 0){
            spawnObstacle();
            spawnTimer = 100;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            obs.update();
            if (obs.y > canvas.height) {
                obstacles.splice(i, 1);
                continue;
            }

            if(checkCollision(obs, player)){
                showGameOver();
                return;
            }
        }
        requestAnimationFrame(Update);
    }
    
    Update();
    
    document.getElementById('restart').addEventListener('click', () => {
        window.location.reload();
    });
});

