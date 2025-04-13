document.addEventListener("DOMContentLoaded", function () {
    // Background animation elements
    const container = document.querySelector(".background-elements");
    const interactiveElements = [...document.querySelectorAll("form, input, textarea, button, select")];

    function createElement(type, left, top, duration) {
        let element = document.createElement("div");
        element.classList.add(type);
        element.style.position = "absolute";
        element.style.left = left + "px";
        element.style.top = top + "px";
        element.style.animationDuration = duration + "s";

        if (type === "circle") {
            element.style.borderRadius = "50%";
            let size = 3;
            element.style.width = size + "px";
            element.style.height = size + "px";
            animateFloating(element, true);
        }

        return element;
    }

    function generateElements() {
        let fragment = document.createDocumentFragment();
        for (let i = 0; i < 200; i++) {
            fragment.appendChild(createElement("circle", Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 10 + 5));
        }
        container.appendChild(fragment);
    }

    if (container) {
        generateElements();
    }

    function animateFloating(element, changeColor) {
        let x = parseFloat(element.style.left);
        let y = parseFloat(element.style.top);
        let speedX = (Math.random() - 0.5) * 6;
        let speedY = (Math.random() - 0.5) * 6;

        function move() {
            x += speedX;
            y += speedY;

            // Bounce within viewport
            if (x < 0 || x > window.innerWidth - parseFloat(element.style.width)) speedX *= -1;
            if (y < 0 || y > window.innerHeight - parseFloat(element.style.height)) speedY *= -1;

            // Detect overlap with interactive elements
            let rect1 = element.getBoundingClientRect();
            let isOverlapping = interactiveElements.some(el => {
                let rect2 = el.getBoundingClientRect();
                return rect1.right > rect2.left && rect1.left < rect2.right &&
                       rect1.bottom > rect2.top && rect1.top < rect2.bottom;
            });

            if (isOverlapping) {
                speedX *= -1;
                speedY *= -1;
            }

            // Apply movement using transform for smoother rendering
            element.style.transform = `translate(${x}px, ${y}px)`;

            // Change color dynamically
            if (changeColor) {
                let grayScale = Math.floor(((x + y) / (window.innerWidth + window.innerHeight)) * 105) + 150;
                element.style.backgroundColor = `rgb(${grayScale}, ${grayScale}, ${grayScale})`;
            }

            requestAnimationFrame(move);
        }
        move();
    }

    // Footer show/hide functionality
    let lastScrollTop = 0;
    const footer = document.querySelector("footer");

    if (footer) {
        window.addEventListener("scroll", function () {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop) {
                // Scrolling down - show footer
                footer.style.bottom = "0";
            } else {
                // Scrolling up - hide footer (only if not hovered)
                if (!footer.matches(":hover")) {
                    footer.style.bottom = "-60px";
                }
            }

            lastScrollTop = Math.max(scrollTop, 0); // Prevent negative values
        });

        // Prevent hiding when hovering over footer
        footer.addEventListener("mouseenter", function () {
            footer.style.bottom = "0";
        });

        footer.addEventListener("mouseleave", function () {
            if (window.scrollY <= lastScrollTop) {
                footer.style.bottom = "-60px";
            }
        });
    }

    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    const body = document.body;
    const overlay = document.getElementById('overlay');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            menu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking on regular links (links without onclick attributes)
        const menuLinks = document.querySelectorAll('.menu a:not([onclick])');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                menu.classList.remove('active');
                body.classList.remove('menu-open');
            });
        });

        // Handle mobile auth links
        const authLinks = document.querySelectorAll('.mobile-auth-item a');
        authLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Prevent default to handle modal display manually
                e.preventDefault();
                
                // Get the function name from onclick attribute
                const onclickAttr = this.getAttribute('onclick');
                
                // Execute the function (showLogin or showSignup)
                if (onclickAttr && onclickAttr.includes('showLogin')) {
                    showLogin();
                    // Close the menu after modal is shown
                    menuToggle.classList.remove('active');
                    menu.classList.remove('active');
                    body.classList.remove('menu-open');
                } else if (onclickAttr && onclickAttr.includes('showSignup')) {
                    showSignup();
                    // Close the menu after modal is shown
                    menuToggle.classList.remove('active');
                    menu.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = menu.contains(event.target) || menuToggle.contains(event.target);
            if (!isClickInside && menu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                menu.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    // Password toggle functionality (unified for all password fields)
    const toggleButtons = document.querySelectorAll(".toggle-password");
    
    toggleButtons.forEach(button => {
        if (button) {
            const targetId = button.getAttribute("data-target");
            const passwordField = document.getElementById(targetId);
            
            if (passwordField) {
                // Show password on mouse hover
                button.addEventListener("mouseenter", function() {
                    passwordField.type = "text";
                    this.classList.remove("ri-eye-off-line");
                    this.classList.add("ri-eye-line");
                });
                
                // Hide password when mouse leaves
                button.addEventListener("mouseleave", function() {
                    passwordField.type = "password";
                    this.classList.remove("ri-eye-line");
                    this.classList.add("ri-eye-off-line");
                });
            }
        }
    });

    // Sign up form validation
    const signupForm = document.querySelector(".auth-form[action='register.php']");
    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();
            const terms = document.getElementById("terms").checked;

            // Regex for validations
            const namePattern = /^[A-Za-z\s]+$/;
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
    }

    // Login form validation
    const loginForm = document.querySelector(".auth-form[action='login.php']");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            // Regex for email validation
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            // Email validation
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address (e.g., user@example.com).");
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
    }

    // Password breach check functionality
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            const password = searchInput.value.trim();
            if (password.length === 0) {
                alert("Please enter a password to check.");
                return;
            }
            
            // Here you would typically make an API call to check the password
            // For demo purposes, we'll just show an alert
            alert("Password check submitted. This would normally be checked against a secure database.");
            searchInput.value = ''; // Clear the input for security
        });
    }

    // Close modals when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            hideLogin();
            hideSignup();
        });
    }

    // Close modals with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideLogin();
            hideSignup();
        }
    });
});

// Modal functions (kept outside the DOMContentLoaded to be accessible globally)
function showSignup() {
    document.getElementById("signupModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
    
    // Reset the form if it exists
    const signupForm = document.querySelector(".auth-form[action='register.php']");
    if (signupForm) {
        signupForm.reset();
    }
}

function hideSignup() {
    document.getElementById("signupModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = ""; // Restore scrolling
}

function showLogin() {
    document.getElementById("loginModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
    
    // Reset the form if it exists
    const loginForm = document.querySelector(".auth-form[action='login.php']");
    if (loginForm) {
        loginForm.reset();
    }
}

function hideLogin() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = ""; // Restore scrolling
}