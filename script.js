// Scroll-based video switching and animations
let currentVideoIndex = 1;
let lastScrollY = 0;
let ticking = false;

const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const videoContainer = document.getElementById('videoContainer');
const staticBg = document.getElementById('staticBg');
const navbar = document.querySelector('.navbar');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

// Preload second video
video2.load();

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const spans = mobileMenuToggle.querySelectorAll('span');

    if (mobileMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(7px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Scroll handler for video switching and animations
function handleScroll() {
    lastScrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateVideoAndAnimations();
            ticking = false;
        });
        ticking = true;
    }
}

function updateVideoAndAnimations() {
    const scrollY = lastScrollY;
    const windowHeight = window.innerHeight;

    // Navbar scroll effect
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Video switching logic
    // First screen (0 - 1vh): video1
    // Second screen (1vh - 2vh): video2
    // After 2vh: fade to static background

    if (scrollY < windowHeight * 0.8) {
        // First screen - show video1
        if (currentVideoIndex !== 1) {
            switchToVideo(1);
        }
        videoContainer.style.opacity = '1';
        staticBg.classList.remove('active');
    } else if (scrollY >= windowHeight * 0.8 && scrollY < windowHeight * 1.8) {
        // Second screen - show video2
        if (currentVideoIndex !== 2) {
            switchToVideo(2);
        }
        videoContainer.style.opacity = '1';
        staticBg.classList.remove('active');
    } else {
        // After second screen - fade to static background
        const fadeStart = windowHeight * 1.8;
        const fadeEnd = windowHeight * 2.2;
        const fadeProgress = Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart));

        videoContainer.style.opacity = 1 - fadeProgress;

        if (fadeProgress > 0.3) {
            staticBg.classList.add('active');
        }
    }

    // Scroll animations for elements
    animateOnScroll();
}

function switchToVideo(index) {
    currentVideoIndex = index;

    if (index === 1) {
        video1.classList.add('active');
        video2.classList.remove('active');
        video1.play().catch(e => console.log('Video 1 play failed:', e));
        video2.pause();
    } else if (index === 2) {
        video2.classList.add('active');
        video1.classList.remove('active');
        video2.play().catch(e => console.log('Video 2 play failed:', e));
        video1.pause();
    }
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

function animateOnScroll() {
    // Feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 100);
        }
    });

    // Product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            setTimeout(() => {
                card.classList.add('visible');
            }, index * 80);
        }
    });

    // Generic scroll animations
    document.querySelectorAll('.scroll-animate').forEach(element => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            element.classList.add('visible');
        }
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize
window.addEventListener('scroll', handleScroll, { passive: true });
window.addEventListener('load', () => {
    // Start first video
    video1.play().catch(e => console.log('Initial video play failed:', e));

    // Initial animation check
    updateVideoAndAnimations();

    // Add scroll animate class to sections
    document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
        el.classList.add('scroll-animate');
    });
});

// Handle video errors gracefully
video1.addEventListener('error', (e) => {
    console.error('Video 1 error:', e);
    // Fallback to static background if video fails
    videoContainer.style.display = 'none';
    staticBg.classList.add('active');
});

video2.addEventListener('error', (e) => {
    console.error('Video 2 error:', e);
});

// Parallax effect for decorative elements
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const octopus = document.querySelector('.octopus-decoration');
    const watermark = document.querySelector('.brand-watermark');

    if (octopus) {
        octopus.style.transform = `rotate(-15deg) translateY(${scrolled * 0.1}px)`;
    }

    if (watermark) {
        watermark.style.transform = `translate(-50%, -50%) rotate(-3deg) translateY(${scrolled * 0.05}px)`;
    }
}, { passive: true });

// Add stagger animation to hero stats
window.addEventListener('load', () => {
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';

        setTimeout(() => {
            stat.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 1000 + (index * 150));
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = entry.target.querySelector('.stat-value');
            const text = value.textContent;

            // Extract number from text like "2,500+" or "99.8%"
            const match = text.match(/[\d,\.]+/);
            if (match) {
                const number = parseFloat(match[0].replace(',', ''));
                const suffix = text.replace(match[0], '');

                let current = 0;
                const duration = 2000;
                const increment = number / (duration / 16);

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        if (text.includes('.')) {
                            value.textContent = number.toFixed(1) + suffix;
                        } else if (text.includes(',')) {
                            value.textContent = Math.floor(number).toLocaleString() + suffix;
                        } else {
                            value.textContent = Math.floor(number) + suffix;
                        }
                        clearInterval(timer);
                    } else {
                        if (text.includes('.')) {
                            value.textContent = current.toFixed(1) + suffix;
                        } else if (text.includes(',')) {
                            value.textContent = Math.floor(current).toLocaleString() + suffix;
                        } else {
                            value.textContent = Math.floor(current) + suffix;
                        }
                    }
                }, 16);

                statsObserver.unobserve(entry.target);
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Add hover effect to product cards
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.product-image');
        icon.style.transform = 'scale(1.1) rotate(5deg)';
        icon.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    });

    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.product-image');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add click handlers for buy buttons
document.querySelectorAll('.btn-buy').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();

        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';

        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);

        // Show alert (replace with actual purchase logic)
        setTimeout(() => {
            alert('Функция покупки будет доступна в ближайшее время! 🎮');
        }, 300);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: pause videos when not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        video1.pause();
        video2.pause();
    } else {
        if (currentVideoIndex === 1) {
            video1.play().catch(e => console.log('Resume video 1 failed:', e));
        } else if (currentVideoIndex === 2) {
            video2.play().catch(e => console.log('Resume video 2 failed:', e));
        }
    }
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
