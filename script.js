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
        const productIcon = card.querySelector('.product-image').textContent;

        currentProduct = {
            name: productName,
            price: productPrice,
            icon: productIcon
        };

        // Update modal content
        modalProductInfo.querySelector('.product-info-icon').textContent = productIcon;
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
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
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
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

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
    // Initial animation check
    updateAnimations();

    // Add scroll animate class to sections
    document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
        el.classList.add('scroll-animate');
    });
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
