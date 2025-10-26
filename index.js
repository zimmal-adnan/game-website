if(window.location.pathname.includes("index.html")){
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


}}

const ribbon =  document.getElementById("ribbon")
const instructionBox = document.getElementById("instruction-box")

let isDragging = false;
let initialMouseX = 0; //saves where your mouse is (horizontally) when you start pulling
let currentTranslateX = 0; //keeps track of how the ribbon and box have moved (starts at 0)
let lastTranslateX = 0; //stores the ribbon's last position when the user lets go

if(ribbon && instructionBox){
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
    

        if(deltaX < -500){ //if mouse moves than 400px to the left
            currentTranslateX = -500;
        }
        else if (deltaX > 0) { //if mouse moves too far to the right
            currentTranslateX = 0;     
        } 
        else { //otherwise follow the mouse
            currentTranslateX = deltaX;
        }
    
        ribbon.style.transform = `translateX(${currentTranslateX}px)`;
        instructionBox.style.transform = `translateX(${currentTranslateX}px)`;
        
        
    };

    function stopDrag(){
        isDragging = false;
        lastTranslateX = currentTranslateX;
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);
        ribbon.style.cursor = "grab";
        ribbon.style.transition = "transform 0.3s ease"; 
        instructionBox.style.transition = "transform 0.3s ease"; 
    };
};




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
});

const linksAndButtons = document.querySelectorAll('a, button');

linksAndButtons.forEach(element =>{
    element.style.cursor = 'none';
});

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


const currentUser = JSON.parse(localStorage.getItem('currentUser'));
const allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
const storedData = currentUser ? allUsers[currentUser.username] : null;

const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const userElement = document.getElementById('user');
const userProfilePicture = document.getElementById('user-profile');

const logOut = document.getElementById('log-out');
const logOutDropDown = document.getElementById('logout-dropdown');
const logOutButton = document.getElementById("logout-dropdown-button");

const callToAction = document.getElementById('call-to-action');

if(storedData && storedData.isLoggedIn === true){
    if(callToAction){
        callToAction.style.opacity = '0';
    }
    if(loginButton){
        loginButton.style.opacity = '0';
        loginButton.style.pointerEvents = 'none';
    }
    if(signupButton){
        signupButton.style.opacity = '0';
        signupButton.style.pointerEvents = 'none';
    }

    if(userElement){
        userElement.textContent = storedData.username;
        userElement.style.opacity = '1';
    }
    if(userProfilePicture){
        userProfilePicture.src = storedData.profilePicture || '../Images/profile.jpg';
        userProfilePicture.style.opacity = '1';
    }
    if(logOut){
        logOut.style.opacity = '1';
        logOut.addEventListener('mouseover', () => {
            logOutButton.style.opacity = '1';
            logOutDropDown.style.opacity = '1';
        })
    }
}
else{
    if(callToAction){
        callToAction.style.opacity = '1';
    }
    if(loginButton){
        loginButton.style.opacity = '1';
        loginButton.style.pointerEvents = 'auto';
    }
    if(signupButton){
        signupButton.style.opacity = '1';
        signupButton.style.pointerEvents = 'auto';
    }
    
    if(userElement){
        userElement.style.opacity = '0';
    }
    if(userProfilePicture){
        userProfilePicture.style.opacity = '0';
    }
    if(logOut){
        logOut.style.opacity = '0';
        logOutDropDown.style.opacity = '0';
        logOutButton.style.opacity = '0';
    }
}

if(logOutButton){
    logOutButton.addEventListener('click', (e) => {
        e.stopPropagation();
        logOutDropDown.classList.toggle("show");

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let allUsers = JSON.parse(localStorage.getItem('allUsers'));
        
        if(currentUser && allUsers[currentUser.username]){
            allUsers[currentUser.username].isLoggedIn = false;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            localStorage.removeItem('currentUser');
            window.location.reload();
        }
    });
}




if (logOut && logOutDropDown && logOutButton) {
    const showBox = () => {
        logOutDropDown.style.opacity = '1';
        logOutDropDown.style.visibility = 'visible';
    };

    const hideBox = () => {
        logOutDropDown.style.opacity = '0';
        logOutDropDown.style.visibility = 'hidden';
    };

    logOut.addEventListener('mouseenter', showBox);
    logOutDropDown.addEventListener('mouseenter', showBox);
    logOutButton.addEventListener('mouseenter', showBox);

    logOut.addEventListener('mouseleave', hideBox);
    logOutDropDown.addEventListener('mouseleave', hideBox);
    logOutButton.addEventListener('mouseleave', hideBox);
}

const playButton = document.getElementById('play-button');
const loginPopup = document.getElementById("login-popup");
const gameNavLink = document.getElementById("game-navigation-link");
const gradientBorder = document.getElementById("gradient-border");


if(!storedData || storedData.isLoggedIn === false){
    if(playButton && gradientBorder){
        const playButtonLink = document.getElementById("play-button-link");
        const arrows = document.getElementById("arrows");

        gradientBorder.style.opacity = '0.65';
        playButton.style.transform = 'none';
        playButton.style.color = 'grey';
        playButtonLink.style.left = '-10px';

        playButtonLink.removeAttribute('href');
        if (arrows) {
            arrows.remove(); 
        }

        playButton.addEventListener('mouseenter', () => {
            if (loginPopup) {
                loginPopup.style.opacity = '1';
                loginPopup.style.visibility = 'visible';
            }
        });

        playButton.addEventListener('mouseleave', () => {
            if (loginPopup) {
                loginPopup.style.opacity = '0';
                loginPopup.style.visibility = 'hidden';
            }
        }); 
    }

    if (gameNavLink) {
        gameNavLink.style.pointerEvents = 'none';
        gameNavLink.style.opacity = '0.7';
        gameNavLink.style.color = 'grey';
    }
}
else if (storedData && storedData.isLoggedIn === true){
    if(playButton && gradientBorder){
        playButton.addEventListener('mouseenter', () => {
            gradientBorder.style.padding = '4px';
            playButton.style.textIndent = '-3rem';
            playButton.style.width = '16rem';
        })
        playButton.addEventListener('mouseleave', () => {
            gradientBorder.style.padding = '2.5px';
            playButton.style.textIndent = '0';
            playButton.style.width = '14rem';
        })
    }
}
