// ── Header: darken on scroll ──────────────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ── Hamburger menu toggle ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('active');
    const spans = hamburger.querySelectorAll('span');
    if (nav.classList.contains('open')) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
});

// Close nav when any link or CTA inside mobile nav is clicked
nav.querySelectorAll('.nav-link, .mobile-nav-cta').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.querySelectorAll('span').forEach(s => {
            s.style.transform = '';
            s.style.opacity = '';
        });
    });
});

// ── Count-up animation for stats ─────────────────────────────────
function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animateCountUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.floor(eased * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = prefix + target + suffix;
        }
    }

    requestAnimationFrame(update);
}

// Observe the stats section — fire once when it enters the viewport
const statsSection = document.getElementById('stats');
const countEls = document.querySelectorAll('.stat-num[data-target]');

if (statsSection && countEls.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countEls.forEach(el => animateCountUp(el));
                observer.disconnect(); // run only once
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

// ── Fade-up/Fade-right animation on scroll ───────────────────────
const fadeEls = document.querySelectorAll('.fade-up, .fade-right');

if (fadeEls.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target); // animate once
            }
        });
    }, { threshold: 0.2 });

    fadeEls.forEach(el => fadeObserver.observe(el));
}

// ── Vision / Mission tab switcher ────────────────────────────────
function switchTab(tab) {
    // Tabs
    document.getElementById('tabVision').classList.toggle('active', tab === 'vision');
    document.getElementById('tabMission').classList.toggle('active', tab === 'mission');
    // Panels
    document.getElementById('panelVision').classList.toggle('active', tab === 'vision');
    document.getElementById('panelMission').classList.toggle('active', tab === 'mission');
}

// ── Enquiry Popup Modal ───────────────────────────────────────────
const BROCHURE_URL  = 'https://drive.google.com/file/d/1E61NjRbVJLQFpGU9b0VROP7t_yoWTHnw/view?usp=sharing';

const enquireTab     = document.getElementById('enquireTab');
const enquiryOverlay = document.getElementById('enquiryOverlay');
const enquiryClose   = document.getElementById('enquiryClose');
const enquiryForm    = document.getElementById('enquiryForm');
const enquiryTitle   = document.getElementById('enquiryTitle');
const enquirySubtitle= document.getElementById('enquirySubtitle');
const enquirySubmit  = enquiryForm ? enquiryForm.querySelector('.enquiry-submit') : null;

let isBrochureMode = false;

function openEnquiry(brochureMode = false) {
    isBrochureMode = brochureMode;
    if (brochureMode) {
        enquiryTitle.textContent    = 'Download Brochure';
        enquirySubtitle.textContent = 'Share your details to receive the brochure. It will open instantly after submission.';
        enquirySubmit.textContent   = 'GET BROCHURE';
    } else {
        enquiryTitle.textContent    = 'Get in Touch';
        enquirySubtitle.textContent = 'Fill in the form below and our team will reach out to you shortly.';
        enquirySubmit.textContent   = 'SUBMIT ENQUIRY';
    }
    enquiryOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEnquiry() {
    enquiryOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Enquire Now floating tab → normal mode
if (enquireTab) enquireTab.addEventListener('click', () => openEnquiry(false));

// All "Download Brochure" buttons → brochure mode
document.querySelectorAll('.brochure-trigger').forEach(btn => {
    btn.addEventListener('click', () => openEnquiry(true));
});

// Close button
if (enquiryClose) enquiryClose.addEventListener('click', closeEnquiry);

// Close on backdrop click
if (enquiryOverlay) {
    enquiryOverlay.addEventListener('click', (e) => {
        if (e.target === enquiryOverlay) closeEnquiry();
    });
}

// Close with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && enquiryOverlay && enquiryOverlay.classList.contains('active')) {
        closeEnquiry();
    }
});

// Modal Form submit
if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('eq-name').value;
        const email = document.getElementById('eq-email').value;
        const phone = document.getElementById('eq-phone').value;
        const type = document.getElementById('eq-type').value;

        const message = `Hello, I am interested in Mahitha Green Botanica.\n\n*Enquiry Details:*\n• *Name:* ${name}\n• *Email:* ${email}\n• *Phone:* ${phone}\n• *Flat Type:* ${type}`;
        
        const whatsappUrl = `https://wa.me/919755341818?text=${encodeURIComponent(message)}`;

        const btn = enquiryForm.querySelector('.enquiry-submit');
        btn.textContent = '✓ Done! Opening WhatsApp...';
        btn.disabled = true;

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            if (isBrochureMode) {
                window.open(BROCHURE_URL, '_blank');
            }
            closeEnquiry();
            enquiryForm.reset();
            btn.textContent = isBrochureMode ? 'GET BROCHURE' : 'SUBMIT ENQUIRY';
            btn.disabled = false;
        }, 1000);
    });
}

// Main Contact Section Form submit
const mainContactForm = document.getElementById('mainContactForm');
if (mainContactForm) {
    mainContactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('c-name').value;
        const email = document.getElementById('c-email').value;
        const phone = document.getElementById('c-phone').value;
        const type = document.getElementById('c-type').value;

        const message = `Hello, I am interested in Mahitha Green Botanica.\n\n*Contact Form Enquiry:*\n• *Name:* ${name}\n• *Email:* ${email}\n• *Phone:* ${phone}\n• *Flat Type:* ${type}`;
        
        const whatsappUrl = `https://wa.me/919755341818?text=${encodeURIComponent(message)}`;

        const btn = mainContactForm.querySelector('.submit-btn');
        btn.textContent = '✓ Done! Opening WhatsApp...';
        btn.disabled = true;

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            mainContactForm.reset();
            btn.textContent = 'SUBMIT ENQUIRY';
            btn.disabled = false;
        }, 1000);
    });
}
