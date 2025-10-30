//Add floating circles to index.html
if(window.location.pathname.includes("index.html")){
    
    const numberOfCircles = 20;
    const body = document.body


    for(let i = 0; i < numberOfCircles; i++){
        const circle = document.createElement("div")
        circle.classList.add('circle');

        //Randomise circle size
        const circleSize = Math.floor(Math.random() * 20) + 30;
        circle.style.width = `${circleSize}px`;
        circle.style.height = `${circleSize}px`;

        //Position circles on the left and right side of the central white box
        let left;
        if(Math.random() < 0.5){
            left = Math.random() * -20 + 15;
        }
        else{
            left = Math.random() * 25 + 75;
        }
        circle.style.left = `${left}%`;

        //Randomise animation duration
        const duration = Math.random() * 10 + 10;
        circle.style.animationDuration = `${duration}s`;
        
        //Radnomise delay for a floating effect
        const delay = Math.random() * 5; 
        circle.style.animationDelay = `${delay}s`;

        body.appendChild(circle);
    }
}


const ribbon =  document.getElementById("ribbon")
const instructionBox = document.getElementById("instruction-box")

let isDragging = false;
let initialMouseX = 0; //Tracks initial horizontal mouse position when dragging starts
let currentTranslateX = 0; //Tracks horizontal movement of ribbon and box
let lastTranslateX = 0; //Stores the ribbon's last position when the dragging stops


if(ribbon && instructionBox){
    ribbon.addEventListener("mousedown", (e) => { 
        isDragging = true;

        //Saves mouse position is when dragging starts (in pixels)
        initialMouseX = e.clientX - lastTranslateX; 
        
        ribbon.style.cursor = "grabbing";

        //listeners for dragging and stopping
        document.addEventListener("mousemove", handleDrag); 
        document.addEventListener("mouseup", stopDrag); 
        
        //Prevent selecting text when dragging
        e.preventDefault();
    })

    //Handle ribbon dragging
    function handleDrag(e) {
        if(!isDragging) return;

        //Tracks mouse's position while pulling (in pixels)
        const currentMouseX =  e.clientX; 
        
        //Calculate how far mouse has moved to the left
        const deltaX = currentMouseX - initialMouseX; 
    

        //Dragging constraints
        if(deltaX < -500){ 
            currentTranslateX = -500;
        }
        else if (deltaX > 0) { 
            currentTranslateX = 0;     
        } 
        else { 
            //Ribbon and box follow the mouse
            currentTranslateX = deltaX;
        }
    
        ribbon.style.transform = `translateX(${currentTranslateX}px)`;
        instructionBox.style.transform = `translateX(${currentTranslateX}px)`;
    };

    //Save final position when mouse stops dragging
    function stopDrag(){
        isDragging = false;
        lastTranslateX = currentTranslateX;

        //Remove drag listeners
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", stopDrag);
        
        ribbon.style.cursor = "grab";
    };
};


const cursorDot = document.getElementById("cursor-dot");
const cursorOutline = document.getElementById("cursor-outline");

//Custom cursor movement logic when mouse moves
window.addEventListener("mousemove", function(e) {
    const posX = e.clientX;
    const posY = e.clientY;

    //Update inner dot position instantly
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    //Slight delay in follow to the outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, {duration: 500, fill: "forwards"});
});

const linksAndButtons = document.querySelectorAll('a, button');

linksAndButtons.forEach(element =>{
    element.style.cursor = 'none'; //Disable default cursor styles on buttons and links
});


//Custom cursor style when hovering on buttons and links
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


let currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
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

//Hide Login/Signup button when user logs in
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

    //Show username and profile picture
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
        //Show logout dropdown button on hover
        logOut.addEventListener('mouseover', () => {
            logOutButton.style.opacity = '1';
            logOutDropDown.style.opacity = '1';
        })
    }
}
else{
    //Show Login/Signup buttons for unauthenticated users
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
    
    //Hide username and profile picture
    if(userElement){
        userElement.style.opacity = '0';
    }
    if(userProfilePicture){
        userProfilePicture.style.opacity = '0';
    }
    if(logOut){
        logOut.style.opacity = '0';
        logOut.style.pointerEvents = 'none';
        logOutDropDown.style.opacity = '0';
        logOutButton.style.opacity = '0';
    }
}

//Handle logout logic
if(logOutButton){
    logOutButton.addEventListener('click', (e) => {
        
        logOutDropDown.classList.toggle("show");

        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentUser'));
        let allUsers = JSON.parse(localStorage.getItem('allUsers'));
        
        //Remove login status and clear current user
        if(currentUser && allUsers[currentUser.username]){
            allUsers[currentUser.username].isLoggedIn = false;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            
            localStorage.removeItem('currentUser');
            sessionStorage.removeItem('currentUser');
            
            //Refresh to show logged-out state
            window.location.reload();
        }
    });
}



if (logOut && logOutDropDown && logOutButton) {
    //Show logout dropdown on hover
    const showBox = () => {
        logOutDropDown.style.opacity = '1';
        logOutDropDown.style.visibility = 'visible';
    };

    //Hide logout dropdown when mouse leaves
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

//Handle Play Button behaviour for unauthenticated users
if(!storedData || storedData.isLoggedIn === false){
    if(playButton && gradientBorder){
        const playButtonLink = document.getElementById("play-button-link");
        const arrows = document.getElementById("arrows");

        gradientBorder.style.opacity = '0.65';
        playButton.style.transform = 'none';
        playButton.style.color = 'grey';
        playButtonLink.style.left = '-10px';

        //Disable navigation to the game
        playButtonLink.removeAttribute('href');
        if (arrows) {
            arrows.remove(); 
        }

        //Show login popup on hover for unauthenticated users
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

    //Disable game navigation link for unauthenticated users
    if (gameNavLink) {
        gameNavLink.style.pointerEvents = 'none';
        gameNavLink.style.opacity = '0.7';
        gameNavLink.style.color = 'grey';
    }
}

//Handle Play Button behaviour for logged-in users
else if (storedData && storedData.isLoggedIn === true){
    if(playButton && gradientBorder){
        playButton.addEventListener('mouseenter', () => {
            gradientBorder.style.padding = '5px';
            playButton.style.textIndent = '-3rem';
            playButton.style.width = '16rem';
        })
        playButton.addEventListener('mouseleave', () => {
            gradientBorder.style.padding = '4px';
            playButton.style.textIndent = '0';
            playButton.style.width = '14rem';
        })
    }
}
