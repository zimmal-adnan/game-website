document.addEventListener("DOMContentLoaded", () => { //waits for the HTML document to be fully loaded before running
    const numberOfCircles = 20;
    const body = document.body
    
    for(let i = 0; i < numberOfCircles; i++){
        const circle = document.createElement("div")
        circle.classList.add('circle');

        const circleSize = Math.floor(Math.random() * 20) + 30;
        circle.style.width = `${circleSize}px`;
        circle.style.height = `${circleSize}px`;

        let left;
        if(Math.random() < 0.5){
            left = Math.random() * -20 + 15;
        }
        else{
            left = Math.random() * 25 + 75;
        }
        circle.style.left = `${left}%`;

        const duration = Math.random() * 10 + 10;
        circle.style.animationDuration = `${duration}s`;

        const delay = Math.random() * 5; 
        circle.style.animationDelay = `${delay}s`;

        body.appendChild(circle);


    }

    const ribbon =  document.getElementById("ribbon")
    const instructionBox = document.getElementById("instruction-box")

    let isDragging = false;
    let initialMouseX = 0; //saves where your mouse is (horizontally) when you start pulling
    let currentTranslateX = 0; //keeps track of how the ribbon and box have moved (starts at 0)
    let lastTranslateX = 0; //stores the ribbon's last position when the user lets go

    ribbon.addEventListener("mousedown", (e) => { //waits for the user to click and hold the mouse on the ribbon
        isDragging = true;
        initialMouseX = e.clientX - lastTranslateX; //saves the spot where your mouse is when you start dragging (in pixels)
        
        ribbon.style.transition = "none";
        instructionBox.style.transition = "none";

        ribbon.style.cursor = "grabbing";

        document.addEventListener("mousemove", handleDrag); //watches where the mouse moves while pulling
        document.addEventListener("mouseup", stopDrag); //watches for when the user lets go of the mouse
        e.preventDefault();//stops the browser from selecting text when pulling
    })

    //runs every time the mouse is moved while holding it
    function handleDrag(e) {
        if(!isDragging) return;

        const currentMouseX =  e.clientX; //gets where the mouse is while pulling in pixels
        const deltaX = currentMouseX - initialMouseX; //figures out how far you have pulled the ribbon to the left
       

        if(deltaX < -400){ //if mouse moves than 400px to the left
            currentTranslateX = -400;
        }
        else if (deltaX > 0) { //if mouse moves too far to the right
            currentTranslateX = 0;     
        } 
        else { //otherwise follow the mouse
            currentTranslateX = deltaX;
        }
       
        ribbon.style.transform = `translateX(${currentTranslateX}px)`;
        instructionBox.style.transform = `translateX(${currentTranslateX}px)`;
        
        
    }

    function stopDrag(){
        isDragging = false;
        lastTranslateX = currentTranslateX;
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);
        ribbon.style.cursor = "grab";
        ribbon.style.transition = "transform 0.3s ease"; 
        instructionBox.style.transition = "transform 0.3s ease"; 
    }

})


