//Base class for game obstacles
export class Obstacle{
    constructor(context, x, y, colour, gameSpeed){
        this.context = context;
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.velocityY = gameSpeed; //speed at which obstacles move downwards
    }

    //Updates the obstacle's position and redraws it on the canvas
    update(){
        this.y += this.velocityY; 
        this.draw();
    }
}

//A square obstacle that inherits from the base Obstacle class
export class Square extends Obstacle{
    constructor(context, x, y, size, colour, gameSpeed){
        super(context, x, y, colour, gameSpeed); //reuse setup logic from Obstacle
        this.size = size; 
    }

    //Draws the square on the canvas with the specified colour and size
    draw() {
        this.context.fillStyle = this.colour;
        this.context.fillRect(this.x, this.y, this.size, this.size);
    }
}

//A rectangular obstacle extending the base Obstacle class
export class Rectangle extends Obstacle {
    constructor(context, x, y, width, height, colour, gameSpeed) {
        super(context, x, y, colour, gameSpeed);
        this.width = width;
        this.height = height;
    }

    //Draws the rectangle on the canvas with the specified colour, width and height
    draw() {
        this.context.fillStyle = this.colour;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }
}

//A wide rectangle that spans multiple lanes
export class WideRectangle extends Obstacle {
    constructor(context, x, y, width, height, colour, laneSpan, gameSpeed) {
        super(context, x, y, colour, gameSpeed);
        this.width = width;
        this.height = height;
        this.laneSpan = laneSpan; //the number of lanes the rectangle takes up
    }

    //Draws the rectangle on the canvas with the specified colour, width and height
    draw() {
        this.context.fillStyle = this.colour;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }
}

//A rotating square obstacle that extends the base Obstacle class
export class RotatingSquare extends Obstacle {
    constructor(context, x, y, size, colour, gameSpeed) {
        super(context, x, y, colour, gameSpeed);
        this.size = size;
        this.rotation = 0; //initial rotation angle in radians
        this.rotationSpeed = 0.05; //speed at which the square rotates every frame
    }

    //Updates the square's position and rotation and redraws it
    update() {
        this.y += this.velocityY;
        this.rotation += this.rotationSpeed; //increases rotation angle by rotation speed
        this.draw();
       
    }

    draw() {
        this.context.save();
        this.context.translate(this.x + this.size / 2, this.y + this.size / 2); //square rotates around its center
        this.context.rotate(this.rotation); //apply rotation transformation to the drawing
        this.context.fillStyle = this.colour;
        this.context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        this.context.restore(); //future canvas drawings won't be rotated

    }
}

