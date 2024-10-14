// Loading screen functionality
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const fadeOutDuration = 500; // Configurable fade-out duration in milliseconds
    const delayBeforeFade = 500; // Configurable delay before starting the fade out

    if (loadingScreen) {
        // Delay before starting the fade out
        setTimeout(() => {
            // Fade out the loading screen
            loadingScreen.style.opacity = '0'; // Start fading out
            setTimeout(() => {
                loadingScreen.style.display = 'none'; // Hide it after fade out
            }, fadeOutDuration); // Match this with the CSS transition duration
        }, delayBeforeFade);
    }
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Toggle the mobile menu when the hamburger is clicked
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
    const isClickInsideNav = navLinks.contains(event.target);
    const isClickInsideHamburger = hamburger.contains(event.target);

    if (!isClickInsideNav && !isClickInsideHamburger) {
        navLinks.classList.remove('active');
    }
});

// Close the menu when a link is clicked
navLinks.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
        navLinks.classList.remove('active');
    }
});

// "Go to Top" button functionality
const goTopBtn = document.getElementById("goTopBtn");

if (goTopBtn) {
    // Show the button when the user scrolls down 200px from the top of the document
    window.addEventListener('scroll', debounce(scrollFunction, 100));

    function scrollFunction() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            goTopBtn.style.display = "block"; // Show button
        } else {
            goTopBtn.style.display = "none"; // Hide button
        }
    }

    // Function to scroll to the top of the page
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scroll to top
    }

    // Scroll to the top when the button is clicked
    goTopBtn.addEventListener("click", scrollToTop);
}

// Debounce function to improve performance on scroll events
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}
