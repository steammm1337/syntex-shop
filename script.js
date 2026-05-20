// Particles animation
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationFrameId;
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(0, 102, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    if (isReducedMotion) return;

    particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    if (isReducedMotion) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    animationFrameId = requestAnimationFrame(animateParticles);
}

// Initialize particles
resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Pause particles when tab is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    } else {
        animateParticles();
    }
});

// Modal and form handling
const modal = document.getElementById('purchaseModal');
const modalClose = document.getElementById('modalClose');
const purchaseForm = document.getElementById('purchaseForm');
const telegramInput = document.getElementById('telegramInput');
const modalProductInfo = document.getElementById('modalProductInfo');

let currentProduct = {
    name: '',
    price: '',
    icon: ''
};

// Open modal when buy button clicked
document.querySelectorAll('.btn-buy').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();

        const card = this.closest('.product-card');
        const productName = card.querySelector('.product-name').textContent;
        const productPrice = card.querySelector('.product-price').textContent;
        const productIconSvg = card.querySelector('.product-image svg').cloneNode(true);

        currentProduct = {
            name: productName,
            price: productPrice,
            icon: productIconSvg
        };

        // Update modal content
        const modalIconContainer = modalProductInfo.querySelector('.product-info-icon');
        modalIconContainer.innerHTML = '';
        modalIconContainer.appendChild(productIconSvg);
        modalProductInfo.querySelector('.product-info-name').textContent = productName;
        modalProductInfo.querySelector('.product-info-price').textContent = productPrice;

        // Open modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus input
        setTimeout(() => telegramInput.focus(), 300);
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    purchaseForm.reset();
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Handle form submission
purchaseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const telegram = telegramInput.value.trim();

    if (!telegram) {
        telegramInput.focus();
        return;
    }

    // Show success message
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 2rem 0;">
            <div style="width: 80px; height: 80px; margin: 0 auto 1.5rem; display: flex; align-items: center; justify-content: center;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; color: var(--color-black); margin-bottom: 1rem;">
                Заявка отправлена!
            </h3>
            <p style="color: var(--color-gray-600); margin-bottom: 2rem;">
                Мы свяжемся с вами в Telegram <strong>@${telegram}</strong> в ближайшее время для завершения покупки.
            </p>
            <button class="btn btn-primary" onclick="document.getElementById('modalClose').click()">
                Вернуться в магазин
            </button>
        </div>
    `;

    // Log to console (replace with actual API call)
    console.log('Order submitted:', {
        product: currentProduct,
        telegram: telegram,
        timestamp: new Date().toISOString()
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.querySelector('.navbar');

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

// Scroll handler for navbar and animations
let lastScrollY = 0;
let ticking = false;

function handleScroll() {
    lastScrollY = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateAnimations();
            ticking = false;
        });
        ticking = true;
    }
}

function updateAnimations() {
    const scrollY = lastScrollY;

    // Navbar scroll effect
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll animations for elements
    animateOnScroll();
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            // Add stagger delay based on data attribute or index
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);
        }
    });
}, observerOptions);

// Observe all animatable elements
function initScrollAnimations() {
    // Feature cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.dataset.delay = index * 100;
        animationObserver.observe(card);
    });

    // Product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.dataset.delay = index * 80;
        animationObserver.observe(card);
    });

    // Generic scroll animations
    document.querySelectorAll('.scroll-animate').forEach(element => {
        animationObserver.observe(element);
    });

    // Contact cards
    document.querySelectorAll('.contact-card').forEach((card, index) => {
        card.dataset.delay = index * 100;
        animationObserver.observe(card);
    });
}

function animateOnScroll() {
    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.feature-card, .product-card, .scroll-animate, .contact-card').forEach(element => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight * 0.8 && !element.classList.contains('visible')) {
                element.classList.add('visible');
            }
        });
    }
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
    // Initial animation check
    updateAnimations();

    // Add scroll animate class to sections
    document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
        el.classList.add('scroll-animate');
    });

    // Initialize scroll animations with IntersectionObserver
    initScrollAnimations();

    // Animate hero stats on load
    const stats = document.querySelectorAll('.stat-item');
    stats.forEach((stat, index) => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';

        setTimeout(() => {
            stat.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 300 + (index * 150));
    });
});

// Parallax effect for decorative elements
let parallaxTicking = false;

window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const octopus = document.querySelector('.octopus-decoration');
            const watermark = document.querySelector('.brand-watermark');

            if (octopus) {
                octopus.style.transform = `rotate(-15deg) translateY(${scrolled * 0.1}px)`;
            }

            if (watermark) {
                watermark.style.transform = `translate(-50%, -50%) rotate(-3deg) translateY(${scrolled * 0.05}px)`;
            }

            parallaxTicking = false;
        });
        parallaxTicking = true;
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
        }, 300 + (index * 150));
    });
});
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, 1000 + (index * 150));
    });
});

// Counter animation for stats
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

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animation = 'none';
        el.style.transition = 'none';
    });
}
