
export class Score{
    constructor(){
        this.value = 0;
        this.element = document.getElementById('score');
    }

    increase(amount) {
        this.value += amount; 
        this.updateDisplay(); 
    }

    updateDisplay() {
        this.element.textContent = "Score: " + Math.floor(this.value);
    }

    reset(){
        this.value = 0;
        this.updateDisplay();
    }

    getFinalScore() {
        return Math.floor(this.value);
    }

    static createScore(){
        return new Score();
    }  
}
