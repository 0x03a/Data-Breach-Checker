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
            let sizeOptions = [3];
            let size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
            element.style.width = size + "px";
            element.style.height = size + "px";

            animateFloating(element, true); // Floating effect for circles
        }

        container.appendChild(element);
    }

    // Generate Circles
    for (let i = 0; i <200; i++) {
        createElement("circle", Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 10 + 5);
    }

    // Generate Spider Webs
    for (let i = 0; i < 80; i++) {
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

// Show login modal  // Function to show the login modal
        function showLogin() {
            const loginForm = document.getElementById("loginModal");
            const overlay = document.getElementById("overlay");

            if (loginForm) {
                // Reset input fields including password fields
                loginForm.querySelectorAll("input[type='text'], input[type='email'], input[type='password']").forEach(input => {
                    input.value = "";
                });

                // Ensure checkboxes and radio buttons are unchecked
                loginForm.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach(input => {
                    input.checked = false;
                });

                // Show the login form and overlay
                loginForm.style.display = "block";
                overlay.style.display = "block";
            }
        }


// sign up validations

/*
 Prevents form submission if any field fails validation
 Displays alert messages for incorrect input
 Uses regex for secure validation
 Enhances user experience by guiding them on proper input format

This ensures only valid data is submitted!

*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".signup-form").addEventListener("submit", function (event) {
        const fullname = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirm-password").value.trim();
        const terms = document.getElementById("terms").checked;

        // Regex for full name validation (Only letters & spaces)
        const namePattern = /^[A-Za-z\s]+$/;

        // Regex for email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Regex for strong password validation (Exactly 8 characters with at least 1 special character)
        const passwordPattern = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8}$/;

        // Full Name validation
        if (!namePattern.test(fullname)) {
            alert("Full Name should contain only letters and spaces.");
            event.preventDefault();
            return false;
        }

        // Email validation
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address (e.g., user@example.com).");
            event.preventDefault();
            return false;
        }

        // Password validation
        if (!passwordPattern.test(password)) {
            alert("Password must be exactly 8 characters long and contain at least one special character (@, $, !, %, *, ?, &).");
            event.preventDefault();
            return false;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            event.preventDefault();
            return false;
        }

        // Terms & Conditions checkbox validation
        if (!terms) {
            alert("You must agree to the Terms and Privacy Policy.");
            event.preventDefault();
            return false;
        }

        return true; // If all validations pass
    });
});

       
      
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

function validateFields(event) {
    // Select email and password fields
    const email = document.querySelector(".login-form .form-group #email").value.trim();
    const password = document.querySelector(".password-containerr #password").value.trim();

    // Regular expression for a valid email address
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Regular expression for a strong password (Min: 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if fields are empty
    if (email === "" || password === "") {
        alert("Please enter both email and password before proceeding.");
        event.preventDefault();
        return false;
    }

    // Validate email format
    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address (e.g., example@domain.com).");
        event.preventDefault();
        return false;
    }

    // Validate password format
    if (!passwordPattern.test(password)) {
        alert("Password must be at least 8 characters long, including an uppercase letter, a lowercase letter, a number, and a special character.");
        event.preventDefault();
        return false;
    }

    return true; // Allow navigation if all conditions are met
}


// Login Validaion
/*
 Prevents form submission if email/password are invalid
 Uses regex to check valid email format
 Ensures password is at least 8 characters
 Shows alert messages if validation fails
*/
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".login-form").addEventListener("submit", function (event) {
        const email = document.querySelector(".login-form .form-group #email").value.trim();
        const password = document.querySelector(".password-containerr #password").value.trim();

        // Regex for email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Email validation
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address (e.g., userexample@.com).");
            event.preventDefault();
            return false;
        }

        // Password validation (Minimum 8 characters)
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            event.preventDefault();
            return false;
        }

        return true; // If all validations pass
    });
});
