document.addEventListener("DOMContentLoaded", () => {
    const eyeOpen =  document.getElementById("eye-icon");
    const eyeClosed =  document.getElementById("eye-slash");
    const passwordInput = document.getElementById("password");
    const passwordAgainInput = document.getElementById("passwordAgain");
    

    eyeClosed.addEventListener("click", () => {
        eyeClosed.style.opacity = "0";
        eyeClosed.style.pointerEvents = "none";
        eyeOpen.style.opacity = "1";
        eyeOpen.style.pointerEvents = "auto";
        passwordInput.type = "text";
        passwordAgainInput.type = "text";
        
        
    });

    eyeOpen.addEventListener("click", () => {
        eyeOpen.style.opacity = "0";
        eyeOpen.style.pointerEvents = "none";
        eyeClosed.style.opacity = "1";
        eyeClosed.style.pointerEvents = "auto";
        passwordInput.type = "password";
        passwordAgainInput.type = "password";
       

    });

    let isValid = true;
    let feedback = document.getElementById('feedback');
    let signUpbutton = document.getElementById('submit-button');

    function submitSignUp(){
        let username = document.getElementById('signUpUsername').value;
        let password = document.getElementById('password').value;
        let passwordAgain = document.getElementById('passwordAgain').value;
        let email = document.getElementById('email').value;

        isValid = true;
        feedback.innerHTML = "";


        if(username.trim() === ""){
            feedback.innerHTML = "Enter username please!"
            isValid = false;
        }
        else if(password.trim() === ""){
            feedback.innerHTML = "Enter password please!"
            isValid = false;
        }
        else if(email.trim() === ""){
            feedback.innerHTML = "Enter email please!"
            isValid = false;
        }
        else if (password.length < 4){
            feedback.innerHTML = "Password must be atleast 4 characters"
            isValid = false;
        }
        else if(!validateEmail(email)){
            feedback.innerHTML = "Email is not in the correct format"
            isValid = false;
        }
        else if(passwordAgain != password){
            feedback.innerHTML = "Password is not the same!"
            isValid = false;
        }
        
        
        if(isValid == true){
            feedback.innerHTML = "Welcome!"
            
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }
    }

    signUpbutton.addEventListener("click", (event) => {
        event.preventDefault();
        submitSignUp();
    })

});


