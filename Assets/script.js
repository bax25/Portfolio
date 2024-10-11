// Loading screen functionality
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Delay for 2 seconds before starting the fade out
        setTimeout(() => {
            // Fade out the loading screen
            loadingScreen.style.opacity = '0'; // Start fading out
            setTimeout(() => {
                loadingScreen.style.display = 'none'; // Hide it after fade out
            }, 500); // Match this with the CSS transition duration
        }, 500); // Delay time in milliseconds
    }
});


// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', function() {
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            navLinks.classList.toggle('show'); // Toggle the "show" class on the nav links
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// "Go to Top" button functionality
const goTopBtn = document.getElementById("goTopBtn");

if (goTopBtn) {
    // Show the button when the user scrolls down 200px from the top of the document
    window.onscroll = function() { scrollFunction(); };

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
