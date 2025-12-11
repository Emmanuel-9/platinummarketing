// ===== Scroll Progress Bar =====
function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    document.getElementById('scroll-progress').style.width = scrollPercent + '%';
}

window.addEventListener('scroll', updateScrollProgress);

// ===== Sticky Header Effect =====
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== Dark Mode Toggle =====
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const btn = document.getElementById('theme-toggle');
    btn.textContent = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const btn = document.getElementById('theme-toggle');
    if (btn) {
        btn.textContent = savedTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
});

// ===== Scroll Animation Observer =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});

// ===== Animated Counter for Statistics =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString();
        }
    }, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
            });
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.getElementById('statistics');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// ===== Testimonials Carousel =====
let currentTestimonial = 0;
let testimonialInterval;

function showTestimonial(index) {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.testimonial-slide');
    
    if (!track || !slides.length) return;
    
    // Wrap around
    if (index >= slides.length) currentTestimonial = 0;
    else if (index < 0) currentTestimonial = slides.length - 1;
    else currentTestimonial = index;
    
    track.style.transform = `translateX(-${currentTestimonial * 100}%)`;
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentTestimonial);
    });
}

function nextTestimonial() {
    showTestimonial(currentTestimonial + 1);
}

function startTestimonialAutoplay() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

function stopTestimonialAutoplay() {
    clearInterval(testimonialInterval);
}

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        // Initialize dots click handlers
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopTestimonialAutoplay();
                showTestimonial(index);
                startTestimonialAutoplay();
            });
        });
        
        // Start autoplay
        startTestimonialAutoplay();
        
        // Pause on hover
        carousel.addEventListener('mouseenter', stopTestimonialAutoplay);
        carousel.addEventListener('mouseleave', startTestimonialAutoplay);
    }
});

// ===== Newsletter Form Handler =====
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Store in localStorage (in production, send to backend)
            const newsletters = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
            if (!newsletters.includes(email)) {
                newsletters.push(email);
                localStorage.setItem('newsletter-subscribers', JSON.stringify(newsletters));
            }
            
            alert('Thank you for subscribing! 🎉');
            this.querySelector('input[type="email"]').value = '';
        });
    }
});

// ===== Lead Form Handler (Enhanced) =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const message = document.getElementById('lead-message').value;
            
            // Store lead data
            const leads = JSON.parse(localStorage.getItem('leads') || '[]');
            leads.push({
                name: name,
                email: email,
                message: message,
                date: new Date().toLocaleString()
            });
            localStorage.setItem('leads', JSON.stringify(leads));
            
            // Show confirmation
            document.getElementById('lead-confirmation').style.display = 'block';
            
            // Reset form
            this.reset();
            
            // Hide confirmation after 3 seconds
            setTimeout(() => {
                document.getElementById('lead-confirmation').style.display = 'none';
            }, 3000);
        });
    }
});

// ===== Admin Panel - Load Leads =====
function loadLeads() {
    const leads = JSON.parse(localStorage.getItem('leads') || '[]');
    const tbody = document.querySelector('#leads-table tbody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    leads.forEach(lead => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td style="padding:8px; border-bottom:1px solid #444;">${lead.name}</td>
            <td style="padding:8px; border-bottom:1px solid #444;">${lead.email}</td>
            <td style="padding:8px; border-bottom:1px solid #444;">${lead.message}</td>
            <td style="padding:8px; border-bottom:1px solid #444;">${lead.date}</td>
        `;
    });
}

// ===== Export Leads to CSV =====
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('export-leads');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const leads = JSON.parse(localStorage.getItem('leads') || '[]');
            
            if (leads.length === 0) {
                alert('No leads to export');
                return;
            }
            
            let csv = 'Name,Email,Message,Date\n';
            leads.forEach(lead => {
                csv += `"${lead.name}","${lead.email}","${lead.message}","${lead.date}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'leads_' + new Date().toISOString().split('T')[0] + '.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        });
    }
});

// ===== Admin Login Enhancement =====
window.showAdminLeads = function() {
    const password = prompt('Enter admin password:');
    if (password === 'admin123') {
        const adminSection = document.getElementById('admin-leads');
        if (adminSection) {
            adminSection.style.display = 'block';
            loadLeads();
            // Smooth scroll to admin section
            adminSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else if (password) {
        alert('Incorrect password.');
    }
};

// ===== Smooth Scroll for Navigation Links =====
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#home') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== Initialize all animations on load =====
window.addEventListener('load', function() {
    // Add fade-in class to main sections
    document.querySelectorAll('section').forEach(section => {
        if (!section.id.includes('admin')) {
            section.classList.add('fade-in');
        }
    });
    
    // Re-observe elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
});
