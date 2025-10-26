const eyeOpen =  document.getElementById("eye-icon");
const eyeClosed =  document.getElementById("eye-slash");
const passwordInput = document.getElementById("password");


eyeClosed.addEventListener("click", () => {
    eyeClosed.style.opacity = "0";
    eyeClosed.style.pointerEvents = "none";
    eyeOpen.style.opacity = "1";
    eyeOpen.style.pointerEvents = "auto";
    passwordInput.type = "text"; 
});

eyeOpen.addEventListener("click", () => {
    eyeOpen.style.opacity = "0";
    eyeOpen.style.pointerEvents = "none";
    eyeClosed.style.opacity = "1";
    eyeClosed.style.pointerEvents = "auto";
    passwordInput.type = "password";
});


const form = document.getElementById('form');
const username = document.getElementById('username');
const password = document.getElementById('password');
const passwordAgain = document.getElementById('passwordAgain');
const email = document.getElementById('email');
const birthdate = document.getElementById('date');
const termsCheckbox = document.getElementById('terms-checkbox');
const termsContainer = document.getElementById('terms-container');
const feedback = document.getElementById('feedback');

const submitButton =  document.getElementById('submit-button');

let isValid = false;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let errors = [];

    if(email){
        errors = getSignUpFormErrors(username.value, password.value, passwordAgain.value, email.value, birthdate.value);
        
        if (errors.length === 0) {
            buttonCorrectAnimation(true);
            const userData = {
                username: username.value.trim(),
                email: email.value.trim(),
                password: password.value.trim(),
                birthdate: birthdate.value,
                profilePicture: localStorage.getItem('profileImage') || '../Images/profile.jpg',
                isLoggedIn: true
            };

            let allUsers = JSON.parse(localStorage.getItem('allUsers'));
            allUsers[userData.username] = userData;

            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            localStorage.setItem('currentUser', JSON.stringify({username: userData.username}));

            feedback.innerHTML = "Signup successful! Welcome!"
            setTimeout(() => {window.location.href = "index.html"}, 3000);
        }
        else{
            buttonCorrectAnimation(false);
        }
    }
    else{
        errors = getLoginFormErrors(username.value, password.value);

        if(errors.length === 0){
            let allUsers = JSON.parse(localStorage.getItem('allUsers'));
            const storedData = allUsers[username.value.trim()];

                if (!storedData) {
                    feedback.innerHTML = "No account found. Please sign up first.";
                    username.parentElement.classList.add('incorrect');
                    password.parentElement.classList.add('incorrect');
                    buttonCorrectAnimation(false);
                   
                }
                else if (storedData && password.value.trim() === storedData.password){
                    storedData.isLoggedIn = true;

                    allUsers[username.value.trim()] = storedData;
                    localStorage.setItem('allUsers', JSON.stringify(allUsers));
                    localStorage.setItem('currentUser', JSON.stringify({username: storedData.username}));

                    feedback.innerHTML = "Login Successful!";      
                    setTimeout(() => {window.location.href = "index.html"}, 3000);
                    buttonCorrectAnimation(true);
                }
                else{
                    feedback.innerHTML = "Invalid username or password";
                    username.parentElement.classList.add('incorrect');
                    password.parentElement.classList.add('incorrect');
                    buttonCorrectAnimation(false); 
                }
            }
        else{
            buttonCorrectAnimation(false);  
        }
    }
        
    if (errors.length > 0){
        feedback.innerHTML = errors.join(". ")
        return;
    }
});

function buttonCorrectAnimation(isValid) {
    submitButton.classList.remove("animate-success", "animate-error");

    if (isValid) {
        submitButton.classList.add("animate-success");
    } else {
        submitButton.classList.add("animate-error");
    }
    
    setTimeout(() => {
        submitButton.classList.remove("animate-success", "animate-error");
    }, 3000);
}

let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function getSignUpFormErrors(usernameValue, passwordValue, passwordAgainValue, emailValue, birthdateValue){
    let errors = [];

    if(usernameValue.trim() === "" || usernameValue == null){
        errors.push("Please enter a username");
        username.parentElement.classList.add('incorrect');
       
    }
    if(passwordValue.trim() === "" || passwordValue == null){
        errors.push("Please enter a password");
        password.parentElement.classList.add('incorrect');
      
    }
    if(passwordAgainValue.trim() === "" || passwordAgainValue == null){
        errors.push("Please enter your password again");
        passwordAgain.parentElement.classList.add('incorrect');  
    }

    if (passwordValue.length < 6){
        errors.push("Password must have at least 6 characters");
        password.parentElement.classList.add('incorrect');     
    }
    if(passwordAgainValue !== passwordValue){
        errors.push("Password is not the same");
        password.parentElement.classList.add('incorrect');
        passwordAgain.parentElement.classList.add('incorrect');  
    }

    if(emailValue.trim() === "" || emailValue == null){
        errors.push("Please enter an email");
        email.parentElement.classList.add('incorrect');
    }

    if(!regex.test(emailValue)){
        errors.push("Please enter a correct email address");
        email.parentElement.classList.add('incorrect');
    }

    if(birthdateValue === "" || birthdateValue == null){
        errors.push("Please enter your date of birth");
        birthdate.parentElement.classList.add('incorrect');
    }

    if(birthdate && birthdateValue != ""){
        const birth = new Date(birthdateValue);
        const currentDate = new Date();

        let age = currentDate.getFullYear() - birth.getFullYear();
        const monthDifference = currentDate.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birth.getDate())) {
            age--;
        }

        if(age < 8){
            errors.push("Sorry, you must be at least 8 years old to sign up");
            birthdate.parentElement.classList.add('incorrect');
        }
    }

    

    if(termsCheckbox && !termsCheckbox.checked){
        errors.push("Please agree to the Terms & Conditions");
        termsContainer.classList.add('error');
    }

    return errors;
}

function getLoginFormErrors(usernameValue, passwordValue){
    let errors = [];

    

    if(usernameValue.trim() === "" || usernameValue == null){
        errors.push("Please enter a username");
        username.parentElement.classList.add('incorrect');
        
    }
    if(passwordValue.trim() === "" || passwordValue == null){
        errors.push("Please enter a password");
        password.parentElement.classList.add('incorrect');
      
    }

    return errors;
}

const allInputs = [username, password, passwordAgain, email, birthdate].filter(input => input != null);

allInputs.forEach(input => {
    input.addEventListener("input", () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect');
            feedback.innerHTML = '';

        }
    })
})


let profilePicture = document.getElementById("profile-picture");
let inputFile = document.getElementById("input-file");

if(profilePicture){
    profilePicture.addEventListener("click", () => {
        inputFile.click();
    });
}


if(inputFile){
    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0];
        if(file){
            const reader =  new FileReader();
            reader.onload = function (e) {
                profilePicture.src = e.target.result;
                localStorage.setItem("profileImage", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    })
}

const termsLink = document.getElementById('terms-link');
const hiddenBox = document.getElementById('hidden-box');


let hoverTimeout;

const showBox = () => {
    clearTimeout(hoverTimeout); 
    hiddenBox.classList.add('show');
};

const hideBox = () => {
    hoverTimeout = setTimeout(() => {
        hiddenBox.classList.remove('show');
    }, 500);
};

if(termsLink && hiddenBox){
    termsLink.addEventListener('mouseenter', showBox);
    termsLink.addEventListener('mouseleave', hideBox);

    hiddenBox.addEventListener('mouseenter', showBox);
    hiddenBox.addEventListener('mouseleave', hideBox);
}
