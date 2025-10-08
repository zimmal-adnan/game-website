const cursorDot = document.getElementById("cursor-dot");
    const cursorOutline = document.getElementById("cursor-outline");

    window.addEventListener("mousemove", function(e) {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;


        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, {duration: 500, fill: "forwards"});
    })

    const linksAndButtons = document.querySelectorAll('a, button');
    
    linksAndButtons.forEach(element =>{
        element.style.cursor = 'none';
    })

    linksAndButtons.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOutline.style.borderColor = 'black';
            cursorOutline.style.transform = 'scale(1.3)';
            cursorDot.style.transform = 'scale(1.3)';
            cursorDot.style.backgroundColor = 'white';
            cursorOutline.style.transition = "all 0.5s ease";
        });

        element.addEventListener('mouseleave', () => {
             cursorDot.style.backgroundColor = 'black';
            cursorOutline.style.borderColor = 'white';
            cursorOutline.style.transform = 'scale(1)';
            cursorDot.style.transform = 'scale(1)';
        });
    });