/* ═══════════════════════════════════════════════════════════════ */
/* JAVASCRIPT PRINCIPAL                                          */
/* ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    
    // ═══════════════════════════════════════════════════════════
    // HEADER DINÁMICO AL HACER SCROLL
    // ═══════════════════════════════════════════════════════════
    const header = document.getElementById('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    // ══════════════════════════════════════════════════════════
    // MENÚ HAMBURGUESA MOBILE
    // ═══════════════════════════════════════════════════════════
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
    
    // ═══════════════════════════════════════════════════════════
    // NAVEGACIÓN ACTIVA SEGÚN SECCIÓN VISIBLE
    // ═══════════════════════════════════════════════════════════
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    const observerNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    
    sections.forEach(section => observerNav.observe(section));
    
    // ═══════════════════════════════════════════════════════════
    // TOGGLE MODO OSCURO / CLARO
    // ═══════════════════════════════════════════════════════════
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Cambiar icono
        if (theme === 'dark') {
            themeIcon.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            `;
        } else {
            themeIcon.innerHTML = `
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            `;
        }
    };
    
    setTheme(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
    
    // ═══════════════════════════════════════════════════════════
    // ANIMACIONES ON-SCROLL (IntersectionObserver)
    // ═══════════════════════════════════════════════════════════
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerReveal = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observerReveal.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => observerReveal.observe(el));
    
    // ═══════════════════════════════════════════════════════════
    // CONTADOR ANIMADO DE ESTADÍSTICAS
    // ══════════════════════════════════════════════════════════
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;
    
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const update = () => {
            current += step;
            if (current < target) {
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        update();
    };
    
    const observerStats = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                statNumbers.forEach(animateCounter);
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats');
    if (statsSection) observerStats.observe(statsSection);
    
    // ═══════════════════════════════════════════════════════════
    // CARRUSEL DE TESTIMONIOS
    // ═══════════════════════════════════════════════════════════
    const slides = document.getElementById('testimonialsSlides');
    const totalSlides = slides ? slides.children.length : 0;
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dotsContainer = document.getElementById('testimonialsDots');
    let currentSlide = 0;
    let autoplayInterval;
    
    // Crear dots
    if (dotsContainer && totalSlides > 0) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    const goToSlide = (index) => {
        currentSlide = index;
        if (slides) slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    };
    
    const nextSlide = () => {
        goToSlide((currentSlide + 1) % totalSlides);
    };
    
    const prevSlide = () => {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    };
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });
    
    // Autoplay
    const startAutoplay = () => {
        autoplayInterval = setInterval(nextSlide, 6000);
    };
    
    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };
    
    if (totalSlides > 1) startAutoplay();
    
    // Pausar autoplay al hacer hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
        slider.addEventListener('mouseleave', startAutoplay);
    }
    
    // ══════════════════════════════════════════════════════════
    // FAQ ACORDEÓN
    // ═══════════════════════════════════════════════════════════
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Cerrar todos
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Abrir el actual si estaba cerrado
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
    
    // ═══════════════════════════════════════════════════════════
    // VALIDACIÓN DE FORMULARIO
    // ═══════════════════════════════════════════════════════════
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    
    const showError = (inputId, show) => {
        const input = document.getElementById(inputId);
        const error = document.getElementById(inputId + 'Error');
        if (input) input.classList.toggle('error', show);
        if (error) error.classList.toggle('show', show);
    };
    
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    // Validación en tiempo real
    ['name', 'email', 'service', 'message'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', () => {
                if (id === 'email') {
                    showError(id, !validateEmail(input.value));
                } else {
                    showError(id, !input.value.trim());
                }
            });
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    if (id === 'email') {
                        showError(id, !validateEmail(input.value));
                    } else {
                        showError(id, !input.value.trim());
                    }
                }
            });
        }
    });
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            const privacy = document.getElementById('privacy').checked;
            
            let isValid = true;
            
            if (!name) { showError('name', true); isValid = false; }
            else showError('name', false);
            
            if (!validateEmail(email)) { showError('email', true); isValid = false; }
            else showError('email', false);
            
            if (!service) { showError('service', true); isValid = false; }
            else showError('service', false);
            
            if (!message) { showError('message', true); isValid = false; }
            else showError('message', false);
            
            if (!privacy) {
                alert('Debes aceptar la Política de Privacidad para continuar.');
                isValid = false;
            }
            
            if (isValid) {
                // Simular envío (aquí conectarías con tu backend)
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Enviando...</span>';
                
                setTimeout(() => {
                    formSuccess.classList.add('show');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Enviar Consulta</span><span>→</span>';
                    
                    setTimeout(() => {
                        formSuccess.classList.remove('show');
                    }, 5000);
                }, 1500);
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════════
    // BOTÓN VOLVER ARRIBA
    // ═══════════════════════════════════════════════════════════
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // ═══════════════════════════════════════════════════════════
    // AÑO DINÁMICO EN FOOTER
    // ═══════════════════════════════════════════════════════════
    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();
    
});