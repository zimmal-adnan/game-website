
//----PASSWORD VISIBILITY----
//Toggle password visibility
function eyeIconLogic(eyeShut, eyeOpen, passwordInput){
    eyeShut.addEventListener("click", () => {
        //Hide closed eye icon and show open eye to reveal password 
        eyeShut.style.opacity = "0";
        eyeShut.style.pointerEvents = "none";
        eyeOpen.style.opacity = "1";
        eyeOpen.style.pointerEvents = "auto";
        passwordInput.type = "text"; 
    });

    eyeOpen.addEventListener("click", () => {
        //Hide open eye icon and show closed eye to hidepassword 
        eyeOpen.style.opacity = "0";
        eyeOpen.style.pointerEvents = "none";
        eyeShut.style.opacity = "1";
        eyeShut.style.pointerEvents = "auto";
        passwordInput.type = "password";
    });
}

const eyeClosed1 = document.getElementById("eye-slash");
const eyeClosed2 = document.getElementById("eye-slash2");
const eyeOpen1 = document.getElementById("eye-icon");
const eyeOpen2 = document.getElementById("eye-icon2");

const password = document.getElementById('password');
const passwordAgain = document.getElementById('passwordAgain');

//Toggle password visbility for password and password confirmation input fields
if (eyeClosed1 && eyeOpen1 && password) {
    eyeIconLogic(eyeClosed1, eyeOpen1, password);
}
if (eyeClosed2 && eyeOpen2 && passwordAgain) {
    eyeIconLogic(eyeClosed2, eyeOpen2, passwordAgain);
}

//---HANDLE SIGNUP AND LOGIN FORMS----
const form = document.getElementById('form');
const username = document.getElementById('username');
const telephone = document.getElementById('telephone');
const email = document.getElementById('email');
const birthdate = document.getElementById('date');
const termsCheckbox = document.getElementById('terms-checkbox');
const termsContainer = document.getElementById('terms-checkbox-container');
const rememberCheckbox = document.getElementById('remember-checkbox');
const feedback = document.getElementById('feedback');

const submitButton =  document.getElementById('submit-button');

let isValid = false;

//Form submission and validation logic
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let errors = [];

    //If email input field exists validate signup form with all fields
    if(email){
        errors = getSignUpFormErrors(username.value, password.value, passwordAgain.value, telephone.value, email.value, birthdate.value);
        
        if (errors.length === 0) {
            //Show success animation
            buttonCorrectAnimation(true);

            //Store user data to localStorage
            const userData = {
                username: username.value.trim(),
                email: email.value.trim(),
                password: password.value.trim(),
                birthdate: birthdate.value,
                telephone: telephone.value,
                profilePicture: tempProfilePicture || '../Images/profile.jpg',
                isLoggedIn: true
            };

            let allUsers = JSON.parse(localStorage.getItem('allUsers')) || {};
            allUsers[userData.username] = userData;

            localStorage.setItem('allUsers', JSON.stringify(allUsers));
            localStorage.setItem('currentUser', JSON.stringify({username: userData.username}));

            tempProfilePicture = null;
            
            feedback.innerHTML = "Signup successful! Welcome!"

            //Redirect to index.html after a delay to show success animation
            setTimeout(() => {window.location.href = "index.html"}, 3000);
        }
        else{
            //Show unsuccessful button animation
            buttonCorrectAnimation(false);
        }
    }

    //if no email input field validate login form
    else{
        errors = getLoginFormErrors(username.value, password.value);

        if(errors.length === 0){
            let allUsers = JSON.parse(localStorage.getItem('allUsers'));
            const storedData = allUsers[username.value.trim()];

                //Handling different login outcomes
                if (!storedData) {
                    feedback.innerHTML = "No account found. Please sign up first.";
                    username.parentElement.classList.add('incorrect');
                    password.parentElement.classList.add('incorrect');
                    buttonCorrectAnimation(false);
                   
                }
                else if (storedData && password.value.trim() === storedData.password){
                    //Successful login logic
                    storedData.isLoggedIn = true;
                    allUsers[username.value.trim()] = storedData;
                    localStorage.setItem('allUsers', JSON.stringify(allUsers));
                    
                    //Store currentUser data to localStorage if Remember Me is checked
                    if (rememberCheckbox && rememberCheckbox.checked) {
                        localStorage.setItem('currentUser', JSON.stringify({username: storedData.username}));
                    } 
                    //If Remember Me is unchecked store to session storage
                    else {
                        sessionStorage.setItem('currentUser', JSON.stringify({ username: storedData.username }));
                    }

                    feedback.innerHTML = "Login Successful!";      
                    setTimeout(() => {window.location.href = "index.html"}, 3000);
                    buttonCorrectAnimation(true);
                }
                else{
                    //Invalid credentials
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
    
    //Display multiple validation errors in feedback area
    if (errors.length > 0){
        feedback.innerHTML = errors.join(". ")
        return;
    }
});


//----BUTTON ANIMATION----
//Button feedback animation for correct/incorrect submission
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


//Regular expressions for email and phone validation
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let phoneRegex = /^\+?[0-9]{7,14}$/


//----SIGNUP VALIDATION----
//Validate signup form fields
function getSignUpFormErrors(usernameValue, passwordValue, passwordAgainValue, telephoneValue, emailValue, birthdateValue){
    let errors = [];

    //Username validation
    if(usernameValue.trim() === "" || usernameValue == null){
        errors.push("Please enter a username");
        username.parentElement.classList.add('incorrect');
    }

    //Password validation
    if(passwordValue.trim() === "" || passwordValue == null){
        errors.push("Please enter a password");
        password.parentElement.classList.add('incorrect');
    }
    if (passwordValue.length < 6){
        errors.push("Password must have at least 6 characters");
        password.parentElement.classList.add('incorrect');     
    }

    //Password confirmation validation
    if(passwordAgainValue.trim() === "" || passwordAgainValue == null){
        errors.push("Please enter your password again");
        passwordAgain.parentElement.classList.add('incorrect');  
    }
    if(passwordAgainValue !== passwordValue){
        errors.push("Password is not the same");
        password.parentElement.classList.add('incorrect');
        passwordAgain.parentElement.classList.add('incorrect');  
    }

    //Email validation
    if(emailValue.trim() === "" || emailValue == null){
        errors.push("Please enter an email");
        email.parentElement.classList.add('incorrect');
    }
    if(!emailRegex.test(emailValue)){
        errors.push("Please enter a correct email address");
        email.parentElement.classList.add('incorrect');
    }

    //Phone number validation
    if(telephoneValue.trim() === "" || telephoneValue == null){
        errors.push("Please enter a phone number");
        telephone.parentElement.classList.add('incorrect');
    }
    if(!phoneRegex.test(telephoneValue)){
        errors.push("Please enter a valid phone number (+1234567890)");
        telephone.parentElement.classList.add('incorrect');
    }

    //Date of birth and age validation
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

    //Terms and conditions validation
    if(termsCheckbox && !termsCheckbox.checked){
        errors.push("Please agree to the Terms & Conditions");
        termsContainer.classList.add('error');
    }

    return errors;
}

//----LOGIN VALIDATION----
//Validate login form fields
function getLoginFormErrors(usernameValue, passwordValue){
    let errors = [];

    //Username validation
    if(usernameValue.trim() === "" || usernameValue == null){
        errors.push("Please enter a username");
        username.parentElement.classList.add('incorrect');    
    }

    //Password validation
    if(passwordValue.trim() === "" || passwordValue == null){
        errors.push("Please enter a password");
        password.parentElement.classList.add('incorrect');
      
    }

    return errors;
}



const allInputs = [username, password, passwordAgain, email, birthdate].filter(input => input != null);
//Removes red highlights and feedback when user types again
allInputs.forEach(input => {
    input.addEventListener("input", () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect');
            feedback.innerHTML = '';
        }
    })
})


//----UPLOAD PROFILE PICTURE----
let profilePicture = document.getElementById("profile-picture");
let inputFile = document.getElementById("input-file");
let tempProfilePicture = null;

//Click profile picture to upload image
if(profilePicture){
    profilePicture.addEventListener("click", () => {
        inputFile.click();
    });
}

if(inputFile){
    inputFile.addEventListener("change", () => {
        //Get first file if user selects multiple files
        const file = inputFile.files[0];

        if(file){    
            const reader =  new FileReader();

            //Update profile picture preview when the file is fully read
            reader.onload = function (e) {
                profilePicture.src = e.target.result;
                tempProfilePicture = e.target.result;
            };

            //Convert uploaded image to data URL
            reader.readAsDataURL(file);
        }
    })
}


//----TERMS AND CONDITIONS POPUP----
const termsLink = document.getElementById('terms');
const hiddenBox = document.getElementById('hidden-box');

let hoverTimeout;

//Show terms and conditions popup with a smooth transition
const showBox = () => {
    clearTimeout(hoverTimeout); 
    hiddenBox.classList.add('show');
};

//Delay hiding terms and conditions for hover transitions
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


