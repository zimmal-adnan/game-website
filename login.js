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
const feedback = document.getElementById('feedback');
const submitButton =  document.getElementById('submit-button');

let isValid = false;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let errors = [];

    if(email){
        errors = getSignUpFormErrors(username.value, password.value, passwordAgain.value, email.value);
        if (errors.length === 0) {
            const userData = {
                username: username.value.trim(),
                email: email.value.trim(),
                password: password.value.trim(),
                profilePicture: localStorage.getItem('profileImage') || '../Images/profile.jpg',
                isLoggedIn: true
            };

            localStorage.setItem('userData', JSON.stringify(userData));
          
            feedback.innerHTML = "Signup successful! Welcome!"
            

            setTimeout(() => {window.location.href = "index.html"}, 3000);
        }
    }
    else{
        errors = getLoginFormErrors(username.value, password.value);

        if(errors.length === 0){
            const storedData = JSON.parse(localStorage.getItem('userData'));

                if (!storedData) {
                    feedback.innerHTML = "No account found. Please sign up first.";
                    username.parentElement.classList.add('incorrect');
                    password.parentElement.classList.add('incorrect');
                   
                }
                else if (username.value.trim() === storedData.username && password.value.trim() === storedData.password){
                    storedData.isLoggedIn = true;
                    feedback.innerHTML = "Login Successful!";      
                    setTimeout(() => {window.location.href = "index.html"}, 3000);
                }
                else{
                    feedback.innerHTML = "Invalid username or password";
                    username.parentElement.classList.add('incorrect');
                    password.parentElement.classList.add('incorrect');
                }
            }
        }
        

    if (errors.length > 0){
        feedback.innerHTML = errors.join(". ")
        return;
    }
});

function getSignUpFormErrors(usernameValue, passwordValue, passwordAgainValue, emailValue){
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
    if(emailValue.trim() === "" || emailValue == null){
        errors.push("Please enter an email");
        email.parentElement.classList.add('incorrect');
        
    }
    if (passwordValue.length < 6){
        errors.push("Password must have at least 6 characters");
        password.parentElement.classList.add('incorrect');
        
    }
    if(passwordAgainValue !== passwordValue){
        errors.push("Password is not the same!");
        password.parentElement.classList.add('incorrect');
        passwordAgain.parentElement.classList.add('incorrect');
        
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

const allInputs = [username, password, passwordAgain, email].filter(input => input != null);

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

profilePicture.addEventListener("click", () => {
    inputFile.click();
});


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

