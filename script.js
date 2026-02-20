// Diabetes Compass - Interactive Home Page
document.addEventListener('DOMContentLoaded', function () {

    // Diabetes Facts Banner Functionality
    const diabetesFacts = [
        "Over 422 million people worldwide have diabetes, and this number is rapidly increasing every year.",
        "Type 2 diabetes accounts for about 90% of all diabetes cases and can often be prevented through healthy lifestyle choices.",
        "Regular physical activity can reduce the risk of developing type 2 diabetes by up to 58%.",
        "People with diabetes have a 2-4 times higher risk of heart disease, making cardiovascular care crucial.",
        "Early detection and proper management can help prevent or delay diabetes complications significantly."
    ];

    let currentFactIndex = 0;
    let factInterval;

    const factElement = document.getElementById('diabetes-fact');
    const prevBtn = document.getElementById('prev-fact');
    const nextBtn = document.getElementById('next-fact');
    const indicators = document.querySelectorAll('.indicator');

    function updateFact(index) {
        if (factElement) {
            currentFactIndex = index;
            factElement.style.opacity = '0.5';

            setTimeout(() => {
                factElement.textContent = diabetesFacts[currentFactIndex];
                factElement.style.opacity = '1';
            }, 250);

            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentFactIndex);
            });
        }
    }

    function nextFact() {
        const nextIndex = (currentFactIndex + 1) % diabetesFacts.length;
        updateFact(nextIndex);
    }

    function prevFact() {
        const prevIndex = (currentFactIndex - 1 + diabetesFacts.length) % diabetesFacts.length;
        updateFact(prevIndex);
    }

    function startAutoRotation() {
        factInterval = setInterval(nextFact, 5000); // Change fact every 5 seconds
    }

    function stopAutoRotation() {
        if (factInterval) {
            clearInterval(factInterval);
        }
    }

    // Initialize banner if elements exist
    if (factElement) {
        updateFact(0);
        startAutoRotation();

        // Add event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoRotation();
                nextFact();
                startAutoRotation();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoRotation();
                prevFact();
                startAutoRotation();
            });
        }

        // Indicator click events
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                stopAutoRotation();
                updateFact(index);
                startAutoRotation();
            });
        });

        // Pause auto-rotation on hover
        const banner = document.querySelector('.did-you-know-banner');
        if (banner) {
            banner.addEventListener('mouseenter', stopAutoRotation);
            banner.addEventListener('mouseleave', startAutoRotation);
        }
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to tiles when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initialize tile animations
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        tile.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(tile);
    });

    // Add tile click tracking for analytics (optional)
    tiles.forEach(tile => {
        tile.addEventListener('click', function () {
            const tileTitle = this.querySelector('h3').textContent;
            console.log(`Tile clicked: ${tileTitle}`);

            // You can add analytics tracking here
            // Example: gtag('event', 'tile_click', { 'tile_name': tileTitle });
        });
    });

    // Add loading state management
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
        }
    });

    document.addEventListener('mousedown', function (e) {
        document.body.classList.remove('user-is-tabbing');
    });

    // Add responsive menu toggle for future navigation
    function addMobileMenuToggle() {
        const header = document.querySelector('header');
        if (window.innerWidth <= 768 && !header.querySelector('.mobile-menu-toggle')) {
            // Placeholder for future mobile menu implementation
            console.log('Mobile view detected - ready for mobile navigation');
        }
    }

    // Check for mobile view on load and resize
    addMobileMenuToggle();
    window.addEventListener('resize', addMobileMenuToggle);

    // Add error handling for missing images (both tile images and icons)
    document.querySelectorAll('.tile-icon img').forEach(img => {
        img.addEventListener('error', function () {
            // Create a fallback icon using CSS
            const icon = this.parentElement;
            icon.innerHTML = '<div class="fallback-icon">📋</div>';
            icon.querySelector('.fallback-icon').style.fontSize = '40px';
        });
    });

    // Add error handling for tile images
    document.querySelectorAll('.tile-image img').forEach(img => {
        img.addEventListener('error', function () {
            // Create a fallback gradient background
            const imageContainer = this.parentElement;
            imageContainer.style.background = 'linear-gradient(135deg, #3498db, #2980b9)';
            imageContainer.innerHTML = '<div class="fallback-text" style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-weight:bold;">Image Unavailable</div>';
        });

        // Add subtle loading effect
        img.addEventListener('load', function () {
            this.style.opacity = '1';
        });

        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '0';
    });

    // Add hover effects for better user experience
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        tile.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });
    });

    // Initialize tile focus management for accessibility
    tiles.forEach((tile, index) => {
        const link = tile.querySelector('.tile-link');
        link.setAttribute('tabindex', index + 1);

        link.addEventListener('focus', function () {
            tile.classList.add('tile-focused');
        });

        link.addEventListener('blur', function () {
            tile.classList.remove('tile-focused');
        });
    });

});