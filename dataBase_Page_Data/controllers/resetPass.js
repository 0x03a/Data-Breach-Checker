document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".background-elements");
    const interactiveElements = [...document.querySelectorAll("form, input, textarea, button, select")]; // Cached for performance

    function createElement(type, left, top, duration) {
        let element = document.createElement("div");
        element.classList.add(type);
        element.style.position = "absolute";
        element.style.left = left + "px";
        element.style.top = top + "px";
        element.style.animationDuration = duration + "s";

        if (type === "circle") {
            element.style.borderRadius = "50%";

            let size = 3; // Fixed size
            element.style.width = size + "px";
            element.style.height = size + "px";

            animateFloating(element, true);
        }

        return element;
    }

    // Batch insert elements using a document fragment for performance
    function generateElements() {
        let fragment = document.createDocumentFragment();

        for (let i = 0; i < 200; i++) {
            fragment.appendChild(createElement("circle", Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 10 + 5));
        }

        container.appendChild(fragment);
    }

    generateElements();

    function animateFloating(element, changeColor) {
        let x = parseFloat(element.style.left);
        let y = parseFloat(element.style.top);
        let speedX = (Math.random() - 0.5) * 6; // Adjusted for faster movement (-3 to 3)
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
});


// reset form validation
// Only AbstractAPI or no email validation here. Remove regex/manual validation.
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("form[action='send-reset-link.php']").addEventListener("submit", async function (event) {
        const email = document.getElementById("email").value.trim();

        // AbstractAPI Email Validation
        const ABSTRACTAPI_KEY = 'f659f97cd12947d3aad411565c4538ce';
        async function verifyEmailWithAbstractAPI(email) {
            try {
                const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACTAPI_KEY}&email=${encodeURIComponent(email)}`;
                const response = await fetch(url);
                if (!response.ok) {
                    alert('Email validation service error.');
                    event.preventDefault();
                    return false;
                }
                const data = await response.json();
                if (data.deliverability !== 'DELIVERABLE') {
                    alert('Please enter a valid, deliverable email address.');
                    event.preventDefault();
                    return false;
                }
                return true;
            } catch (e) {
                alert('Email validation exception.');
                event.preventDefault();
                return false;
            }
        }
        await verifyEmailWithAbstractAPI(email);
    });
});
