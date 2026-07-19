document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    // 1. Navbar scroll
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 80);
        updateActiveNav();
    });

    // 2. Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    allNavLinks.forEach(link => link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    }));

    // 3. Active nav link
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
        });
        allNavLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    // 4. Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Intersection Observer — reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

    // 6. Skill progress bars — animate on scroll
    const stackSection = document.getElementById('stack');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-bar-fill');
                bars.forEach(bar => {
                    const percent = bar.getAttribute('data-percent');
                    bar.style.width = percent + '%';
                });
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    if (stackSection) progressObserver.observe(stackSection);

    // 7. Stagger service cards
    const backendSection = document.getElementById('backend');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.service-card');
                cards.forEach((card, i) => {
                    setTimeout(() => card.classList.add('is-visible'), i * 100);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    if (backendSection) cardObserver.observe(backendSection);

    // 8. Typing animation
    const roles = ['Android Developer', 'Kotlin Specialist', 'Firebase Expert'];
    const typedEl = document.getElementById('typed-text');
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        const current = roles[roleIndex];
        if (!isDeleting) {
            typedEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(typeEffect, 1800);
                return;
            }
            setTimeout(typeEffect, 80);
        } else {
            typedEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(typeEffect, 400);
                return;
            }
            setTimeout(typeEffect, 40);
        }
    }
    if (typedEl) setTimeout(typeEffect, 500);

    // 9. GA4 Event Tracking
    // REPLACE G-XXXXXXXXXX with your actual Measurement ID from GA4.
    // 9.1. Resume Downloads Tracking
    document.querySelectorAll('a[href*="-resume.pdf"]').forEach(link => {
        link.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'download_resume', {
                    'file_name': 'muhammad-saad-android-developer-resume.pdf',
                    'link_text': 'Download Resume'
                });
            }
        });
    });

    // 9.2. Project Views Tracking
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', function() {
            const projectName = this.closest('.project-item').querySelector('h3').textContent;
            const actionType = this.textContent.includes('GITHUB') ? 'github_view' : 'apk_download';
            if (typeof gtag === 'function') {
                gtag('event', 'project_interaction', {
                    'project_name': projectName,
                    'interaction_type': actionType,
                    'link_url': this.href
                });
            }
        });
    });

    // 9.3. Contact CTA and Social Links Clicks
    document.querySelectorAll('.contact-box, .hero-social a').forEach(link => {
        link.addEventListener('click', function() {
            const label = this.querySelector('.cb-label') ? this.querySelector('.cb-label').textContent : this.textContent;
            if (typeof gtag === 'function') {
                gtag('event', 'contact_interaction', {
                    'contact_channel': label,
                    'link_url': this.href
                });
            }
        });
    });

    // 9.4. Form Submission Tracking
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'contact_form_submit', {
                    'contact_type': 'Portfolio Contact Form'
                });
            }
        });
    }

    // 9.5. Scroll Depth Tracking (25%, 50%, 75%, 100%)
    let scrolledDepths = new Set();
    window.addEventListener('scroll', () => {
        const h = document.documentElement,
              b = document.body,
              st = 'scrollTop',
              sh = 'scrollHeight';
        const percent = Math.round((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100);
        
        [25, 50, 75, 100].forEach(threshold => {
            if (percent >= threshold && !scrolledDepths.has(threshold)) {
                scrolledDepths.add(threshold);
                if (typeof gtag === 'function') {
                    gtag('event', 'scroll_depth', {
                        'depth_percentage': threshold
                    });
                }
            }
        });
    });

    // 9.6. Web-Vitals Real User Monitoring (RUM) Tracking
    import('https://unpkg.com/web-vitals@4/dist/web-vitals.attribution.js?module').then(({ onCLS, onFID, onLCP, onFCP, onINP }) => {
        function sendToGA4({ name, delta, id }) {
            if (typeof gtag === 'function') {
                gtag('event', name, {
                    'value': Math.round(name === 'CLS' ? delta * 1000 : delta),
                    'metric_id': id,
                    'non_interaction': true
                });
            }
        }
        onCLS(sendToGA4);
        onFID(sendToGA4);
        onLCP(sendToGA4);
        onFCP(sendToGA4);
        onINP(sendToGA4);
    }).catch(err => console.log("Web-vitals load skipped or failed."));

    // 10. Project Share Buttons Interaction
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const projectUrl = this.getAttribute('data-url');
            navigator.clipboard.writeText(projectUrl).then(() => {
                const originalText = this.textContent;
                this.textContent = 'COPIED!';
                setTimeout(() => this.textContent = originalText, 2000);
                if (typeof gtag === 'function') {
                    gtag('event', 'share_project', {
                        'project_url': projectUrl
                    });
                }
            }).catch(err => {
                console.error('Failed to copy link: ', err);
            });
        });
    });
});
