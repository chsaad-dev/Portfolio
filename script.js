document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const allNavLinks = document.querySelectorAll('.nav-links a');

    // 1. Navbar scroll & Active Nav link (RAF throttled & passive listener)
    const sections = Array.from(document.querySelectorAll('section[id]'));
    let scrollTicking = false;

    function handleScroll() {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                navbar.classList.toggle('scrolled', scrollY > 80);

                let current = '';
                for (let i = 0; i < sections.length; i++) {
                    const s = sections[i];
                    if (scrollY >= s.offsetTop - 200) current = s.id;
                }
                allNavLinks.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
                });
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Mobile menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        allNavLinks.forEach(link => link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }));
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

    // 5. Intersection Observer — reveal animations with depth & child staggering
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Stagger child elements on desktop only to avoid mobile layout thrashing
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && !window.matchMedia('(pointer: coarse)').matches) {
                    const staggerChildren = entry.target.querySelectorAll('.badge, .pill, .service-card, .stat-counter-box, .stat-box, .cert-item, .blog-card');
                    staggerChildren.forEach((child, idx) => {
                        child.style.transitionDelay = `${idx * 60}ms`;
                    });
                }

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
        revealObserver.observe(el);
    });

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

    // 9.4. Asynchronous AJAX Contact Form Submission with Web3Forms & Analytics
    const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('btn-submit');
    const submitBtnSpinner = document.getElementById('btn-spinner');
    const submitBtnText = document.getElementById('btn-text');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Track submission attempt
            if (typeof gtag === 'function') {
                gtag('event', 'contact_form_submit', {
                    'contact_type': 'Portfolio Contact Form'
                });
            }

            // Reset status
            if (formStatus) {
                formStatus.className = 'form-status';
                formStatus.style.display = 'none';
                formStatus.innerHTML = '';
            }

            // Button loading state
            if (submitBtn) submitBtn.disabled = true;
            if (submitBtnSpinner) submitBtnSpinner.style.display = 'inline-block';
            if (submitBtnText) submitBtnText.textContent = 'SENDING...';

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                });

                const result = await response.json();

                if (result.success) {
                    if (formStatus) {
                        formStatus.className = 'form-status success';
                        formStatus.innerHTML = '<span>&#10003; <strong>Message Sent!</strong> Thanks for reaching out. Saad will get back to you shortly.</span>';
                        formStatus.style.display = 'flex';
                    }
                    contactForm.reset();

                    if (typeof gtag === 'function') {
                        gtag('event', 'contact_form_success', {
                            'contact_type': 'Portfolio Contact Form'
                        });
                    }
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (err) {
                if (formStatus) {
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = '<span>&#9888; <strong>Error sending message.</strong> Please email directly at <a href="mailto:saaddevlabs@gmail.com" style="color: inherit; text-decoration: underline;">saaddevlabs@gmail.com</a></span>';
                    formStatus.style.display = 'flex';
                }

                if (typeof gtag === 'function') {
                    gtag('event', 'contact_form_error', {
                        'error_message': err.message || 'Network error'
                    });
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (submitBtnSpinner) submitBtnSpinner.style.display = 'none';
                if (submitBtnText) submitBtnText.innerHTML = 'SEND MESSAGE &rarr;';
            }
        });
    }

    // 9.5. Scroll Depth Tracking (25%, 50%, 75%, 100%) — passive listener
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
    }, { passive: true });

    // 9.6. Web-Vitals Real User Monitoring (RUM) Tracking (Deferred to idle / post-load)
    function initWebVitals() {
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
        }).catch(() => {});
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initWebVitals());
    } else {
        window.addEventListener('load', () => setTimeout(initWebVitals, 2500));
    }

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

    // 13. Live GitHub Activity & Contribution Heatmap (Batch created via DocumentFragment)
    function initHeatmap() {
        const heatmapContainer = document.querySelector('.github-heatmap');
        if (!heatmapContainer) return;
        const fragment = document.createDocumentFragment();
        const activityWeights = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 4];
        for (let i = 0; i < 364; i++) {
            const cell = document.createElement('div');
            cell.className = 'gh-cell';
            const dayOfWeek = i % 7;
            const weekNumber = Math.floor(i / 7);
            let level = 0;
            
            if (dayOfWeek >= 5) {
                level = Math.random() > 0.75 ? activityWeights[Math.floor(Math.random() * 4)] : 0;
            } else {
                if (weekNumber > 32) {
                    level = activityWeights[Math.floor(Math.random() * activityWeights.length)];
                } else {
                    level = Math.random() > 0.5 ? activityWeights[Math.floor(Math.random() * 6)] : 0;
                }
            }
            if (level > 0) cell.classList.add('l' + level);
            fragment.appendChild(cell);
        }
        heatmapContainer.appendChild(fragment);
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initHeatmap);
    } else {
        setTimeout(initHeatmap, 1000);
    }

    // Live GitHub Data Fetcher with LocalStorage Caching (20 min TTL)
    async function initLiveGitHub() {
        const repoTitleEl = document.getElementById('gh-repo-title');
        const repoDescEl = document.getElementById('gh-repo-desc');
        const repoLangEl = document.getElementById('gh-repo-lang');
        const repoLinkEl = document.getElementById('gh-card-link');
        const repoTimeEl = document.getElementById('gh-card-time');
        const statReposEl = document.getElementById('gh-stat-repos');
        const profileBtnEl = document.getElementById('gh-profile-btn');

        if (!repoTitleEl) return;

        function formatRelativeTime(dateStr) {
            if (!dateStr) return 'Recently';
            const diffMs = Date.now() - new Date(dateStr).getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHours / 24);
            if (diffHours < 1) return 'Just now';
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays === 1) return 'Yesterday';
            if (diffDays < 30) return `${diffDays}d ago`;
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }

        function applyGitHubData(data) {
            if (data.reposCount && statReposEl) {
                statReposEl.textContent = `${data.reposCount}`;
                if (profileBtnEl) profileBtnEl.textContent = `Explore ${data.reposCount} Repos on GitHub →`;
            }
            if (data.latestRepo) {
                repoTitleEl.textContent = data.latestRepo.fullName;
                repoTitleEl.href = data.latestRepo.url;
                if (data.latestRepo.desc) repoDescEl.textContent = data.latestRepo.desc;
                if (data.latestRepo.lang) repoLangEl.textContent = data.latestRepo.lang;
                if (repoLinkEl) repoLinkEl.href = data.latestRepo.url;
                if (repoTimeEl) repoTimeEl.textContent = `Updated ${formatRelativeTime(data.latestRepo.pushedAt)}`;
            }
        }

        const CACHE_KEY = 'saad_gh_activity_v1';
        const CACHE_TTL = 20 * 60 * 1000;
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Date.now() - parsed.timestamp < CACHE_TTL) {
                    applyGitHubData(parsed.data);
                    return;
                }
            }
        } catch (e) {}

        try {
            const [userRes, reposRes] = await Promise.all([
                fetch('https://api.github.com/users/chsaad-dev'),
                fetch('https://api.github.com/users/chsaad-dev/repos?sort=pushed&per_page=5')
            ]);

            if (userRes.ok && reposRes.ok) {
                const userData = await userRes.json();
                const reposData = await reposRes.json();

                let latestRepo = null;
                if (Array.isArray(reposData) && reposData.length > 0) {
                    const primary = reposData.find(r => !r.fork) || reposData[0];
                    latestRepo = {
                        fullName: primary.full_name,
                        url: primary.html_url,
                        desc: primary.description || 'Android application and open source development.',
                        lang: primary.language || 'Kotlin',
                        pushedAt: primary.pushed_at
                    };
                }

                const payload = {
                    reposCount: userData.public_repos || 9,
                    latestRepo
                };

                applyGitHubData(payload);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: payload }));
                } catch (e) {}
            }
        } catch (err) {
            console.debug('GitHub live sync deferred:', err);
        }
    }
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initLiveGitHub());
    } else {
        setTimeout(initLiveGitHub, 1500);
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

    // 17. 3D Card tilt-on-hover (subtle, restrained, professional)
    function initCardTilt() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(pointer: coarse)').matches) return; // Touch devices

        // Exclude project-item from 3D tilt (kept clean and grounded)
        const cards = document.querySelectorAll('.service-card, .testimonial-card, .edu-card');
        const MAX_ROTATION = 5; // ±5deg subtle clamp

        cards.forEach(card => {
            let rafId = null;

            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform, box-shadow';
                card.style.transition = 'transform 0.12s ease-out, box-shadow 0.12s ease-out, border-color 0.2s ease';
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const percentX = (x - centerX) / centerX;
                const percentY = (y - centerY) / centerY;

                const rotateX = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, -percentY * MAX_ROTATION));
                const rotateY = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, percentX * MAX_ROTATION));

                const shadowX = (-rotateY * 1.5).toFixed(1);
                const shadowY = (Math.abs(rotateX) * 2 + 6).toFixed(1);
                const shadowBlur = (18 + Math.abs(rotateX) * 2).toFixed(1);

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(0)`;
                card.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.22)`;
            });

            card.addEventListener('mouseleave', () => {
                if (rafId) cancelAnimationFrame(rafId);
                card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
                card.style.boxShadow = '';

                setTimeout(() => {
                    card.style.willChange = '';
                    card.style.transition = '';
                }, 400);
            });
        });
    }

    // 18. Hero subtle parallax
    function initHeroParallax() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const hero = document.getElementById('hero');
        const blob1 = document.querySelector('.hero-blob-1');
        const blob2 = document.querySelector('.hero-blob-2');
        if (!hero || (!blob1 && !blob2)) return;

        let rafId = null;
        hero.addEventListener('mousemove', (e) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                if (blob1) {
                    blob1.style.transform = `translate3d(${(-x * 12).toFixed(1)}px, ${(-y * 12).toFixed(1)}px, 0)`;
                }
                if (blob2) {
                    blob2.style.transform = `translate3d(${(x * 16).toFixed(1)}px, ${(y * 16).toFixed(1)}px, 0)`;
                }
            });
        });

        hero.addEventListener('mouseleave', () => {
            if (rafId) cancelAnimationFrame(rafId);
            if (blob1) blob1.style.transform = 'translate3d(0, 0, 0)';
            if (blob2) blob2.style.transform = 'translate3d(0, 0, 0)';
        });
    }

    // 19. Progressive Web App (PWA) — Service Worker Registration & Install Prompt
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then((reg) => {
                console.log('PWA ServiceWorker ready with scope:', reg.scope);
            }).catch((err) => {
                console.debug('PWA ServiceWorker notice:', err);
            });
        });
    }

    let deferredInstallPrompt = null;
    const pwaInstallBtn = document.getElementById('pwa-install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (pwaInstallBtn) {
            pwaInstallBtn.style.display = 'inline-flex';
        }
    });

    if (pwaInstallBtn) {
        pwaInstallBtn.addEventListener('click', async () => {
            if (!deferredInstallPrompt) return;
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                pwaInstallBtn.style.display = 'none';
                if (typeof gtag === 'function') {
                    gtag('event', 'pwa_installed', { outcome: 'accepted' });
                }
            }
            deferredInstallPrompt = null;
        });
    }

    window.addEventListener('appinstalled', () => {
        if (pwaInstallBtn) pwaInstallBtn.style.display = 'none';
        deferredInstallPrompt = null;
    });

    // 20. Project Screenshot Mobile Lightbox Gallery
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
    const lightboxNextBtn = document.getElementById('lightbox-next-btn');
    const lightboxBadge = document.getElementById('lightbox-badge');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxRepoLink = document.getElementById('lightbox-repo-link');
    const lightboxApkLink = document.getElementById('lightbox-apk-link');
    const lightboxDots = document.querySelectorAll('.lightbox-dot');

    const projectScreenshots = [
        {
            badge: "PROJECT 01 · TEAM LEAD FYP",
            title: "GiveEase — Verified Donation Platform",
            img: "/assets/giveease.jpeg",
            alt: "GiveEase Android donation app high resolution interface",
            caption: "Multi-role verified donation ecosystem built with Kotlin, Firebase Auth, Cloud Firestore, and real-time impact proofs.",
            github: "https://github.com/chsaad-dev/GiveEase",
            apk: "https://github.com/chsaad-dev/GiveEase/releases/download/v1.0/GiveEase.apk",
            apkLabel: "Download APK ↓"
        },
        {
            badge: "PROJECT 02 · PORTFOLIO PROJECT",
            title: "Dev-Journal — Developer Publishing & Community Platform",
            img: "/assets/dev-journal.jpeg",
            alt: "Dev-Journal Android developer publishing platform mobile app interface",
            caption: "Social publishing platform built with Kotlin, Jetpack Compose, Material3, MVVM Clean Architecture (46 use cases), Hilt, Cloud Firestore, Room, and serverless FCM push notifications.",
            github: "https://github.com/chsaad-dev/Dev-Journal-Android",
            apk: "https://github.com/chsaad-dev/Dev-Journal-Android/releases/tag/v1.0.0/Dev-Journal.apk",
            apkLabel: "Download APK ↓"
        },
        {
            badge: "PROJECT 03 · SOLE DEVELOPER & SYSTEM DESIGNER",
            title: "GupShup — Real-Time Android Messaging & Status App",
            img: "/assets/gupshup.jpeg",
            alt: "GupShup Android real-time messaging and social status app interface",
            caption: "Real-time messaging and status stories app featuring Room offline-first caching, dynamic notification channel versioning, and serverless JWT-signed FCM v1 dispatch.",
            github: "https://github.com/chsaad-dev/GupShup",
            apk: "https://github.com/chsaad-dev/GupShup/releases/download/v1.0.0/GupShup.apk",
            apkLabel: "Download APK ↓"
        },
        {
            badge: "PROJECT 04 · CROSS-PLATFORM ENGINEER",
            title: "NoteSync — Encrypted Cloud Sync Notes",
            img: "/assets/notesync.jpeg",
            alt: "NoteSync Flutter encrypted notes app high resolution interface",
            caption: "Offline-first notes application with biometric authentication, AES encryption, Isar local database, and Firebase sync.",
            github: "https://github.com/chsaad-dev/NoteSync",
            apk: null,
            apkLabel: null
        },
        {
            badge: "PROJECT 05 · PERSONAL PROJECT",
            title: "SpendWise — Offline Expense Tracker",
            img: "/assets/spendwise.jpeg",
            alt: "SpendWise Android expense tracker high resolution interface",
            caption: "Modern offline-first fintech expense tracker built with Jetpack Compose, Material 3, Room SQLite, and local PDF reports.",
            github: "https://github.com/chsaad-dev/SpendWise",
            apk: "https://github.com/chsaad-dev/SpendWise/releases/download/v1.0/SpendWise.apk",
            apkLabel: "Download APK ↓"
        }
    ];

    let currentProjectIndex = 0;

    function renderLightboxSlide(index) {
        if (index < 0 || index >= projectScreenshots.length) return;
        currentProjectIndex = index;
        const data = projectScreenshots[index];

        if (lightboxBadge) lightboxBadge.textContent = data.badge;
        if (lightboxTitle) lightboxTitle.textContent = data.title;
        if (lightboxCaption) lightboxCaption.textContent = data.caption;
        if (lightboxRepoLink) {
            lightboxRepoLink.href = data.github;
        }

        if (lightboxApkLink) {
            if (data.apk) {
                lightboxApkLink.href = data.apk;
                lightboxApkLink.textContent = data.apkLabel || "View →";
                lightboxApkLink.style.display = 'inline-flex';
                if (data.apk.endsWith('.apk')) {
                    lightboxApkLink.setAttribute('download', '');
                    lightboxApkLink.removeAttribute('target');
                } else {
                    lightboxApkLink.removeAttribute('download');
                    lightboxApkLink.setAttribute('target', '_blank');
                    lightboxApkLink.setAttribute('rel', 'noopener noreferrer');
                }
            } else {
                lightboxApkLink.style.display = 'none';
            }
        }

        if (lightboxImg) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = data.img;
                lightboxImg.alt = data.alt;
                lightboxImg.style.opacity = '1';
            }, 100);
        }

        lightboxDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        if (typeof gtag === 'function') {
            gtag('event', 'lightbox_view_project', {
                project_name: data.title,
                slide_index: index
            });
        }
    }

    function openLightbox(index) {
        if (!lightboxModal) return;
        renderLightboxSlide(index);
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Attach trigger clicks to Preview buttons and Mockups
    document.querySelectorAll('.btn-preview-screens, .project-mockup').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'a') return;
            const projectIdx = parseInt(el.getAttribute('data-project'), 10);
            if (!isNaN(projectIdx)) {
                openLightbox(projectIdx);
            }
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectIdx = parseInt(el.getAttribute('data-project'), 10);
                if (!isNaN(projectIdx)) {
                    openLightbox(projectIdx);
                }
            }
        });
    });

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', () => {
        renderLightboxSlide((currentProjectIndex - 1 + projectScreenshots.length) % projectScreenshots.length);
    });
    if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', () => {
        renderLightboxSlide((currentProjectIndex + 1) % projectScreenshots.length);
    });

    lightboxDots.forEach((dot, idx) => {
        dot.addEventListener('click', () => renderLightboxSlide(idx));
    });

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            renderLightboxSlide((currentProjectIndex - 1 + projectScreenshots.length) % projectScreenshots.length);
        } else if (e.key === 'ArrowRight') {
            renderLightboxSlide((currentProjectIndex + 1) % projectScreenshots.length);
        }
    });

    initCardTilt();
    initHeroParallax();
});

