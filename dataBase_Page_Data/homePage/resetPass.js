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

// reset form validation
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form[action='send-reset-link.php']").addEventListener("submit", function (event) {
        const email = document.getElementById("email").value.trim();

        // Regex for email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // Email validation
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address (e.g., user@example.com).");
            event.preventDefault();
            return false;
        }

        return true; // If validation passes
    });
});
