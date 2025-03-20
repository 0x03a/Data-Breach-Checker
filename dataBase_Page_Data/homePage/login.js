const form = document.querySelector("form"); // Assuming these are within a form element
const togglePasswordButtons = form.querySelectorAll(".toggle-password");

togglePasswordButtons.forEach(button => {
    // Show password on mouse hover
    button.addEventListener("mouseenter", function() {
        const passwordContainer = this.closest(".password-container");
        const passwordField = passwordContainer.querySelector("input[type='password'], input[type='text']");
        
        passwordField.type = "text";
        const eyeIcon = this.querySelector("i");
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    });
    
    // Hide password when mouse leaves
    button.addEventListener("mouseleave", function() {
        const passwordContainer = this.closest(".password-container");
        const passwordField = passwordContainer.querySelector("input[type='password'], input[type='text']");
        
        passwordField.type = "password";
        const eyeIcon = this.querySelector("i");
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
    });
});

// Close button functionality
const closeBtn = document.querySelector('.close-btn');
if (closeBtn) {
    closeBtn.addEventListener('click', function() {
        // If this login form is in a standalone page
        // window.location.href = 'index.html';
        
        // If this login form is in a modal
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer && loginContainer.parentElement) {
            // If inside a modal container
            const modal = loginContainer.closest('.modal') || 
                          loginContainer.closest('#loginModal');
            if (modal) {
                modal.style.display = 'none';
                
                // Also hide overlay if it exists
                const overlay = document.querySelector('#loginOverlay') || 
                              document.querySelector('.overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }
            }
        }
    });
}

// Form submission handling
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Here you would typically send the login data to your server
        // For demonstration, we'll just simulate a login
        console.log('Login attempt:', { email, password });
        
        // Simulate loading
        const loginBtn = loginForm.querySelector('.login-btn');
        loginBtn.textContent = 'Logging in...';
        loginBtn.disabled = true;
        
        // Simulate server response (remove this in production)
        setTimeout(() => {
            // Redirect to dashboard or home page after successful login
            // window.location.href = 'dashboard.html';
            
            // Or close the modal if it's in a modal
            alert('Login successful!');
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
        }, 1500);
    });
}

// Social login buttons
const googleBtn = document.querySelector('.google-btn');
const githubBtn = document.querySelector('.github-btn');

if (googleBtn) {
    googleBtn.addEventListener('click', function() {
        // Implement Google OAuth login
        console.log('Google login clicked');
        alert('Google login functionality would be implemented here');
    });
}

if (githubBtn) {
    githubBtn.addEventListener('click', function() {
        // Implement GitHub OAuth login
        console.log('GitHub login clicked');
        alert('GitHub login functionality would be implemented here');
    });
}

// Sign up link
const signupLink = document.querySelector('.signup-link a');
if (signupLink) {
    signupLink.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Hide login form/modal
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer && loginContainer.parentElement) {
            const modal = loginContainer.closest('.modal') || 
                        loginContainer.closest('#loginModal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
        
        // Show signup form/modal
        const signupModal = document.getElementById('signupModal');
        const overlay = document.getElementById('overlay');
        
        if (signupModal && overlay) {
            signupModal.style.display = 'block';
            overlay.style.display = 'block';
        } else {
            // Navigate to signup page if it's not a modal
            // window.location.href = 'signup.html';
            console.log('Navigate to signup page');
            alert('Would navigate to signup page');
        }
    });
}

// Forgot password link
const forgotPasswordLink = document.querySelector('.forgot-password a');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        console.log('Forgot password clicked');
        alert('Password reset functionality would be implemented here');
        // Implement your password reset logic or navigation
        // window.location.href = 'reset-password.html';
    });
}