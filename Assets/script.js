// Loading screen functionality
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 500);
    }
});

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('hidden');
    });

    // Close the menu when a link is clicked
    navLinks.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            navLinks.classList.add('hidden');
        }
    });
}

// "Go to Top" button functionality
const goTopBtn = document.getElementById("goTopBtn");

if (goTopBtn) {
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            goTopBtn.style.display = "flex";
        } else {
            goTopBtn.style.display = "none";
        }
    });

    goTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden-animate');
hiddenElements.forEach((el) => observer.observe(el));

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const htmlEl = document.documentElement;

// Function to toggle theme
const toggleTheme = () => {
    htmlEl.classList.toggle('dark');
    const isDarkMode = htmlEl.classList.contains('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateIcon(isDarkMode);
};

// Function to update icon
const updateIcon = (isDarkMode) => {
    const icon = isDarkMode ? 'fa-moon' : 'fa-sun';
    if (themeToggle) {
        themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
    }
};

// Check for saved theme in local storage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    htmlEl.classList.add('dark');
    updateIcon(true);
} else {
    updateIcon(false);
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleTheme);
}

// Vertical Scroll Navigation
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-item');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5 // Trigger when 50% of the section is visible
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            navItems.forEach(item => {
                const dot = item.querySelector('.nav-dot');
                if (item.getAttribute('data-section') === sectionId) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    sectionObserver.observe(section);
});
