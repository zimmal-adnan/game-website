//Displays and updates player's score
export class Score{
    constructor(){
        this.value = 0; //Tracks current score
        this.element = document.getElementById('score');
    }

    //Increases the score by a specified amount and updates the display
    increase(amount) {
        this.value += amount; 
        this.updateDisplay(); 
    }

    //Updates score display with the current score
    updateDisplay() {
        this.element.textContent = "Score: " + Math.floor(this.value);
    }

    //Reset score to zero
    reset(){
        this.value = 0;
        this.updateDisplay();
    }

    //Retrieves the final score after game over
    getFinalScore() {
        return Math.floor(this.value);
    }

    //Create a new Score instance
    static createScore(){
        return new Score();
    }  
}
