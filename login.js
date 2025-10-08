document.addEventListener("DOMContentLoaded", () => {
    const eyeOpen =  document.getElementById("eye-icon")
    const eyeClosed =  document.getElementById("eye-slash")
    const passwordInput = document.getElementById("password");

    eyeClosed.addEventListener("click", () => {
        eyeClosed.style.opacity = "0";
        eyeClosed.style.pointerEvents = "none";
        eyeOpen.style.opacity = "1"
        eyeOpen.style.pointerEvents = "auto"
        passwordInput.type = "text";
        
    });

    eyeOpen.addEventListener("click", () => {
        eyeOpen.style.opacity = "0";
        eyeOpen.style.pointerEvents = "none"
        eyeClosed.style.opacity = "1";
        eyeClosed.style.pointerEvents = "auto";
        passwordInput.type = "password";
    });
    
})