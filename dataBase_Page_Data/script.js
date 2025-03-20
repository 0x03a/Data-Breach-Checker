document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".background-elements");

    function createElement(type, left, top, duration) {
        let element = document.createElement("div");
        element.classList.add(type);
        element.style.position = "absolute";
        element.style.left = left + "px";
        element.style.top = top + "px";
        element.style.animationDuration = duration + "s";

        if (type === "spider-web") {
            element.innerHTML = "🕸️"; // Spider web emoji
            element.style.fontSize = "10px";
            element.style.opacity = Math.random() * 0.5 + 0.5;
            animateSpiderWeb(element); // Unique floating movement
        } else if (type === "circle") {
            element.style.borderRadius = "50%";

            // Assign size: 2
            let sizeOptions = [2];
            let size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
            element.style.width = size + "px";
            element.style.height = size + "px";

            animateFloating(element, true); // Floating effect for circles
        }

        container.appendChild(element);
    }

    // Generate Circles
    for (let i = 0; i <80; i++) {
        createElement("circle", Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 10 + 5);
    }

    // Generate Spider Webs
    for (let i = 0; i < 30; i++) {
        createElement("spider-web", Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 10 + 5);
    }

    function animateFloating(element, changeColor) {
        let x = parseFloat(element.style.left);
        let y = parseFloat(element.style.top);
        let speedX = (Math.random() - 0.5) * 2; // Smooth movement
        let speedY = (Math.random() - 0.5) * 2;
    
        function move() {
            x += speedX;
            y += speedY;
    
            // Bounce back within the viewport
            if (x < 0 || x > window.innerWidth - parseFloat(element.style.width)) speedX *= -1;
            if (y < 0 || y > window.innerHeight - parseFloat(element.style.height)) speedY *= -1;
    
            // Detect if the circle is over a form or input field
            let interactiveElements = document.querySelectorAll("form, input, textarea, button, select");
            let isOverlapping = false;
    
            interactiveElements.forEach((el) => {
                let rect1 = element.getBoundingClientRect(); // Circle
                let rect2 = el.getBoundingClientRect(); // Form element
    
                if (
                    rect1.right > rect2.left &&
                    rect1.left < rect2.right &&
                    rect1.bottom > rect2.top &&
                    rect1.top < rect2.bottom
                ) {
                    isOverlapping = true;
    
                    // Reverse direction if overlapping
                    speedX *= -1;
                    speedY *= -1;
                }
            });
    
            // Move the element
            element.style.left = x + "px";
            element.style.top = y + "px";
    
            // Change circle color dynamically (Only Light Gray to Light Black)
            if (changeColor) {
                let grayScale = Math.floor(((x + y) / (window.innerWidth + window.innerHeight)) * 105) + 150;
                element.style.transition = "background-color 0.3s ease-in-out"; // Smooth transition
                element.style.backgroundColor = `rgb(${grayScale}, ${grayScale}, ${grayScale})`;
            }
    
            requestAnimationFrame(move);
        }
        move();
    }
    
        // Animate Spider Webs Floating & Moving Randomly
    function animateSpiderWeb(element) {
        let x = parseFloat(element.style.left);
        let y = parseFloat(element.style.top);
        let angle = Math.random() * Math.PI * 2;
        let speed = Math.random() * 2 + 0.5; // Slightly slower movement

        function floatWeb() {
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;

            // Keep within screen bounds
            if (x < 0 || x > window.innerWidth - 30) angle = Math.PI - angle;
            if (y < 0 || y > window.innerHeight - 30) angle = -angle;

            element.style.left = x + "px";
            element.style.top = y + "px";

            requestAnimationFrame(floatWeb);
        }
        floatWeb();
    }
});




let lastScrollTop = 0;
const footer = document.querySelector("footer");

window.addEventListener("scroll", function() {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // User scrolling down - show footer
        footer.style.bottom = "0";
    } else {
        // User scrolling up - hide footer (only if not hovered)
        if (!footer.matches(":hover")) {
            footer.style.bottom = "-60px";
        }
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative values
});



// Keep the footer open when hovered
footer.addEventListener("mouseenter", function() {
    footer.style.bottom = "0";
});

// Hide footer when mouse leaves, but only if scrolling up
footer.addEventListener("mouseleave", function() {
    if (window.scrollY <= lastScrollTop) {
        footer.style.bottom = "-60px";
    }
});

const form = document.querySelector("form"); // Assuming these are within a form element
const togglePasswordButtons = form.querySelectorAll(".toggle-password");

togglePasswordButtons.forEach(button => {
    // Show password on mouse hover
    button.addEventListener("mouseenter", function() {
        const targetId = this.getAttribute("data-target");
        const passwordField = form.querySelector(`#${targetId}`);
        
        passwordField.type = "text";
        this.classList.remove("ri-eye-off-line");
        this.classList.add("ri-eye-line");
    });
    
    // Hide password when mouse leaves
    button.addEventListener("mouseleave", function() {
        const targetId = this.getAttribute("data-target");
        const passwordField = form.querySelector(`#${targetId}`);
        
        passwordField.type = "password";
        this.classList.remove("ri-eye-line");
        this.classList.add("ri-eye-off-line");
    });
});
function showSignup() {
    const signupForm = document.querySelector(".signup-form");
    
    if (signupForm) {
        // Reset the form
        signupForm.reset();
        
        // Clear all input values
        const inputs = signupForm.querySelectorAll("input");
        inputs.forEach(input => {
            input.value = "";
            
            // Instead of disabling autocomplete, explicitly enable it
            // This allows browser suggestions but prevents automatic filling
            input.setAttribute("autocomplete", "on");
            
            // Reset checkbox and radio if needed
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = false;
            }
        });
        
        // Special handling for specific fields
        const emailInput = signupForm.querySelector("#email");
        if (emailInput) {
            emailInput.setAttribute("autocomplete", "email");
        }
        
        const nameInput = signupForm.querySelector("#fullname");
        if (nameInput) {
            nameInput.setAttribute("autocomplete", "name");
        }
        
        // Password fields should still be secure
        const passwordInputs = signupForm.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.setAttribute("autocomplete", "new-password");
        });
    }
    
    document.getElementById("signupModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}


function hideSignup() {
    document.getElementById("signupModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}


// in login form toggle eye
document.addEventListener("DOMContentLoaded", function () {
    const pwdField = document.getElementById("password");
    const toggleBtn = document.querySelector(".toggle-password");
    const icon = toggleBtn.querySelector("i");

    toggleBtn.addEventListener("mouseenter", function () {
        pwdField.type = "text"; // Show password when hovering
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    });

    toggleBtn.addEventListener("mouseleave", function () {
        pwdField.type = "password"; // Hide password when not hovering
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    });
});

// Show login modal
function showLogin() {
    const loginForm = document.getElementById("loginModal");
    const overlay = document.getElementById("overlay");

    if (loginForm) {
        // Reset input fields
        loginForm.querySelectorAll("input").forEach(input => input.value = "");

        loginForm.style.display = "block";
        overlay.style.display = "block";
    }
}

// Hide login modal
function hideLogin() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
    // Select the elements using their full path
    const passwordField = document.querySelector(".password-containerr input[type='password']"); // i have to put containerr bcz when i write .password-container it mixes it with sign up .password-container
    const toggleButton = document.querySelector(".password-containerr .toggle-password");
    const eyeIcon = document.querySelector(".password-containerr .toggle-password i");

    // Debugging: Check if elements exist
    if (!passwordField || !toggleButton || !eyeIcon) {
        console.error("One or more elements not found!");
        return;
    }

    console.log("Event listeners added!");

    toggleButton.addEventListener("mouseenter", function () {
        console.log("Hover detected!");
        passwordField.type = "text"; // Show password
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
    });

    toggleButton.addEventListener("mouseleave", function () {
        console.log("Mouse left the button!");
        passwordField.type = "password"; // Hide password
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
    });
});
