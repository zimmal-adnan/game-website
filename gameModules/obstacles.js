
export class Obstacle{
    constructor(context, x, y, colour, gameSpeed){
        this.context = context;
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.velocityY = gameSpeed;
    }

    
    update(){
        this.y += this.velocityY; 
        this.draw();
    }

    draw(){

    }
}

//each shape simply defines the size and how to draw it on the canvas
export class Square extends Obstacle{
    constructor(context, x, y, size, colour, gameSpeed){
        super(context, x, y, colour, gameSpeed);
        this.size = size;
    }

    draw() {
        this.context.fillStyle = this.colour;
        this.context.fillRect(this.x, this.y, this.size, this.size);
    }
}

export class Rectangle extends Obstacle {
    constructor(context, x, y, width, height, colour, gameSpeed) {
        super(context, x, y, colour, gameSpeed);
        this.width = width;
        this.height = height;
    }

    draw() {
        this.context.fillStyle = this.colour;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }
}

export class WideRectangle extends Obstacle {
    constructor(context, x, y, width, height, colour, laneSpan, gameSpeed) {
        super(context, x, y, colour, gameSpeed);
        this.width = width;
        this.height = height;
        this.laneSpan = laneSpan;
    }

    draw() {
        this.context.fillStyle = this.colour;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }
}

// ===ROTATING SQUARE===
export class RotatingSquare extends Obstacle {
    constructor(context, x, y, size, colour, gameSpeed) {
        super(context, x, y, colour, gameSpeed);
        this.size = size;
        this.rotation = 0;
        this.rotationSpeed = 0.05;
    }

    update() {
        this.y += this.velocityY;
        this.rotation += this.rotationSpeed; 
        this.draw();
       
    }

    draw() {
        this.context.save();
        this.context.translate(this.x + this.size / 2, this.y + this.size / 2);
        this.context.rotate(this.rotation);
        this.context.fillStyle = this.colour;
        this.context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        this.context.restore();

    }
}

