
//===PLAYER===
export class Player{
    constructor(context, x, y, width, height, colour){
        this.context = context;
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height;
        this.colour = colour;
    }

    draw(){
        this.context.fillStyle = this.colour;
        this.context.fillRect(this.x, this.y, this.width, this.height); 
    }

    move(direction){
        const step = this.context.canvas.width * 0.10;
        if(direction === "left" && this.x - step >= 0){
            this.x -= step; //moves player's x position 20% of the canvas's width
        }
        if(direction === "right" && this.x + this.width + step <= this.context.canvas.width){
            this.x += step;
        }
    }

    static createPlayer(canvas){
        const playerWidth = 40;
        const playerHeight = 40;
        const x = (canvas.element.width / 2) - (playerWidth / 2);
        const y = canvas.element.height * 0.85;
        return new Player(canvas.context, x, y, playerWidth, playerHeight, 'blue');
    }
}