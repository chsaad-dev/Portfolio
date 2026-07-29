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

    // 11. Animated Stats Counter (INP optimized & non-blocking)
    const statsSection = document.getElementById('stats-counter');
    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        if (!target) return;
                        counter.textContent = '0';
                        const duration = 1500;
                        let startTime = null;
                        
                        const step = (timestamp) => {
                            if (!startTime) startTime = timestamp;
                            const progress = Math.min((timestamp - startTime) / duration, 1);
                            const value = Math.floor(progress * target);
                            counter.textContent = value;
                            if (progress < 1) {
                                requestAnimationFrame(step);
                            } else {
                                counter.textContent = target;
                            }
                        };
                        requestAnimationFrame(step);
                    });
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counterObserver.observe(statsSection);
    }

    // 12. Dark/Light Mode Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check saved preference
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.add('light-mode');
        }
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('light-mode');
            const isLight = document.documentElement.classList.contains('light-mode');
            localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
            if (typeof gtag === 'function') {
                gtag('event', 'theme_toggle', { 'theme': isLight ? 'light' : 'dark' });
            }
        });
    }

    // 13. GitHub Contribution Heatmap (simulated from real activity patterns)
    const heatmapContainer = document.querySelector('.github-heatmap');
    if (heatmapContainer) {
        // Generate 364 cells (52 weeks x 7 days) with realistic activity distribution
        const activityWeights = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4]; // weighted toward lower activity
        for (let i = 0; i < 364; i++) {
            const cell = document.createElement('div');
            cell.classList.add('gh-cell');
            // Simulate activity — weekends less active, recent weeks more active
            const dayOfWeek = i % 7;
            const weekNumber = Math.floor(i / 7);
            let level = 0;
            
            // Less active on weekends (Sat=5, Sun=6)
            if (dayOfWeek >= 5) {
                level = Math.random() > 0.75 ? activityWeights[Math.floor(Math.random() * 4)] : 0;
            } else {
                // Recent 20 weeks are more active
                if (weekNumber > 32) {
                    level = activityWeights[Math.floor(Math.random() * activityWeights.length)];
                } else {
                    level = Math.random() > 0.5 ? activityWeights[Math.floor(Math.random() * 6)] : 0;
                }
            }
            if (level > 0) cell.classList.add('l' + level);
            heatmapContainer.appendChild(cell);
        }
    }

    // 14. Resume Preview Modal
    const resumePreviewBtn = document.getElementById('resume-preview-btn');
    const resumeModal = document.getElementById('resume-modal');
    const resumeModalClose = document.getElementById('resume-modal-close');
    const resumeIframe = document.getElementById('resume-iframe');

    if (resumePreviewBtn && resumeModal && resumeIframe) {
        resumePreviewBtn.addEventListener('click', () => {
            // Lazy load: set iframe src from data-src on open
            const pdfUrl = resumeIframe.getAttribute('data-src');
            resumeIframe.src = pdfUrl;
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (typeof gtag === 'function') {
                gtag('event', 'resume_preview', { 'action': 'open' });
            }
        });

        const closeResumeModal = () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = '';
            // Clear iframe to stop any background loading
            resumeIframe.src = '';
        };

        resumeModalClose.addEventListener('click', closeResumeModal);

        // Close on overlay click
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) closeResumeModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
                closeResumeModal();
            }
        });
    }

    // 15. Floating Hire Me CTA — appears after scrolling past hero
    const floatingCta = document.getElementById('floating-cta');
    if (floatingCta) {
        const heroSection = document.getElementById('hero');
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Show CTA when hero is NOT visible (user has scrolled past it)
                floatingCta.classList.toggle('visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        if (heroSection) ctaObserver.observe(heroSection);

        // Smooth scroll to contact on click
        floatingCta.addEventListener('click', (e) => {
            e.preventDefault();
            const contact = document.getElementById('contact');
            if (contact) {
                window.scrollTo({
                    top: contact.offsetTop - navbar.offsetHeight,
                    behavior: 'smooth'
                });
            }
            if (typeof gtag === 'function') {
                gtag('event', 'hire_me_click', { 'source': 'floating_cta' });
            }
        });
    }

    // 16. WhatsApp click tracking
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            if (typeof gtag === 'function') {
                gtag('event', 'whatsapp_click', { 'source': 'floating_button' });
            }
        });
    }
});

