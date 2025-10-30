import { Square, Rectangle, WideRectangle } from './obstacles.js';
import { RandomInteger } from './canvas.js';

//Handles world switching and spawning inverted obstacles
export class SwitchWorld{
    constructor(game){
        this.game = game;
        this.laneCount = 5;
        this.laneWidth = game.canvas.element.width / this.laneCount;
        this.canSwitch = true; //Control world switching 
        this.switchCooldown = 5000;
        this.gameFeedback = document.getElementById("game-feedback");
        this.gameOverText = document.getElementById("gameOverText");
    }

    //Handles world switching logic
    worldSwitch(){
        if (this.game.gameOver) return;

        if (!this.canSwitch) {
            return;
        }

        this.game.isBlackWorld = !this.game.isBlackWorld;
        this.canSwitch = false;

        //Update canvas background based on world state
        this.game.canvas.element.style.backgroundColor = this.game.isBlackWorld ? "black" : "white";

        //Adjust text and border colours in different worlds
        if (this.game.isBlackWorld) {
            this.gameOverText.style.color = "white";
            this.gameOverText.style.textShadow = "0 5px 8px rgba(255, 255, 255, 0.5)";
            this.gameFeedback.style.color = "white";
            this.gameFeedback.style.borderColor = "white";
        } 
        else {
            this.gameOverText.style.color = "black";
            this.gameFeedback.style.color = "black";
            this.gameFeedback.style.borderColor = "white"; // optional: border contrast
        }

        //Start cooldown
        this.startSwitchCooldown();

        //Invert obstacles
        this.invertObstacles();
    }
    
    //Manage cooldown timer for world switching
    startSwitchCooldown(){
        let count = 5;
        const feedback = this.gameFeedback;

        feedback.classList.add('show');
        feedback.textContent = `Switch cooldown: ${count}s`;

        //Update countdown every second
        const countDownInterval = setInterval(() => {
            count--;
            if (count <= 0) {
                clearInterval(countDownInterval);

                //Hide feedback with a slight delay for transition
                feedback.classList.remove('show');
                setTimeout(() => {
                    feedback.textContent = "";
                }, 300);
            } 
            else {
                feedback.textContent = `Switch cooldown: ${count}s`;
            }
        }, 1000);

        //Enable switching after countdown
        setTimeout(() => {
            this.canSwitch = true;
        }, this.switchCooldown);
    }

    //Handles inverted obstacles by replacing existing ones with new ones in unused lanes
    invertObstacles(){
        const usedLanes = new Set();
        const laneObstacles = {}; //Store lowest obstacle per lane
        let hasWideRectangle = false;
        
        //Check each obstacle in the current falling obstacles
        for (const obs of this.game.obstacles) {
            if (obs instanceof WideRectangle) {
                hasWideRectangle = true; 
                const startLane = Math.floor(obs.x / this.laneWidth);
                
                //Mark all lanes spanned by the wide rectangle as used
                for (let i = 0; i < obs.laneSpan; i++) {
                    usedLanes.add(startLane + i);

                    //Keep track of the lowest obstacle on the canvas
                    if (!laneObstacles[startLane + i] || obs.y > laneObstacles[startLane + i].y) {
                        laneObstacles[startLane + i] = obs;
                    }
                }
            } 
            else {
                //Calculate lane for regular obstacles based on center point 
                const laneIndex = Math.floor((obs.x + (obs.size || obs.width / 2)) / this.laneWidth);
                usedLanes.add(laneIndex);
                if (!laneObstacles[laneIndex] || obs.y > laneObstacles[laneIndex].y) {
                    laneObstacles[laneIndex] = obs;
                }
            }
        }

    
        let refY = -70;

        //Set refY to the lowest obstacle's Y value
        if (Object.keys(laneObstacles).length > 0) {
            refY = Math.max(...Object.values(laneObstacles).map(o => o.y));
        }

        //Identify unused lanes with no obstacles
        const allLanes = [...Array(this.laneCount).keys()];
        const unusedLanes = allLanes.filter(lane => !usedLanes.has(lane));

        //Clear old obstacles
        this.game.obstacles.length = 0;

        //30% chance to spawn a wide rectangle if conditions are met
        const spawnWideRectangle = !hasWideRectangle && unusedLanes.length >= 2 && Math.random() < 0.3;
        
        //Spawn new inverted obstacles based on condition
        if (spawnWideRectangle) {   
            this.spawnInvertWideRectangle(unusedLanes, refY);
        } 
        else {
            this.spawnInvertRegularObstacles(unusedLanes, refY);
        }
    }

    //Spawn a wide rectangle in unused lanes
    spawnInvertWideRectangle(unusedLanes, refY){
        const maxLaneSpan = Math.min(4, unusedLanes.length); //Maximum number of lanes the wide rectangle can span
        const laneSpan = RandomInteger.getRandomInt(2, maxLaneSpan);
        
        //Start from the first unused lane
        let startLane = unusedLanes[0];

        //Find consecutive unused lanes for the wide rectangle
        for (let i = 0; i <= unusedLanes.length - laneSpan; i++) { //Find every unused lane
            let consecutive = true;


            for (let j = 1; j < laneSpan; j++) {

                //If no consecutive unused lanes move to the next i
                if (unusedLanes[i + j] !== unusedLanes[i] + j) {
                    consecutive = false;
                    break;
                }
            }
            if (consecutive) {
                startLane = unusedLanes[i];
                break;
            }
        }
        
        const x = startLane * this.laneWidth;
        const width = laneSpan * this.laneWidth;
        const height = RandomInteger.getRandomInt(40, 70);
        const colour = this.game.isBlackWorld ? "white" : "black";
        
        
        const obstacle = new WideRectangle(this.game.canvas.context, x, refY, width, height, colour, laneSpan, this.game.gameSpeed);
        this.game.obstacles.push(obstacle);
        
        //Tracj used lanes
        this.lastUsedLanes = [];
        for (let i = 0; i < laneSpan; i++) {
            this.lastUsedLanes.push(startLane + i);
        }
    }

    //Spawn regular obstacles in unused lanes
    spawnInvertRegularObstacles(unusedLanes, refY){
        for (let laneIndex of unusedLanes) {
            const x = laneIndex * this.laneWidth + (this.laneWidth / 2); //center in lane
            const colour = this.game.isBlackWorld ? "white" : "black";
            const shapeType = Math.floor(Math.random() * 3);
            
            let obstacle;

            if (shapeType === 0) {
                const size = RandomInteger.getRandomInt(40, 80);
                obstacle = new Square(this.game.canvas.context, x - size / 2, refY, size, colour, this.game.gameSpeed);
            } 
            else if (shapeType === 1){
                const rectangleWidth = RandomInteger.getRandomInt(40, 80);
                const rectangleHeight = RandomInteger.getRandomInt(40, 70);
                obstacle = new Rectangle(this.game.canvas.context, x - rectangleWidth / 2, refY, rectangleWidth, rectangleHeight, colour, this.game.gameSpeed);
            }
            else if (shapeType === 2) {
                const size = RandomInteger.getRandomInt(40, 80);
                obstacle = new RotatingSquare(this.game.canvas.context, x - size / 2, y, size, colour, this.game.gameSpeed);
            }

            this.game.obstacles.push(obstacle);
        }
    }
}