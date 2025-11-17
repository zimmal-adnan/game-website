//Holds the gameplay
export class Canvas{
    constructor(){
        this.element = document.getElementById('canvas');
        this.context = this.element.getContext('2d'); //making a 2D game

        //Match canvas size to its container
        const container = this.element.parentElement;
        this.element.width = container.clientWidth;
        this.element.height = container.clientHeight;
    
    }

    //Clears the entire canvas for next frame
    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }
}

//Utility class to get a random number
export class RandomInteger{
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


