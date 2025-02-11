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
            element.style.fontSize = "30px";
            element.style.opacity = Math.random() * 0.5 + 0.5;
            animateSpiderWeb(element); // Unique floating movement
        } else if (type === "circle") {
            element.style.borderRadius = "50%";

            // Assign random size: 10px, 15px, or 20px
            let sizeOptions = [10, 15, 20];
            let size = sizeOptions[Math.floor(Math.random() * sizeOptions.length)];
            element.style.width = size + "px";
            element.style.height = size + "px";

            animateFloating(element, true); // Floating effect for circles
        }

        container.appendChild(element);
    }

    // Generate Circles
    for (let i = 0; i < 70; i++) {
        createElement("circle", Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 10 + 5);
    }

    // Generate Spider Webs
    for (let i = 0; i < 3; i++) {
        createElement("spider-web", Math.random() * window.innerWidth, Math.random() * window.innerHeight, Math.random() * 10 + 5);
    }

    // Animate Floating Effect for Circles
    function animateFloating(element, changeColor) {
        let x = parseFloat(element.style.left);
        let y = parseFloat(element.style.top);
        let speedX = (Math.random() - 0.5) * 2; // Reduced to smoother movement
        let speedY = (Math.random() - 0.5) * 2;

        function move() {
            x += speedX;
            y += speedY;

            // Bounce back within the viewport
            if (x < 0 || x > window.innerWidth - parseFloat(element.style.width)) speedX *= -1;
            if (y < 0 || y > window.innerHeight - parseFloat(element.style.height)) speedY *= -1;

            element.style.left = x + "px";
            element.style.top = y + "px";

            // Change circle color dynamically
            if (changeColor) {
                let red = Math.floor((x / window.innerWidth) * 255);
                let green = Math.floor((y / window.innerHeight) * 255);
                let blue = 255 - Math.floor(((x + y) / (window.innerWidth + window.innerHeight)) * 255);
                element.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, 0.5)`;
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
window.addEventListener("scroll", function() {
    const footer = document.querySelector("footer");
    let scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        // User is scrolling down, show footer
        footer.style.bottom = "0";
    } else {
        // User is scrolling up, hide footer
        footer.style.bottom = "-60px";
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative values
});

