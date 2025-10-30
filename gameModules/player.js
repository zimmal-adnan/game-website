
//===PLAYER===
export class Player{
    constructor(context, x, y, width, height, profilePictureSrc){
        this.context = context;
        this.x = x; 
        this.y = y; 
        this.width = width;
        this.height = height;
        this.profilePicture = new Image();
        this.profilePicture.src = profilePictureSrc;


    }

    draw(){
        this.context.save();

        const radius = Math.min(this.width, this.height) / 2;
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.context.clip();

        this.context.drawImage(this.profilePicture, this.x, this.y, this.width, this.height);

        this.context.restore();
        this.context.lineWidth = 2; 
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.context.stroke();

    }

    move(direction){
        const step = this.context.canvas.width * 0.20;
        if(direction === "left" && this.x - step >= 0){
            this.x -= step; //moves player's x position 20% of the canvas's width
        }
        if(direction === "right" && this.x + this.width + step <= this.context.canvas.width){
            this.x += step;
        }
    }

    static createPlayer(canvas){
        const playerWidth = 50;
        const playerHeight = 50;
        const x = (canvas.element.width / 2) - (playerWidth / 2);
        const y = canvas.element.height * 0.85;

        let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
        const storedData = currentUser ? allUsers[currentUser.username] : null;

        const profilePictureSrc = (storedData && storedData.profilePicture) ? storedData.profilePicture : '../Images/profile.jpg';

        return new Player(canvas.context, x, y, playerWidth, playerHeight, profilePictureSrc);
    }
}