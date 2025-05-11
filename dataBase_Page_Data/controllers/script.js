document.addEventListener("DOMContentLoaded", async function () { // AbstractApi used for email validation
    // Background animation elements
    const container = document.querySelector(".background-elements");
    const interactiveElements = [...document.querySelectorAll("form, input, textarea, button, select")];

    // AbstractAPI Email Validation
    const ABSTRACTAPI_KEY = 'f659f97cd12947d3aad411565c4538ce';
    async function verifyEmailWithAbstractAPI(email) {
        try {
            const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACTAPI_KEY}&email=${encodeURIComponent(email)}`;
            const response = await fetch(url); // GET request will work, but POST request will not work
            if (!response.ok) {
                console.log('AbstractAPI error:', response.status, response.statusText);
                return false;
            }
            const data = await response.json();
            console.log('AbstractAPI response:', data);
            // Accept only if deliverability is 'DELIVERABLE'
            return data.deliverability === 'DELIVERABLE';
        } catch (e) {
            console.log('AbstractAPI exception:', e);
            return false;
        }
    }

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
        signupForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Always prevent default, submit only if all checks pass
            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();
            const confirmPassword = document.getElementById("confirm-password").value.trim();
            const terms = document.getElementById("terms").checked;

            const namePattern = /^[A-Za-z\s]+$/;
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

            if (!namePattern.test(fullname)) {
                alert("Full Name should contain only letters and spaces.");
                return false;
            }

            // Only AbstractAPI email validation
            const isValid = await verifyEmailWithAbstractAPI(email);
            if (!isValid) {
                alert("Please enter a valid, deliverable email address.");
                return false;
            }

            if (!passwordPattern.test(password)) {
                alert("Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.");
                return false;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match. Please try again.");
                return false;
            }

            if (!terms) {
                alert("You must agree to the Terms and Privacy Policy.");
                return false;
            }

            signupForm.submit(); // All checks passed, submit form
        });
    }

    // Login form validation
    const loginForm = document.querySelector(".auth-form[action='/auth/login']");
    if (loginForm) {
        loginForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            // Only AbstractAPI email validation
            const isValid = await verifyEmailWithAbstractAPI(email);
            if (!isValid) {
                alert("Please enter a valid, deliverable email address.");
                return false;
            }

            // You can adjust password validation as needed
            if (password.length < 8) {
                alert("Password must be at least 8 characters long.");
                return false;
            }

            // Use fetch to login and handle redirect
            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const result = await res.json();
            if (result.success && result.token) {
                sessionStorage.setItem('token', result.token); // <-- Store token after login
                if (typeof window.checkSession === 'function') await window.checkSession(); // Update nav immediately
                if (result.isAdmin) {
                    window.location.href = '/views/admin.html';
                } else {
                    window.location.href = '/views/home.html'; // Redirect to home page for user
                }
            } else {
                alert('Login failed');
            }
        });
    }

    // Password breach check functionality
    // (Removed old logic that showed alert)

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

    // Show/hide login/signup or logout button based on session
    try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('/auth/session', token ? { headers: { 'Authorization': 'Bearer ' + token } } : {});
        const data = await res.json();
        const desktopAuth = document.querySelector('.desktop-auth');
        const mobileAuthItems = document.querySelectorAll('.mobile-auth-item');
        const userPasswordCheckContainer = document.getElementById('userPasswordCheckContainer');
        const passwordCheckAlert = document.getElementById('passwordCheckAlert');
        if (data.loggedIn) {
            // Hide login/signup, show logout
            if (desktopAuth) {
                desktopAuth.innerHTML = `<button class="btn1" id="logoutBtn"><i class="ri-logout-box-line"></i> <span class="btn-text">Logout</span></button>`;
                document.getElementById('logoutBtn').onclick = async function() {
                    const token = sessionStorage.getItem('token');
                    await fetch('/auth/logout', { method: 'POST', headers: token ? { 'Authorization': 'Bearer ' + token } : {} });
                    sessionStorage.removeItem('token');
                    window.location.reload();
                };
            }
            mobileAuthItems.forEach(item => {
                if (item.id === 'mobileLogoutItem') {
                    item.innerHTML = `<a href="#" id="mobileLogoutBtn"><i class="ri-logout-box-line"></i> Logout</a>`;
                }
            });
            // Show password check input for non-admin users
            if (userPasswordCheckContainer && passwordCheckAlert && !data.user.isAdmin) {
                userPasswordCheckContainer.style.display = '';
                passwordCheckAlert.style.display = '';
                // Attach password check logic
                const input = document.getElementById('userCheckPasswordInput');
                const btn = document.getElementById('userCheckPasswordBtn');
                function showAlert(message, color) {
                    passwordCheckAlert.textContent = message;
                    passwordCheckAlert.style.color = color;
                    passwordCheckAlert.style.fontWeight = 'bold';
                    passwordCheckAlert.style.background = color === 'red' ? '#ffeaea' : '#eaffea';
                    passwordCheckAlert.style.border = `1px solid ${color}`;
                    passwordCheckAlert.style.padding = '0.75em 1em';
                    passwordCheckAlert.style.borderRadius = '8px';
                    passwordCheckAlert.style.textAlign = 'center';
                }
                btn.onclick = async function() {
                    const password = input.value.trim();
                    passwordCheckAlert.textContent = '';
                    if (!password) {
                        showAlert('Please enter a password.', 'red');
                        return;
                    }
                    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
                    if (!passwordPattern.test(password)) {
                        showAlert('Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.', 'red');
                        return;
                    }
                    try {
                        const res = await fetch('/admin/check-password-breach', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ password })
                        });
                        const data = await res.json();
                        if (res.ok) {
                            if (data.breached) {
                                showAlert(`Password is breached: ${password}`, 'red');
                            } else {
                                showAlert(`Password is safe: ${password}`, 'green');
                            }
                        } else {
                            showAlert(data.message || 'Server error.', 'red');
                        }
                    } catch (e) {
                        showAlert('Server error.', 'red');
                    }
                };
            }
        } else {
            // Show login/signup
            if (desktopAuth) {
                desktopAuth.innerHTML = `
                    <button class="btn1" onclick="showLogin()">
                        <i class="ri-login-box-line"></i> <span class="btn-text">Login</span>
                    </button>
                    <span class="nav_divider">/</span>
                    <button class="btn2" onclick="showSignup()">
                        <i class="ri-user-add-line"></i> <span class="btn-text">Sign Up</span>
                    </button>
                `;
            }
            if (userPasswordCheckContainer) userPasswordCheckContainer.style.display = 'none';
            if (passwordCheckAlert) passwordCheckAlert.style.display = 'none';
        }
    } catch (e) { /* ignore */ }

    // Settings/Profile Update Logic
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsModal = document.getElementById('settingsModal');
    const settingsForm = document.getElementById('settingsForm');
    const settingsError = document.getElementById('settingsError');

    // Show settings icon only for logged-in users (not admin)
    try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('/auth/session', token ? { headers: { 'Authorization': 'Bearer ' + token } } : {});
        const data = await res.json();
        if (data.loggedIn && !data.user.isAdmin) {
            settingsIcon.style.display = '';
        } else {
            settingsIcon.style.display = 'none';
        }
    } catch (e) { settingsIcon && (settingsIcon.style.display = 'none'); }

    if (settingsIcon && settingsModal && settingsForm) {
        settingsIcon.onclick = function() {
            settingsModal.style.display = 'block';
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            settingsForm.reset();
            settingsError.textContent = '';
        };
    }
    window.hideSettings = function() {
        settingsModal.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        settingsForm.reset();
        settingsError.textContent = '';
    };
    if (settingsForm) {
        settingsForm.onsubmit = async function(e) {
            e.preventDefault();
            const fullname = document.getElementById('settings-name').value.trim();
            const email = document.getElementById('settings-email').value.trim();
            const password = document.getElementById('settings-password').value.trim();
            if (!fullname && !email && !password) {
                settingsError.textContent = 'Input fields are empty.';
                return;
            }
            settingsError.textContent = '';
            const res = await fetch('/auth/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password })
            });
            const result = await res.json();
            if (result.success) {
                settingsError.style.color = '#4caf50';
                settingsError.textContent = 'Profile updated successfully!';
                setTimeout(() => { hideSettings(); window.location.reload(); }, 1000);
            } else {
                settingsError.style.color = '#ff4d4d';
                settingsError.textContent = result.error || 'Update failed.';
            }
        };
    }
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
    const loginForm = document.querySelector(".auth-form[action='/auth/login']");
    if (loginForm) {
        loginForm.reset();
    }
}

function hideLogin() {
    document.getElementById("loginModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
    document.body.style.overflow = ""; // Restore scrolling
}

async function sendEmail() {
    let parms = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        subject: document.getElementById('subject').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    // Remove any previous message
    let msgDiv = document.getElementById('emailStatusMsg');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'emailStatusMsg';
        msgDiv.style.marginTop = '1rem';
        document.getElementById('contactForm').appendChild(msgDiv);
    }
    msgDiv.textContent = '';
    msgDiv.style.display = 'none';

    // Field validation
    if (!parms.name || !parms.email || !parms.subject || !parms.message) {
        msgDiv.textContent = 'Please fill in all fields.';
        msgDiv.style.color = '#fff';
        msgDiv.style.background = '#dc3545';
        msgDiv.style.padding = '0.75rem 1rem';
        msgDiv.style.borderRadius = '6px';
        msgDiv.style.display = 'block';
        return;
    }

    // Email validation using AbstractAPI
    const isValid = await verifyEmailWithAbstractAPI(parms.email);
    if (!isValid) {
        msgDiv.textContent = 'Please enter a valid, deliverable email address.';
        msgDiv.style.color = '#fff';
        msgDiv.style.background = '#dc3545';
        msgDiv.style.padding = '0.75rem 1rem';
        msgDiv.style.borderRadius = '6px';
        msgDiv.style.display = 'block';
        return;
    }

    emailjs.send('service_i2kr0da', "template_tdhf15i", parms)
        .then(function() {
            msgDiv.textContent = 'Email sent successfully!';
            msgDiv.style.color = '#fff';
            msgDiv.style.background = '#28a745';
            msgDiv.style.padding = '0.75rem 1rem';
            msgDiv.style.borderRadius = '6px';
            msgDiv.style.display = 'block';
        }, function(error) {
            msgDiv.textContent = 'Failed to send email. Please try again.';
            msgDiv.style.color = '#fff';
            msgDiv.style.background = '#dc3545';
            msgDiv.style.padding = '0.75rem 1rem';
            msgDiv.style.borderRadius = '6px';
            msgDiv.style.display = 'block';
        });
}
