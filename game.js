document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const container = canvas.parentElement;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;


    class Player{
        constructor(x, y, radius, color, speedX){
            this.x = x; 
            this.y = y; 
            this.radius = radius;
            this.color = color;
        }

        draw(){
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
            context.fillStyle = this.color;
            context.fill();
            
        }

        move(direction){
            const step = 20;
            if(direction == "left"){
                this.x -= step;
            }
            if(direction == "right"){
                this.x += step;
            }
            this.update();
        }

        update(){
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.draw();
        }
    }

    const x = canvas.width / 2;
    const y = canvas.height / 1.1;

    const player = new Player(x, y, 30, 'blue', 4);
    player.draw();

    document.getElementById('left').addEventListener('click', () => player.move("left"));
    document.getElementById('right').addEventListener('click', () => player.move("right"));
})