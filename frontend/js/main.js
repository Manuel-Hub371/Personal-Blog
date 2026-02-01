document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Initialize menu toggle icon
    if (menuToggle) {
        // Set initial icon (fallback to text if Lucide not loaded yet)
        if (!menuToggle.innerHTML.trim()) {
            menuToggle.innerHTML = '<i data-lucide="menu"></i>';
        }
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');

            // Update icon
            if (navLinks.classList.contains('active')) {
                menuToggle.innerHTML = '<i data-lucide="x"></i>';
            } else {
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
            }

            // Re-initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        // Close menu when clicking on a link
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.innerHTML = '<i data-lucide="menu"></i>';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }
            }
        });
    }

    // --- Theme Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.querySelector('.theme-toggle-mobile .theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleIcon(theme);
    };

    const updateToggleIcon = (theme) => {
        const iconHTML = theme === 'dark'
            ? '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707.707m12.728 0l-.707-.707M12 8a4 4 0 110 8 4 4 0 010-8z"></path></svg>'
            : '<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>';

        if (themeToggle) themeToggle.innerHTML = iconHTML;
        if (themeToggleMobile) themeToggleMobile.innerHTML = iconHTML;
    };

    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || (prefersDark.matches ? 'dark' : 'light');
    setTheme(savedTheme);

    // Desktop theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }


    // Mobile theme toggle - attach to the entire li element
    const themeToggleMobileContainer = document.getElementById('theme-toggle-mobile');
    if (themeToggleMobileContainer) {
        themeToggleMobileContainer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // Also attach to the button itself as backup
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // --- Header Scroll Effect ---
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('glass');
            header.style.padding = '12px 0';
        } else {
            header.classList.remove('glass');
            header.style.padding = '16px 0';
        }
    });

    // --- Reveal Animation on Scroll ---
    const revealItems = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(item => revealObserver.observe(item));
});

// Utility to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
