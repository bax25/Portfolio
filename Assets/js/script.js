/**
 * @file script.js
 * @description Main JavaScript file for the portfolio website.
 * @version 2.1.0
 *
 * @changelog
 * - v2.1.0 (2025-07-29)
 *   - Hardened dark mode implementation
 *   - Re-enabled system preference detection (matchMedia) for initial load
 *   - Theme now prioritizes localStorage, then system preference, then defaults to light
 *   - Added FOUC prevention support
 *
 * @manual_test_checklist
 * --------------------------------------------------------------------------------
 * 1.  Theme Toggle:
 *     [ ] Verify theme toggle button works on both desktop and mobile.
 *     [ ] Check that icons (sun/moon) update correctly.
 *     [ ] Confirm theme persists after page reload (localStorage).
 *
 * 2.  Initial Theme Load:
 *     [ ] Verify that if no theme is saved, the site respects the system's theme preference.
 *     [ ] Verify that if a theme is saved, it overrides the system preference.
 *
 * 3.  FOUC Prevention:
 *     [ ] Page loads with correct theme immediately (no flash).
 *     [ ] Works even on slow connections.
 *
 * 4.  Fallback Behavior:
 *     [ ] When JavaScript disabled, site defaults to light mode.
 *     [ ] Toggle buttons are hidden when localStorage not supported.
 * --------------------------------------------------------------------------------
 */


// =================================================================================
// Feature Initialization
// =================================================================================


/**
 * Initializes all features when the DOM is ready.
 */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileMenu();
    initGoToTopButton();
    initSmoothScrolling();
    initNavObserver();
    initHeroAnimations(); // Initialize hero animations including fade-in and typing effect
    initLoadingScreen(); // Initialize loading screen
    initParallaxEffect(); // Initialize parallax layered image effect

    // Add a small delay for scroll and skill animations to ensure elements are rendered
    setTimeout(() => {
        console.log('[DOMContentLoaded] Initializing scroll and skill animations...');
        initScrollAnimations(); // Initialize scroll animations for sections
        initSkillAnimations(); // Initialize skill animations
        triggerAnimationsForVisibleElements(); // Trigger animations for elements already in view on load
    }, 100); // 100ms delay
});


// =================================================================================
// Dark Mode Theme Toggle (System Preference & Persistence)
// =================================================================================


/**
 * Initializes theme functionality.
 * Prioritizes: 1. localStorage saved theme, 2. System preference, 3. Default to 'light'.
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');

    // Determine initial theme
    let initialTheme = 'light'; // Default theme

    // Check if localStorage is supported and get saved theme
    if (typeof Storage !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            initialTheme = savedTheme;
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // If no saved theme, check system preference
            initialTheme = 'dark';
        }
    } else {
        console.warn('Warning: localStorage is not supported. Theme persistence and system preference detection are disabled.');
        if (themeToggle) themeToggle.style.display = 'none';
        if (themeToggleMobile) themeToggleMobile.style.display = 'none';
        // If localStorage is not supported, we default to light theme and hide toggles
        setTheme(initialTheme);
        return;
    }

    // Apply the determined initial theme
    setTheme(initialTheme);
    console.log(`Theme initialized to: ${initialTheme}`);

    // Add event listeners to toggle buttons
    try {
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
        if (themeToggleMobile) {
            themeToggleMobile.addEventListener('click', toggleTheme);
        }
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
    const newTheme = isDarkMode ? 'light' : 'dark';

    // Animate the icon before changing theme
    const currentToggle = this; // 'this' refers to the button clicked
    if (currentToggle) {
        currentToggle.classList.add('rotate-scale');
        currentToggle.addEventListener('transitionend', () => {
            setTheme(newTheme);
            currentToggle.classList.remove('rotate-scale');
        }, { once: true });
    } else {
        setTheme(newTheme); // Fallback if 'this' is not available
    }
    console.log(`Theme toggled to: ${newTheme}`);
}


/**
 * Sets the theme and updates the DOM, icons, and localStorage.
 * @param {string} theme - The theme to set ('dark' or 'light').
 */
const setTheme = (theme) => {
    const isDark = theme === 'dark';

    // Update document class
    document.documentElement.classList.toggle('dark', isDark);

    // Update desktop theme toggle icons
    const desktopDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const desktopLightIcon = document.getElementById('theme-toggle-light-icon');

    if (desktopDarkIcon) {
        desktopDarkIcon.classList.toggle('hidden', !isDark);
        desktopDarkIcon.classList.toggle('block', isDark);
    }
    if (desktopLightIcon) {
        desktopLightIcon.classList.toggle('hidden', isDark);
        desktopLightIcon.classList.toggle('block', !isDark);
    }

    // Update mobile theme toggle icons  
    const mobileDarkIcon = document.getElementById('theme-toggle-dark-icon-mobile');
    const mobileLightIcon = document.getElementById('theme-toggle-light-icon-mobile');

    if (mobileDarkIcon) {
        mobileDarkIcon.classList.toggle('hidden', !isDark);
        mobileDarkIcon.classList.toggle('block', isDark);
    }
    if (mobileLightIcon) {
        mobileLightIcon.classList.toggle('hidden', isDark);
        mobileLightIcon.classList.toggle('block', !isDark);
    }

    // Save to localStorage
    try {
        localStorage.setItem('theme', theme);
    } catch (error) {
        console.error('Error saving theme to localStorage:', error);
    }
};


// =================================================================================
// Hero Section Animations (Fade-in and Typing Effect)
// =================================================================================
/**
 * Typing effect that loops through multiple lines with type and erase animation.
 */
function initHeroAnimations() {
    const heroTagline = document.getElementById('hero-tagline');
    const typingEffectSpan = heroTagline?.querySelector('.typing-effect');

    const lines = [
        "ML Engineer & Innovator",
        "Building Intelligent Systems",
        "Turning Data into Insights"
    ];

    if (!heroTagline || !typingEffectSpan) {
        console.error('Error: Hero section or typing effect span not found.');
        return;
    }

    if (typingEffectSpan.dataset.typingInitialized === "true") return;
    typingEffectSpan.dataset.typingInitialized = "true";

    typingEffectSpan.textContent = '';
    typingEffectSpan.classList.add('typing-cursor');

    let lineIndex = 0;
    let charIndex = 0;
    let typing = true; // true = typing, false = erasing

    const TYPING_SPEED = 100;      // ms per character
    const ERASING_SPEED = 75;      // ms per character when deleting
    const PAUSE_AFTER_TYPING = 1500; // ms to pause when a line finishes

    function typeLoop() {
        const currentText = lines[lineIndex];

        if (typing) {
            // Typing forward
            if (charIndex < currentText.length) {
                typingEffectSpan.textContent += currentText.charAt(charIndex);
                charIndex++;
                setTimeout(typeLoop, TYPING_SPEED);
            } else {
                typing = false;
                setTimeout(typeLoop, PAUSE_AFTER_TYPING);
            }
        } else {
            // Erasing
            if (charIndex > 0) {
                typingEffectSpan.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                setTimeout(typeLoop, ERASING_SPEED);
            } else {
                // Move to next line
                typing = true;
                lineIndex = (lineIndex + 1) % lines.length;
                setTimeout(typeLoop, TYPING_SPEED);
            }
        }
    }

    // Start the loop after small delay
    setTimeout(typeLoop, 1000);
}


// =================================================================================
// Scroll Animations for Sections
// =================================================================================

/**
 * Initializes IntersectionObserver for sections to trigger fade-in and slide-in animations on scroll.
 */
function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
        console.warn('Warning: IntersectionObserver is not supported for scroll animations.');
        return;
    }

    const animatedElements = document.querySelectorAll('.project-card.hidden-animate, .section-animate.hidden-animate');

    if (animatedElements.length === 0) {
        console.warn('[Scroll Animation] No elements found with .project-card.hidden-animate or .section-animate.hidden-animate. Scroll animations will not run.');
        return;
    }

    const observerOptions = {
        root: null, // viewport
        rootMargin: '-88px 0px 0px 0px', // Adjusted rootMargin to account for fixed header on mobile
        threshold: 0.5 // Trigger when 50% of the element is visible, more responsive for mobile
    };

    console.log('[Scroll Animation] Initializing scroll animations...');
    console.log('[Scroll Animation] Found animated elements:', animatedElements.length, animatedElements); // Log the actual elements

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            console.log(`[Scroll Animation] Observer entry for: ${entry.target.id || entry.target.className} (isIntersecting: ${entry.isIntersecting}, intersectionRatio: ${entry.intersectionRatio})`);
            if (entry.isIntersecting) {
                console.log(`[Scroll Animation] Element intersecting: ${entry.target.id || entry.target.className}. Adding 'show' class.`);
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Stop observing once animated
            } else {
                // This else block might not be hit often if elements are already in view or quickly scrolled past
                // It's useful for debugging if elements are unexpectedly not intersecting
                console.log(`[Scroll Animation] Element not intersecting: ${entry.target.id || entry.target.className}.`);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// =================================================================================
// Loading Screen
// =================================================================================

/**
 * Initializes the loading screen functionality.
 * Hides the loading screen once the entire page (including assets) has loaded,
 * or after a minimum of 0.5 seconds, whichever comes last.
 */
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) {
        console.error('Error: Loading screen element not found.');
        return;
    }

    let minTimePassed = false;
    let pageLoaded = false;
    let hidden = false; // Flag to ensure hide() is called only once

    const checkAndHide = () => {
        if (minTimePassed && pageLoaded && !hidden) {
            hidden = true;
            // Immediately remove loading-active class from body to show content
            document.body.classList.remove('loading-active');

            if (loadingScreen) {
                loadingScreen.classList.add('hidden'); // Trigger fade-out and hide
                // Remove from DOM after the transition duration (0.7s as per CSS)
                setTimeout(() => {
                    loadingScreen.remove();
                }, 700); // Match the CSS transition duration for opacity
            }
        }
    };

    // Set minTimePassed after 0.7 seconds
    setTimeout(() => {
        minTimePassed = true;
        checkAndHide();
    }, 700); // 0.7 seconds minimum

    // Set pageLoaded when the entire page (including assets) has loaded
    window.addEventListener('load', () => {
        pageLoaded = true;
        checkAndHide();
    });
}


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

    if (!hamburger || !mobileMenu || !closeMenuBtn) {
        console.error('Error: Mobile menu elements not found.');
        return;
    }

    const mobileMenuContent = mobileMenu.querySelector('div');

    const openMenu = () => {
        mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
        if (mobileMenuContent) mobileMenuContent.classList.remove('translate-x-full');
        hamburger.setAttribute('aria-expanded', 'true');
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

    // Close menu with Escape key
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
 * Initializes the "Go to Top" button functionality with spinner animation.
 */
/**
 * Initializes the "Go to Top" button functionality with animated loader.
 */
function initGoToTopButton() {
    const goTopBtn = document.getElementById('goTopBtn');

    if (!goTopBtn) {
        console.error('Error: "Go to Top" button not found.');
        return;
    }

    const handleScroll = () => {
        window.requestAnimationFrame(() => {
            // Only hide when at the very top
            if (window.scrollY === 0) {
                goTopBtn.style.display = 'none';
                goTopBtn.classList.remove('loading');
            } else {
                goTopBtn.style.display = 'flex';
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    goTopBtn.addEventListener('click', () => {
        goTopBtn.classList.add('loading'); // Start loading animation

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        const checkIfAtTop = setInterval(() => {
            if (window.scrollY === 0) {
                clearInterval(checkIfAtTop);
                goTopBtn.classList.remove('loading'); // Stop loading when top reached
                goTopBtn.style.display = 'none';       // Finally hide the button
            }
        }, 50);
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
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = targetId === '#' ? document.body : document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // After smooth scroll, trigger animations for newly visible elements
                // A small delay is needed because scrollIntoView is asynchronous and animations might not trigger immediately
                setTimeout(() => {
                    triggerAnimationsForVisibleElements();
                }, 500); // Adjust delay as needed, 500ms is a common safe value
            } else {
                console.warn(`Warning: Smooth scroll target not found for id: ${targetId}`);
            }
        });
    });
}


// ================================
// Navigation Active State Observer
// ================================

function initNavObserver() {
    if (!('IntersectionObserver' in window)) {
        console.warn('Warning: IntersectionObserver is not supported.');
        return;
    }

    const sections = document.querySelectorAll('section[data-section]');
    const navItems = document.querySelectorAll('.nav-item');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const activeTrack = document.getElementById('active-track');
    const navContainer = document.getElementById('vertical-nav'); // Ensure present if using activeTrack

    if (!sections.length || (!navItems.length && !mobileNavItems.length)) {
        console.error('No sections or navigation items found.');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '-88px 0px 0px 0px', // Adjusted rootMargin to account for the full height of the fixed mobile header (approx. 88px)
        threshold: 0.1, // Adjusted threshold to 10% for more responsive active state detection
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        // Only pick the first visible section (avoid multiple active sections)
        const visible = entries
            .filter(entry => entry.isIntersecting)
            // Sort so the highest section in view is selected if there is overlap
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
            updateActiveNav(
                visible[0].target.id,
                navItems,
                mobileNavItems,
                activeTrack,
                navContainer
            );
        }
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

function updateActiveNav(sectionId, navItems, mobileNavItems, activeTrack, navContainer) {
    let activeIndex = -1;

    // Desktop: Set "active" class and find activeIndex
    navItems.forEach((item, index) => {
        const targetSectionId = item.getAttribute('data-section');
        if (targetSectionId === sectionId) {
            item.classList.add('active');
            activeIndex = index;
        } else {
            item.classList.remove('active');
        }
    });

    // Desktop: Move the indicator ("track") to the active nav item
    if (activeTrack && navContainer && activeIndex !== -1) {
        const activeNavItem = navItems[activeIndex];
        const navDot = activeNavItem.querySelector('.nav-dot');
        if (navDot) {
            // Calculate the center of the nav-dot relative to its parent container (vertical-nav)
            const navDotCenter = navDot.offsetTop + navDot.offsetHeight / 2;
            // Calculate the top position for the active-track to center it vertically with the nav-dot
            const activeTrackTop = navDotCenter - activeTrack.offsetHeight / 2;
            activeTrack.style.transform = `translateY(${activeTrackTop}px)`;
            activeTrack.style.opacity = '1';
        }
    } else if (activeTrack) {
        activeTrack.style.opacity = '0';
    }

    // Mobile: highlight active
    mobileNavItems.forEach(item => {
        const targetHref = item.getAttribute('href');
        // Accept both '#sectionId' and '#sectionId ' (in case of URL decode)
        if (targetHref === `#${sectionId}`) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// =================================================================================
// Helper for Triggering Animations on Scroll/Navigation
// =================================================================================

/**
 * Manually checks visibility of animated elements and triggers their 'show' class.
 * This is useful after smooth scrolling to ensure elements brought into view are animated.
 */
function triggerAnimationsForVisibleElements() {
    const animatedElements = document.querySelectorAll('.project-card.hidden-animate, .section-animate.hidden-animate');
    const skillItems = document.querySelectorAll('.skill-item');

    const checkVisibilityAndAnimate = (elements, threshold = 0.1) => {
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            // Check if element is in viewport based on threshold
            const isVisible = (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
                rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) * threshold
            );

            if (isVisible && !element.classList.contains('show')) {
                console.log(`[triggerAnimationsForVisibleElements] Element visible: ${element.id || element.className}. Adding 'show' class.`);
                // For skill items, respect the delay
                if (element.classList.contains('skill-item')) {
                    const delay = parseInt(element.dataset.animationDelay || '0', 10);
                    setTimeout(() => {
                        element.classList.add('show');
                    }, delay);
                } else {
                    element.classList.add('show');
                }
            }
        });
    };

    // Use different thresholds for sections/projects and skills if needed, or a common one
    checkVisibilityAndAnimate(animatedElements, 0.3); // Use 0.3 threshold for sections/projects
    checkVisibilityAndAnimate(skillItems, 0.1); // Use 0.1 threshold for skills
}


// =================================================================================
// Skill Animations (Slide-in effect)
// =================================================================================

/**
 * Initializes IntersectionObserver for skill items to trigger slide-in animations on scroll.
 */
function initSkillAnimations() {
    if (!('IntersectionObserver' in window)) {
        console.warn('Warning: IntersectionObserver is not supported for skill animations.');
        return;
    }

    const skillItems = document.querySelectorAll('.skill-item');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the skill item is visible
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.animationDelay || '0', 10);
                console.log(`[Skill Animation] Skill item intersecting: ${entry.target.textContent.trim()}. Adding 'show' class with delay ${delay}ms.`);
                setTimeout(() => {
                    entry.target.classList.add('show');
                }, delay);
                observer.unobserve(entry.target); // Stop observing once animated
            } else {
                console.log(`[Skill Animation] Skill item not intersecting: ${entry.target.textContent.trim()}.`);
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
}


// =================================================================================
// Parallax Layered Image Effect
// =================================================================================

/**
 * Initializes the parallax effect for the layered profile image on mouse movement.
 */
function initParallaxEffect() {
    const parallaxContainer = document.getElementById('parallax-container');
    const parallaxBackground = document.getElementById('parallax-background');
    const parallaxForeground = document.getElementById('parallax-foreground');

    if (!parallaxContainer || !parallaxBackground || !parallaxForeground) {
        console.error('Error: Parallax elements not found for parallax effect.');
        return;
    }

    const parallaxEffect = (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = parallaxContainer.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate movement for background (slowest)
        const bgMoveX = ((clientX - centerX) / width) * 10; // Max 10px movement
        const bgMoveY = ((clientY - centerY) / height) * 10; // Max 10px movement

        // Calculate movement for foreground (fastest)
        const fgMoveX = ((clientX - centerX) / width) * 40; // Max 40px movement
        const fgMoveY = ((clientY - centerY) / height) * 40; // Max 40px movement

        parallaxBackground.style.transform = `translate(${bgMoveX}px, ${bgMoveY}px) scale(1.03)`;
        parallaxForeground.style.transform = `translate(${fgMoveX}px, ${fgMoveY}px) scale(1.15)`;
    };

    const resetParallax = () => {
        parallaxBackground.style.transform = 'translate(0px, 0px) scale(1.03)';
        parallaxForeground.style.transform = 'translate(0px, 0px) scale(1.15)';
    };

    parallaxContainer.addEventListener('mousemove', parallaxEffect);
    parallaxContainer.addEventListener('mouseleave', resetParallax);
}
