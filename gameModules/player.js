/*References:
1. Circle on canvas: https://www.youtube.com/watch?v=9jmqhzQHtUo
*/

//Creates the player on the canvas
export class Player{
    constructor(context, x, y, width, height, profilePictureSrc){
        this.context = context; //Canvas context used for drawing
        
        //Player position and size
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height;

        //Load and store player's profile picture
        this.profilePicture = new Image();
        this.profilePicture.src = profilePictureSrc;
    }


    //Draw player's circular profile picture on the canvas
    /*Reference (1)*/
    draw(){
        this.context.save();

        const radius = Math.min(this.width, this.height) / 2;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        //Circular clipping path for a round image
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.context.clip();

        //Player's profile picture inside circular area
        this.context.drawImage(this.profilePicture, this.x, this.y, this.width, this.height);

        //Restore canvas context to remove clipping
        this.context.restore();

        //Black circular border
        this.context.lineWidth = 2; 
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.context.stroke();

    }

    //Moves character left or right across lanes based on input
    move(direction){
        //Move 20% of the canvas width
        const step = this.context.canvas.width * 0.20;

        if(direction === "left" && this.x - step >= 0){
            this.x -= step; 
        }
        if(direction === "right" && this.x + this.width + step <= this.context.canvas.width){
            this.x += step;
        }
    }

    //Creates a Player Instance dynamically based on logged-in user's data
    static createPlayer(canvas){
        const playerWidth = 50;
        const playerHeight = 50;

        //Character centered horizontally
        const x = (canvas.element.width / 2) - (playerWidth / 2);
        //Character close to the bottom of the canvas
        const y = canvas.element.height * 0.85;

        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
        const storedData = currentUser ? allUsers[currentUser.username] : null;

        const profilePictureSrc = (storedData && storedData.profilePicture) ? storedData.profilePicture : '../Images/profile.jpg';

        return new Player(canvas.context, x, y, playerWidth, playerHeight, profilePictureSrc);
    }
}