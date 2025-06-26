document.addEventListener('DOMContentLoaded', function() {
    // Main DOM elements
    const loadingScreen = document.getElementById('loading-screen');
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Device detection for optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Apply device-specific classes
    if (isIOS) document.documentElement.classList.add('ios-device');
    if (isAndroid) document.documentElement.classList.add('android-device');
    if (isReducedMotion) document.documentElement.classList.add('reduced-motion');
    
    // Loading screen handler
    if (loadingScreen) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500); // Reduced loading time for better UX
        });
    }

    // Optimized scroll handler with throttling
    let lastScrollTime = 0;
    const throttleDelay = 10; // milliseconds
    
    window.addEventListener('scroll', function() {
        const now = performance.now();
        if (now - lastScrollTime < throttleDelay) return;
        lastScrollTime = now;
        
        const scrolled = window.pageYOffset;
        
        // Optimize parallax effect for non-mobile devices
        if (!isMobile && !isReducedMotion) {
            const rate = scrolled * -0.5;
            const backgroundOverlay = document.querySelector('.background-overlay');
            if (backgroundOverlay) {
                backgroundOverlay.style.transform = `translateY(${rate}px)`;
            }
        }
        
        // Navbar styling on scroll
        if (scrolled > 100) {
            navbar.classList.add('scrolled');
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }

        // Optimized parallax scrolling for sections
        if (!isMobile && !isReducedMotion) {
            const sections = document.querySelectorAll('section[data-speed]');
            sections.forEach(section => {
                const distance = section.getBoundingClientRect().top;
                const speed = section.dataset.speed || 0.2;
                if (distance < window.innerHeight && distance > -window.innerHeight) {
                    const yPos = (distance * speed);
                    section.style.transform = `translateY(${yPos}px)`;
                }
            });
        }
        
        // Update scroll progress indicator
        const scrollPercent = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const progressIndicator = document.querySelector('.scroll-progress-indicator');
        if (progressIndicator) {
            progressIndicator.style.width = `${scrollPercent}%`;
        }
    }, { passive: true });

    // Mobile menu toggle with improved animation
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                document.body.style.overflow = 'hidden';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Navigation link handling with improved error handling
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if no href attribute
                if (!href) return;
                
                // Handle navigation between pages
                if (href.indexOf('#') !== 0 && href.indexOf('http') !== 0) {
                    return; // Allow normal navigation for external pages
                }
                
                e.preventDefault();
                
                let targetId, targetPage;
                
                // Handle links like landingpage.html#section
                if (href.includes('#') && href.indexOf('#') > 0) {
                    const parts = href.split('#');
                    targetPage = parts[0];
                    targetId = '#' + parts[1];
                    
                    // If linking to another page's section
                    if (targetPage && window.location.href.indexOf(targetPage) === -1) {
                        window.location.href = href;
                        return;
                    }
                } else {
                    targetId = href;
                }
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    
                    try {
                        window.scrollTo({
                            top: offsetTop,
                            behavior: isReducedMotion ? 'auto' : 'smooth'
                        });
                    } catch (error) {
                        // Fallback for browsers that don't support smooth scrolling
                        window.scrollTo(0, offsetTop);
                    }
                }
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function() {
                    const isActive = item.classList.contains('active');
                    
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    // Show product cards immediately without animation for better performance
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        productCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
        });
    }

    // Hero buttons navigation
    const heroButtons = document.querySelectorAll('.hero-buttons .btn-primary, .hero-buttons .btn-secondary');
    if (heroButtons.length > 0) {
        heroButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                let targetSection = null;
                
                if (this.textContent.includes('Explore')) {
                    targetSection = document.querySelector('#products');
                } else if (this.textContent.includes('Visit')) {
                    targetSection = document.querySelector('.farm-visit-section');
                }
                
                if (targetSection) {
                    try {
                        targetSection.scrollIntoView({
                            behavior: isReducedMotion ? 'auto' : 'smooth',
                            block: 'start'
                        });
                    } catch (error) {
                        window.scrollTo(0, targetSection.offsetTop - 70);
                    }
                }
            });
        });
    }

    // Checkout modal handling with error handling
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        const modalProductName = document.getElementById('modal-product-name');
        const modalProductPrice = document.getElementById('modal-product-price');
        const loadingSpinner = checkoutModal.querySelector('.loading-spinner');
        const successMessage = checkoutModal.querySelector('.success-message');
        const errorMessage = checkoutModal.querySelector('.error-message');

        function showCheckoutModal(productName, price) {
            if (!modalProductName || !modalProductPrice) return;
            
            // Format the price display appropriately based on currency
            let formattedPrice = '';
            try {
                if (price && typeof price === 'string') {
                    if (price.includes('RM')) {
                        formattedPrice = price;
                    } else {
                        const priceNum = parseInt(price.replace(/\D/g, ''));
                        formattedPrice = isNaN(priceNum) ? price : `IDR ${priceNum.toLocaleString()}`;
                    }
                } else {
                    formattedPrice = 'Price unavailable';
                }
            } catch (error) {
                formattedPrice = price || 'Price unavailable';
                console.error('Error formatting price:', error);
            }
            
            modalProductName.textContent = productName || 'Product';
            modalProductPrice.textContent = formattedPrice;
            checkoutModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            setTimeout(() => {
                const checkoutContent = checkoutModal.querySelector('.checkout-content');
                if (checkoutContent) {
                    checkoutContent.style.opacity = '1';
                    checkoutContent.style.transform = 'translateY(0) scale(1)';
                }
            }, 10);
            
            if (loadingSpinner) loadingSpinner.style.display = 'none';
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';
            
            // Set the correct Stripe payment link based on product
            const stripeButton = checkoutModal.querySelector('.stripe-proceed-btn');
            if (stripeButton) {
                const stripeLinks = {
                    'Musang King': 'https://buy.stripe.com/bJe00keoUcaWaA70qD1Jm09',
                    'Red Prawn/Ang bak': 'https://buy.stripe.com/7sYeVecgM7UG23Bddp1Jm0b',
                    'D24 Classic': 'https://buy.stripe.com/bJefZi6Wsgrc7nV0qD1Jm0f',
                    'Capri': 'https://buy.stripe.com/3cI6oI94A7UGeQngpB1Jm0d',
                    'Golden Phoenix': 'https://buy.stripe.com/3cIbJ24Ok0se5fN0qD1Jm08',
                    'Ganja D15': 'https://buy.stripe.com/4gM6oI4OkcaWeQna1d1Jm05',
                    'Katak Pulu/D99': 'https://buy.stripe.com/3cI5kE6Ws2Am5fN1uH1Jm07',
                    'Lanjiao Yuan/D88 Supreme': 'https://buy.stripe.com/9B6fZi2Gc0se0Zx7T51Jm06',
                    '11 Susu': 'https://buy.stripe.com/8x27sM1C8ej4gYv4GT1Jm0a',
                    'Khun Poh': 'https://buy.stripe.com/bJecN61C88YKfUr6P11Jm00',
                    'Cheh Pui Kia': 'https://buy.stripe.com/cNi00k6Wsa2O5fN1uH1Jm0c',
                    '604 Premium': 'https://buy.stripe.com/00weVegx2caW9w3gpB1Jm0e',
                    'Mix and Match Gift Box': 'https://buy.stripe.com/bJe9AU80w4Iu6jRa1d1Jm04',
                    'Durian Buffet': 'https://buy.stripe.com/00w28s94A1wicIfc9l1Jm01',
                    'Bulk Sales': 'https://buy.stripe.com/bJeaEY80w8YKfUr2yL1Jm02'
                };
                
                // Get the corresponding link or use default if not found
                stripeButton.dataset.stripeLink = stripeLinks[productName] || 'https://buy.stripe.com/test_dRm8wR3x48x630g4N00Ba00';
            }
        }

        function hideCheckoutModal() {
            const checkoutContent = checkoutModal.querySelector('.checkout-content');
            if (checkoutContent) {
                checkoutContent.style.opacity = '0';
                checkoutContent.style.transform = 'translateY(-50px) scale(0.9)';
            }
            
            setTimeout(() => {
                checkoutModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }

        const closeButton = checkoutModal.querySelector('.checkout-close');
        if (closeButton) {
            closeButton.addEventListener('click', hideCheckoutModal);
        }
        
        checkoutModal.addEventListener('click', function(e) {
            if (e.target === checkoutModal) {
                hideCheckoutModal();
            }
        });

        const stripeCheckoutBtns = document.querySelectorAll('.stripe-checkout');
        stripeCheckoutBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productName = this.getAttribute('data-product');
                const price = this.getAttribute('data-price');
                
                showCheckoutModal(productName, price);
            });
        });

        const stripeProceedBtn = checkoutModal.querySelector('.stripe-proceed-btn');
        if (stripeProceedBtn) {
            stripeProceedBtn.addEventListener('click', function() {
                if (loadingSpinner) loadingSpinner.style.display = 'block';
                
                setTimeout(() => {
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                    
                    try {
                        const stripeLink = this.dataset.stripeLink || 'https://buy.stripe.com/test_dRm8wR3x48x630g4N00Ba00';
                        window.open(stripeLink, '_blank');
                        
                        if (successMessage) {
                            successMessage.textContent = 'Redirecting to secure payment portal...';
                            successMessage.style.display = 'block';
                        }
                        
                        setTimeout(() => {
                            hideCheckoutModal();
                        }, 2000);
                        
                    } catch (error) {
                        console.error('Payment redirect error:', error);
                        if (errorMessage) {
                            errorMessage.textContent = 'Unable to open payment portal. Please try again.';
                            errorMessage.style.display = 'block';
                        }
                    }
                }, 1000);
            });
        }
    }

    // WhatsApp button functionality
    const whatsappBtns = document.querySelectorAll('.whatsapp-btn');
    if (whatsappBtns.length > 0) {
        whatsappBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                try {
                    const productName = this.getAttribute('data-product') || 'durian products';
                    const whatsappMessage = `Hi Ivan Lee! I would like to order ${productName} from Islet Durians. Please provide more details about availability and delivery.`;
                    const whatsappUrl = `https://wa.me/60165568420?text=${encodeURIComponent(whatsappMessage)}`;
                    
                    window.open(whatsappUrl, '_blank');
                } catch (error) {
                    console.error('WhatsApp redirect error:', error);
                    window.open('https://wa.me/60165568420', '_blank');
                }
            });
        });
    }

    // Farm tour booking
    const farmTourBtn = document.querySelector('.farm-booking .btn-primary');
    if (farmTourBtn) {
        farmTourBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            try {
                const dateInput = document.querySelector('.date-input');
                const selectedDate = dateInput && dateInput.value ? dateInput.value : '';
                let message = 'Hi Ivan Lee! I would like to book a farm tour at Islet Durians.';
                
                if (selectedDate) {
                    message += ` I prefer the date: ${selectedDate}.`;
                }
                
                message += ' Please confirm availability and provide more details.';
                
                const whatsappUrl = `https://wa.me/60165568420?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            } catch (error) {
                console.error('Farm tour booking error:', error);
                window.open('https://wa.me/60165568420', '_blank');
            }
        });
    }

    // Parallax effects for non-mobile devices
    if (!isMobile && !isReducedMotion) {
        const parallaxElements = document.querySelectorAll('.floating-durian, .about-img, .nutrition-image img');
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = 0.5;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
            }, { passive: true });
        }

        // Custom cursor effect for desktop
        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        cursorFollower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(139, 195, 74, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transition: transform 0.1s ease, background 0.3s ease;
            display: none;
            mix-blend-mode: difference;
            will-change: transform;
        `;
        document.body.appendChild(cursorFollower);

        document.addEventListener('mousemove', function(e) {
            if (window.innerWidth > 768) {
                cursorFollower.style.display = 'block';
                cursorFollower.style.left = e.clientX - 10 + 'px';
                cursorFollower.style.top = e.clientY - 10 + 'px';
            }
        }, { passive: true });

        // Handle cursor effects for interactive elements
        const hoverElements = document.querySelectorAll('button, .nav-link, .product-card, .feature-card, .social-links a');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                cursorFollower.style.transform = 'scale(2.5)';
                cursorFollower.style.background = 'rgba(255, 193, 7, 0.5)';
            });
            
            el.addEventListener('mouseleave', function() {
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.background = 'rgba(139, 195, 74, 0.3)';
            });
        });
    }

    // Stats animation with IntersectionObserver
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        if (!isMobile && !isReducedMotion && 'IntersectionObserver' in window) {
            const statsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const finalValue = parseInt(target.textContent.replace(/\D/g, '')) || 0;
                        const suffix = target.textContent.replace(/\d/g, '') || '';
                        
                        animateCounter(target, 0, finalValue, 2000, suffix);
                        statsObserver.unobserve(target);
                    }
                });
            });

            stats.forEach(stat => statsObserver.observe(stat));

            function animateCounter(element, start, end, duration, suffix) {
                if (!element) return;
                
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(start + (end - start) * easeOutQuart);
                    
                    element.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    }
                }
                
                requestAnimationFrame(updateCounter);
            }
        } else {
            // For mobile, show the final number without animation
            stats.forEach(stat => {
                stat.style.opacity = '1';
            });
        }
    }

    // Typewriter effect for desktop
    if (!isMobile && !isReducedMotion) {
        const typewriterElement = document.querySelector('.hero-text h1');
        if (typewriterElement) {
            const text = typewriterElement.textContent;
            typewriterElement.textContent = '';
            
            setTimeout(() => {
                let i = 0;
                const typeInterval = setInterval(() => {
                    typewriterElement.textContent += text.charAt(i);
                    i++;
                    if (i > text.length) {
                        clearInterval(typeInterval);
                    }
                }, 100);
            }, 2000);
        }
    }

    // Testimonial carousel with mobile swipe
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    
    if (testimonialCards.length > 1) {
        let currentTestimonial = 0;
        let testimonialInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        function rotateTestimonials(nextIndex) {
            if (!testimonialCards[0]) return;
            
            if (nextIndex !== undefined) {
                currentTestimonial = nextIndex;
            } else {
                currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            }
            
            testimonialCards.forEach((card, index) => {
                card.style.transform = `translateX(${(index - currentTestimonial) * 100}%)`;
                card.style.opacity = index === currentTestimonial ? '1' : '0.5';
                card.style.scale = index === currentTestimonial ? '1' : '0.9';
                card.style.zIndex = index === currentTestimonial ? '2' : '1';
            });
            
            testimonialDots.forEach((dot, index) => {
                if (index === currentTestimonial) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Initialize testimonial carousel
        testimonialCards.forEach((card, index) => {
            card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.position = 'absolute';
            card.style.width = '100%';
            card.style.left = '0';
            card.style.top = '0';
            card.style.transform = `translateX(${(index) * 100}%)`;
            card.style.opacity = index === 0 ? '1' : '0.5';
            card.style.scale = index === 0 ? '1' : '0.9';
            card.style.zIndex = index === 0 ? '2' : '1';
        });
        
        // Handle touch events for swiping on mobile
        const testimonialsSection = document.querySelector('.testimonials-grid');
        if (testimonialsSection) {
            testimonialsSection.addEventListener('touchstart', function(e) {
                touchStartX = e.touches[0].clientX;
                clearInterval(testimonialInterval);
            }, { passive: true });
            
            testimonialsSection.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].clientX;
                
                // Handle swipe
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left, next slide
                    rotateTestimonials((currentTestimonial + 1) % testimonialCards.length);
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right, previous slide
                    rotateTestimonials((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length);
                }
                
                startTestimonialRotation();
            }, { passive: true });
            
            // Pause carousel on hover for desktop
            if (!isMobile) {
                testimonialsSection.addEventListener('mouseenter', () => {
                    clearInterval(testimonialInterval);
                });
                
                testimonialsSection.addEventListener('mouseleave', () => {
                    startTestimonialRotation();
                });
            }
        }
        
        // Add click events to navigation dots
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(testimonialInterval);
                rotateTestimonials(index);
                startTestimonialRotation();
            });
            
            // Add keyboard accessibility for dots
            dot.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
        
        function startTestimonialRotation() {
            clearInterval(testimonialInterval);
            testimonialInterval = setInterval(() => rotateTestimonials(), 5000);
        }
        
        // Start the carousel
        startTestimonialRotation();
    }

    // Ticker banner interactivity
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        const pauseAnimation = () => {
            tickerContent.style.animationPlayState = 'paused';
        };
        
        const resumeAnimation = () => {
            tickerContent.style.animationPlayState = 'running';
        };
        
        tickerContent.addEventListener('mouseenter', pauseAnimation);
        tickerContent.addEventListener('mouseleave', resumeAnimation);
        tickerContent.addEventListener('touchstart', pauseAnimation, { passive: true });
        tickerContent.addEventListener('touchend', resumeAnimation, { passive: true });
    }

    // Add scroll progress indicator if it doesn't exist
    if (!document.querySelector('.scroll-progress-indicator')) {
        const progressIndicator = document.createElement('div');
        progressIndicator.className = 'scroll-progress-indicator';
        document.body.appendChild(progressIndicator);
    }

    // Fix for iOS devices - remove sticky hover
    if (isIOS) {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .product-btn, .package-btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.classList.add('ios-active');
            }, { passive: true });
            
            button.addEventListener('touchend', function() {
                this.classList.remove('ios-active');
            }, { passive: true });
        });
    }

    // Enhanced accessibility
    const interactiveElements = document.querySelectorAll('button, a, .product-card, .package-card, .testimonial-card');
    interactiveElements.forEach(el => {
        // Ensure all interactive elements have proper focus handling
        if (!el.getAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
            el.setAttribute('tabindex', '0');
        }
        
        // Add keyboard activation for non-button/link elements
        if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });

    // Add keyboard focus indicator
    document.body.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-focus');
        }
    });

    document.body.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-focus');
    });
});
