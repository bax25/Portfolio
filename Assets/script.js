/**
 * @file script.js
 * @description Main JavaScript file for the portfolio website.
 * @version 2.0.0
 *
 * @changelog
 * - v2.0.0 (2025-07-27)
 *   - Refactored entire script for robustness, performance, and maintainability.
 *   - Added comprehensive JSDoc comments.
 *   - Implemented a full suite of fixes based on a detailed audit.
 *
 * @manual_test_checklist
 * --------------------------------------------------------------------------------
 * 1.  Theme Toggle:
 *     [ ] Verify theme toggle button works on both desktop and mobile.
 *     [ ] Check that icons (sun/moon) update correctly.
 *     [ ] Confirm theme persists after page reload (localStorage).
 *     [ ] Test system theme preference change (e.g., change OS theme).
 *
 * 2.  Scroll Behavior:
 *     [ ] Verify smooth scrolling for all navigation links (header, mobile, footer).
 *     [ ] Check that the "Go to Top" button appears on scroll and works correctly.
 *     [ ] Ensure scroll-triggered animations activate as elements enter the viewport.
 *     [ ] Test scroll performance; it should be smooth without jank.
 *
 * 3.  Navigation Active State:
 *     [ ] Confirm the active navigation item (desktop vertical nav) highlights correctly as you scroll through sections.
 *     [ ] Check that the active track indicator moves smoothly to the correct position.
 *     [ ] Verify the active link in the mobile menu is styled correctly (bold, colored).
 *
 * 4.  Mobile Menu:
 *     [ ] Test opening and closing the menu with the hamburger/close icons.
 *     [ ] Verify the menu closes when a navigation link is clicked.
 *     [ ] Check that the menu closes when clicking the overlay (outside the menu content).
 *     [ ] Test closing the menu with the 'Escape' key.
 *     [ ] Confirm ARIA attributes (`aria-expanded`) update correctly.
 *
 * 5.  Error Handling & Fallbacks:
 *     [ ] Manually disable JavaScript and verify the site is still usable.
 *     [ ] Use an older browser or simulator to check fallbacks for IntersectionObserver.
 *     [ ] Check the console for any errors during interaction.
 *
 * 6.  Loading Screen:
 *     [ ] Verify the loading screen appears on page load and fades out smoothly.
 * --------------------------------------------------------------------------------
 */

// =================================================================================
// Utility Functions
// =================================================================================

/**
 * Throttles a function to limit its execution rate.
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The throttle duration in milliseconds.
 * @returns {Function} The throttled function.
 */
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}; // FIXED: Added throttling to improve scroll performance

// =================================================================================
// Feature Initialization
// =================================================================================

/**
 * Initializes all features when the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    // FIXED: Reorganized code into logical sections with clear separators
    initLoadingScreen();
    initTheme();
    initMobileMenu();
    initGoToTopButton();
    initSmoothScrolling();
    initScrollAnimations();
    initNavObserver();
});

// =================================================================================
// Loading Screen
// =================================================================================

/**
 * Initializes the loading screen functionality.
 */
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    // FIXED: Added null checking for DOM elements
    if (!loadingScreen) {
        console.error('Error: Loading screen element not found.');
        return;
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500); // Corresponds to transition duration
        }, 500); // A brief delay to prevent flash of content
    });
}


// =================================================================================
// Dark Mode Theme Toggle
// =================================================================================

/**
 * Initializes theme functionality including toggle and system preference listener.
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    // FIXED: Added feature detection for modern APIs (localStorage)
    if (typeof Storage === 'undefined') {
        console.warn('Warning: localStorage is not supported. Theme persistence is disabled.');
        if (themeToggle) themeToggle.style.display = 'none';
        if (themeToggleMobile) themeToggleMobile.style.display = 'none';
        return;
    }

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme based on saved preference or system setting
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(systemPrefersDark ? 'dark' : 'light');
    }

    // FIXED: Added try-catch blocks around critical functions
    try {
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener('click', toggleTheme);
        }

        // FIXED: Add system preference change listener for automatic theme switching
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            console.log('System theme preference changed.');
            setTheme(e.matches ? 'dark' : 'light');
        });
    } catch (error) {
        console.error('Error setting up theme toggle:', error);
    }
}

/**
 * Toggles the current theme between 'light' and 'dark'.
 */
function toggleTheme() {
    const htmlEl = document.documentElement;
    const isDarkMode = htmlEl.classList.contains('dark');
    setTheme(isDarkMode ? 'light' : 'dark');
    // FIXED: Added temporary console.log statements for debugging key functions
    console.log(`Theme toggled to: ${isDarkMode ? 'light' : 'dark'}`);
}

/**
 * Sets the theme and updates the DOM and localStorage.
 * @param {string} theme - The theme to set ('dark' or 'light').
 */
const setTheme = (theme) => {
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);

    // Update all dark icons
    document.querySelectorAll('[id*="dark-icon"]').forEach(icon => {
        if (icon) icon.classList.toggle('hidden', !isDark);
    });

    // Update all light icons
    document.querySelectorAll('[id*="light-icon"]').forEach(icon => {
        if (icon) icon.classList.toggle('hidden', isDark);
    });

    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error('Error saving theme to localStorage:', error);
    }
};


// =================================================================================
// Mobile Menu
// =================================================================================

/**
 * Initializes the mobile hamburger menu functionality.
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu');

    // FIXED: Added null checking for DOM elements
    if (!hamburger || !mobileMenu || !closeMenuBtn) {
        console.error('Error: Mobile menu elements not found.');
        return;
    }

    const mobileMenuContent = mobileMenu.querySelector('div');

    const openMenu = () => {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        if (mobileMenuContent) mobileMenuContent.classList.remove('translate-x-full');
        // FIXED: Add aria-expanded attributes for accessibility
        hamburger.setAttribute('aria-expanded', 'true');
        // FIXED: Ensure proper focus management when opening/closing menu
        closeMenuBtn.focus();
    };

    const closeMenu = () => {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        if (mobileMenuContent) mobileMenuContent.classList.add('translate-x-full');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
    };

    hamburger.addEventListener('click', openMenu);
    closeMenuBtn.addEventListener('click', closeMenu);

    // Close menu when a link is clicked
    mobileMenu.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            closeMenu();
        }
    });

    // Close menu when clicking the overlay
    mobileMenu.addEventListener('click', (event) => {
        if (event.target === mobileMenu) {
            closeMenu();
        }
    });

    // FIXED: Add keyboard navigation support (Escape key to close menu)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
            closeMenu();
        }
    });
}


// =================================================================================
// "Go to Top" Button
// =================================================================================

/**
 * Initializes the "Go to Top" button functionality.
 */
function initGoToTopButton() {
    const goTopBtn = document.getElementById('goTopBtn');

    if (!goTopBtn) {
        console.error('Error: "Go to Top" button not found.');
        return;
    }

    const handleScroll = () => {
        // Use requestAnimationFrame for smoother UI updates
        window.requestAnimationFrame(() => {
            if (window.scrollY > window.innerHeight * 0.2) {
                goTopBtn.style.display = 'flex';
            } else {
                goTopBtn.style.display = 'none';
            }
        });
    };

    // Apply throttling to the scroll listener
    window.addEventListener('scroll', throttle(handleScroll, 100));

    goTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


// =================================================================================
// Smooth Scrolling
// =================================================================================

/**
 * Initializes smooth scrolling for all anchor links starting with '#'.
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            // FIXED: Replace direct property access with safe property checking
            const targetElement = targetId === '#' ? document.body : document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                console.warn(`Warning: Smooth scroll target not found for id: ${targetId}`);
            }
        });
    });
}


// =================================================================================
// Scroll Animations
// =================================================================================

/**
 * Initializes scroll-triggered animations using IntersectionObserver.
 */
function initScrollAnimations() {
    // FIXED: Add fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
        console.warn('Warning: IntersectionObserver is not supported. Scroll animations disabled.');
        // Show all elements immediately as a fallback
        document.querySelectorAll('.hidden-animate').forEach(el => el.classList.add('show'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden-animate');
    hiddenElements.forEach((el) => observer.observe(el));
}


// =================================================================================
// Navigation Active State Observer
// =================================================================================

/**
 * Initializes the IntersectionObserver for highlighting the active navigation item.
 */
function initNavObserver() {
    // FIXED: Add fallback if IntersectionObserver is not supported
    if (!('IntersectionObserver' in window)) {
        console.warn('Warning: IntersectionObserver is not supported. Active navigation highlighting disabled.');
        return;
    }

    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const activeTrack = document.getElementById('active-track');

    if (sections.length === 0 || (navItems.length === 0 && mobileNavItems.length === 0)) {
        console.error('Error: Sections or navigation items for observer not found.');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5, // 50% of the section must be visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        try {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    // FIXED: Added temporary console.log statements for debugging key functions
                    console.log(`Intersecting section: #${sectionId}`);
                    updateActiveNav(sectionId, navItems, mobileNavItems, activeTrack);
                }
            });
        } catch (error) {
            console.error('Error in section observer callback:', error);
        }
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * Updates the active state for both desktop and mobile navigation.
 * @param {string} sectionId - The ID of the currently active section.
 * @param {NodeListOf<Element>} navItems - Desktop navigation items.
 * @param {NodeListOf<Element>} mobileNavItems - Mobile navigation items.
 * @param {HTMLElement} activeTrack - The desktop navigation active state indicator.
 */
function updateActiveNav(sectionId, navItems, mobileNavItems, activeTrack) {
    let activeIndex = -1;

    // Update Desktop Navigation
    navItems.forEach((item, index) => {
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
            activeIndex = index;
        } else {
            item.classList.remove('active');
        }
    });

    // Update active track position with bounds checking
    if (activeTrack && activeIndex !== -1) {
        const activeNavItem = navItems[activeIndex];
        // FIXED: Fix activeTrack positioning with proper bounds checking
        if (activeNavItem) {
            const topPosition = activeNavItem.offsetTop + (activeNavItem.offsetHeight / 2) - (activeTrack.offsetHeight / 2);
            activeTrack.style.top = `${topPosition}px`;
        }
    }

    // Update Mobile Navigation
    mobileNavItems.forEach(item => {
        // FIXED: Verify mobile navigation active states use correct class combinations
        if (item.getAttribute('href') === `#${sectionId}`) {
            // FIXED: Updated class references to match Tailwind config
            item.classList.add('text-primary-light', 'dark:text-primary-dark', 'font-bold');
        } else {
            item.classList.remove('text-primary-light', 'dark:text-primary-dark', 'font-bold');
        }
    });
}
