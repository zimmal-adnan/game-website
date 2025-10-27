//===CANVAS SETUP===
export class Canvas{
    constructor(){
        this.element = document.getElementById('canvas');
        this.context = this.element.getContext('2d');
        const container = this.element.parentElement;

        this.element.width = container.clientWidth;
        this.element.height = container.clientHeight;
    
    }

    clear() {
        this.context.clearRect(0, 0, this.element.width, this.element.height);
    }
}

export class RandomInteger{
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


