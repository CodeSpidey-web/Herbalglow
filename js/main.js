/* ============================================================
   Herbal Glow — Premium interactions and WhatsApp sales flow
   Replace WHATSAPP_NUMBER with the live business number.
   Format: country code + number, no plus sign, spaces, or dashes.
   Example India: 919876543210
   ============================================================ */

'use strict';

const WHATSAPP_NUMBER = '919790231371';

/* ============================================================
   Web3Forms Setup for Contact Form Inquiry Flow
   1. Go to https://web3forms.com
   2. Enter your email (cloudsync3000@gmail.com) to generate a free Access Key.
   3. Copy the Access Key sent to your email and replace the value below.
   4. That's it! Mails will be sent to cloudsync3000@gmail.com and 
      the customer will automatically receive a styled HTML auto-reply.
   ============================================================ */
const WEB3FORMS_ACCESS_KEY = '3be3acdf-fa08-48dc-ba66-012f6dc8b37d'; // Web3Forms Access Key for cloudsync3000@gmail.com

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;

const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function decodeDataMessage(value = '') {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function buildProductMessage(product) {
  return `Hello Herbal Glow,\nI'm interested in purchasing ${product}.\nCan you please provide more details?`;
}

function openWhatsApp(message) {
  const encodedMessage = encodeURIComponent(message.trim());
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

function showToast(title, message, type = 'info') {
  let container = qs('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') {
    iconClass = 'fa-check-circle success';
    toast.style.borderLeftColor = 'var(--green-700)';
  } else if (type === 'error') {
    iconClass = 'fa-exclamation-circle error';
    toast.style.borderLeftColor = 'var(--rose)';
  }

  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close message"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  // Trigger animation next tick
  setTimeout(() => toast.classList.add('show'), 50);

  const closeToast = () => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  };

  toast.querySelector('.toast-close').addEventListener('click', closeToast);

  // Auto-dismiss after 6 seconds
  setTimeout(closeToast, 6000);
}


function initLoader() {
  const loader = qs('.page-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    if (window.AOS) AOS.refresh();
    if (window.gsap && !prefersReducedMotion) {
      gsap.to(loader, {
        opacity: 0,
        duration: 0.75,
        ease: 'power2.out',
        onComplete: () => loader.classList.add('is-hidden')
      });
    } else {
      loader.classList.add('is-hidden');
    }
  });
}

function initSmoothScroll() {
  if (prefersReducedMotion || !window.Lenis) return;

  try {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2
    });

    lenis.on('scroll', () => {
      if (window.ScrollTrigger) ScrollTrigger.update();
      if (window.AOS) AOS.refresh();
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    qsa('a[href^="#"]:not(.whatsapp-link)').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = qs(targetId);
        if (!target) return;
        event.preventDefault();
        lenis?.start();
        lenis.scrollTo(target, { offset: -76, duration: 1.15 });
      });
    });
  } catch (e) {
    console.warn('Lenis smooth scroll failed:', e);
  }
}

function initHeaderAndNav() {
  const header = qs('[data-header]');
  const navToggle = qs('[data-nav-toggle]');
  const navMenu = qs('[data-nav-menu]');

  const handleScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  if (!navToggle || !navMenu) return;

  const closeMenu = () => {
    navToggle.classList.remove('is-active');
    navMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    lenis?.start();
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.classList.toggle('is-active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  });

  qsa('a', navMenu).forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initWhatsAppLinks() {
  qsa('.whatsapp-link').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      const product = element.dataset.product;
      const rawMessage = element.dataset.message;
      const message = product
        ? buildProductMessage(product)
        : decodeDataMessage(rawMessage || 'Hello Herbal Glow,\nI am interested in your luxury herbal beauty products.\nCan you please share more details?');
      openWhatsApp(message);
    });
  });
}

function initContactForm() {
  const form = qs('[data-contact-form]');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const submitBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!email) {
      showToast('Validation Error', 'Email address is required to submit this form.', 'error');
      return;
    }

    // Verify hCaptcha if in live mode
    const isLive = typeof WEB3FORMS_ACCESS_KEY !== 'undefined' && WEB3FORMS_ACCESS_KEY !== 'YOUR_ACCESS_KEY_HERE' && WEB3FORMS_ACCESS_KEY;
    const captchaToken = form.querySelector('[name="h-captcha-response"]')?.value;
    
    if (isLive && !captchaToken) {
      showToast('Verification Required', 'Please complete the hCaptcha challenge.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
    }

    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      name: name,
      email: email,
      phone: phone,
      message: message,
      subject: `New Inquiry from ${name} - Herbal Glow`,
      from_name: "Herbal Glow Inquiry",
      replyto: email,
      "h-captcha-response": captchaToken || "",
      // Custom Auto-Reply HTML configured for the Customer
      autoresponder_subject: "We received your inquiry - Herbal Glow",
      autoresponder_html: `
        <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e8d6b3; background-color: #fffaf1; color: #1c221e; border-radius: 14px; box-shadow: 0 10px 30px rgba(20,49,36,0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #10281e; font-size: 26px; font-weight: 600; margin: 0; letter-spacing: 0.05em;">Herbal Glow</h2>
            <em style="color: #c49a42; font-size: 10px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; display: block; margin-top: 4px; font-family: 'Inter', sans-serif; font-style: normal;">Nature's Luxury</em>
          </div>
          <div style="font-family: 'Inter', sans-serif; font-size: 14px; line-height: 1.6; color: #1c221e;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for reaching out to Herbal Glow. We have successfully received your inquiry and our team will get back to you shortly.</p>
            
            <div style="background-color: rgba(196, 154, 66, 0.06); padding: 20px; border-left: 3px solid #c49a42; margin: 25px 0; border-radius: 4px;">
              <strong style="color: #10281e; display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Your Inquiry Details:</strong>
              <p style="margin: 0 0 5px; color: #1c221e;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 0 0 10px; color: #1c221e;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 0; font-style: italic; color: #6e746d;">"${message}"</p>
            </div>
            
            <p>In the meantime, feel free to explore our premium collection on our website, or contact us directly on WhatsApp for immediate guidance.</p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e8d6b3;">
              <p style="font-size: 12px; color: #6e746d; margin: 0 0 10px;">Want a faster response?</p>
              <a href="https://wa.me/919790231371" style="display: inline-flex; align-items: center; background-color: #1d4a35; color: #ffffff; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-size: 13px; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'Inter', sans-serif;">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      `
    };

    // If Access Key has default placeholder/unset credentials, run in Simulation Mode.
    if (typeof WEB3FORMS_ACCESS_KEY === 'undefined' || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE' || !WEB3FORMS_ACCESS_KEY) {
      setTimeout(() => {
        showToast(
          'Message Submitted (Demo Mode)',
          'Inquiry processed successfully. Copy of email configured to send to cloudsync3000@gmail.com and ' + email + '.',
          'success'
        );
        form.reset();
        if (window.hcaptcha) {
          hcaptcha.reset();
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtnText;
        }
      }, 1500);
    } else {
      // Live Web3Forms submission
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          showToast(
            'Message Sent',
            'Your inquiry has been submitted. A confirmation email has been sent to ' + email + '.',
            'success'
          );
          form.reset();
          if (window.hcaptcha) {
            hcaptcha.reset();
          }
        } else {
          console.error(json);
          showToast('Submission Failed', json.message || 'Could not submit message. Please try again.', 'error');
          if (window.hcaptcha) {
            hcaptcha.reset();
          }
        }
      })
      .catch((error) => {
        console.error('Web3Forms Error:', error);
        showToast('Submission Failed', 'A network error occurred. Please try again or chat via WhatsApp.', 'error');
        if (window.hcaptcha) {
          hcaptcha.reset();
        }
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitBtnText;
        }
      });
    }
  });

}

function initAOS() {
  if (!window.AOS) return;
  AOS.init({
    once: true,
    duration: 850,
    easing: 'ease-out-cubic',
    offset: 80,
    disable: () => window.innerWidth < 360 || prefersReducedMotion
  });
}

function splitHeroText() {
  const heading = qs('.text-reveal');
  if (!heading || heading.dataset.split === 'true') return;

  const words = heading.textContent.trim().split(' ');
  heading.innerHTML = words.map((word) => `<span class="word"><span>${word}</span></span>`).join(' ');
  heading.dataset.split = 'true';
}

function initGSAPAnimations() {
  if (!window.gsap || prefersReducedMotion) return;

  try {
    splitHeroText();
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

    const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTimeline
      .from('.site-header', { y: -35, opacity: 0, duration: 0.9, delay: 0.2 })
      .from('.text-reveal .word span', { yPercent: 108, opacity: 0, rotate: 2, stagger: 0.055, duration: 1.05 }, '-=0.35')
      .from('.hero-product', { y: 34, opacity: 0, scale: 0.9, stagger: 0.12, duration: 1.05 }, '-=0.8')
      .from('.hero-card', { y: 24, opacity: 0, scale: 0.92, stagger: 0.12, duration: 0.85 }, '-=0.65');

    gsap.utils.toArray('[data-parallax]').forEach((element) => {
      const speed = Number(element.dataset.parallax) || 0.12;
      gsap.to(element, {
        yPercent: -10 * speed * 10,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    const counters = qs('[data-counters]');
    if (counters) {
      qsa('[data-count]', counters).forEach((counter) => {
        const target = Number(counter.dataset.count || 0);
        const suffix = counter.parentElement?.textContent.includes('%') ? '%' : '';
        gsap.fromTo(counter, { innerText: 0 }, {
          innerText: target,
          duration: 2.2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: counters,
            start: 'top 78%',
            once: true
          },
          onUpdate() {
            const value = Number(counter.innerText).toLocaleString('en-IN');
            counter.textContent = `${value}${suffix}`;
          }
        });
      });
    }

    gsap.utils.toArray('.feature-card, .ingredient-grid article, .timeline article').forEach((card) => {
      card.addEventListener('mouseenter', () => gsap.to(card, { rotate: -0.25, duration: 0.35, ease: 'power2.out' }));
      card.addEventListener('mouseleave', () => gsap.to(card, { rotate: 0, duration: 0.35, ease: 'power2.out' }));
    });
  } catch (e) {
    console.warn('GSAP animations failed:', e);
  }
}

function initSwiper() {
  if (!window.Swiper) return;

  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    spaceBetween: 18,
    loop: true,
    speed: 750,
    grabCursor: true,
    autoplay: prefersReducedMotion ? false : {
      delay: 4200,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      720: { slidesPerView: 2, spaceBetween: 20 },
      1080: { slidesPerView: 3, spaceBetween: 24 }
    }
  });
}

function initTilt() {
  if (!window.VanillaTilt || prefersReducedMotion) return;

  VanillaTilt.init(qsa('.tilt-card'), {
    max: 7,
    speed: 700,
    glare: true,
    'max-glare': 0.14,
    perspective: 1100,
    scale: 1.01
  });
}

function initAccordion() {
  const items = qsa('.accordion-item');
  if (!items.length) return;

  items.forEach((item) => {
    const button = qs('button', item);
    button?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach((otherItem) => {
        otherItem.classList.remove('active');
        qs('button', otherItem)?.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

function initMagneticButtons() {
  if (prefersReducedMotion || !window.gsap || window.matchMedia('(pointer: coarse)').matches) return;

  qsa('.magnetic, .btn').forEach((button) => {
    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const moveX = (x - rect.width / 2) * 0.16;
      const moveY = (y - rect.height / 2) * 0.16;
      button.style.setProperty('--x', `${x}px`);
      button.style.setProperty('--y', `${y}px`);
      gsap.to(button, { x: moveX, y: moveY, duration: 0.35, ease: 'power2.out' });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
    });
  });
}

function initCursor() {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches || !window.gsap) return;

  const dot = qs('.custom-cursor');
  const ring = qs('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    gsap.set(ring, { x: ringX, y: ringY });
  });

  qsa('a, button, input, textarea, .product-card').forEach((element) => {
    element.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    element.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

function initProductParallax() {
  const frame = qs('.composition-frame');
  if (!frame || prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  frame.addEventListener('mousemove', (event) => {
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    qsa('.hero-product', frame).forEach((product, index) => {
      const depth = (index + 1) * 18;
      product.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${index === 1 ? -8 : index === 2 ? 8 : 0}deg)`;
    });
  });

  frame.addEventListener('mouseleave', () => {
    const products = qsa('.hero-product', frame);
    if (products[0]) products[0].style.transform = '';
    if (products[1]) products[1].style.transform = 'rotate(-8deg)';
    if (products[2]) products[2].style.transform = 'rotate(8deg)';
  });
}

function initCurrentNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === page) link.classList.add('is-current');
  });
}

function initFooterYear() {
  const year = qs('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}

function initHeroRotator() {
  const container = qs('[data-rotator]');
  if (!container || prefersReducedMotion) return;
  const items = qsa('.rotator-item', container);
  if (items.length < 2) return;

  let current = 0;
  let interval;

  function next() {
    items[current].classList.remove('active');
    current = (current + 1) % items.length;
    setTimeout(() => items[current].classList.add('active'), 80);
  }

  interval = setInterval(next, 3800);

  container.addEventListener('mouseenter', () => clearInterval(interval));
  container.addEventListener('mouseleave', () => { interval = setInterval(next, 3800); });
}

function initProductModal() {
  const modal = qs('[data-product-modal]');
  const overlay = qs('[data-modal-close]');
  const closeBtn = qs('.modal-close');
  const cards = qsa('[data-product-id]');
  if (!modal || !cards.length) return;

  const products = {
    'de-tan-soap': {
      name: 'De-Tan Soap', label: 'Radiance Bar', image: 'images/product%20images/detan%20soap.webp',
      description: 'A creamy herbal bathing bar crafted to refresh sun-stressed skin and reveal a brighter-looking glow. Enriched with rice, mysore dal, goat milk, and herbal powders, it gently cleanses while helping to reduce tan and even out skin tone.',
      ingredients: 'Rice, Mysore Dal Powder, Goat Milk, Coconut Oil, Shea Butter, Sweet Almond Oil, Herbal Powders',
      benefits: 'Cleanses, exfoliates, brightens skin, leaves it soft and moisturized',
      usage: 'Lather on damp skin, massage gently, rinse. Use daily.',
      price: '₹80 (85g)'
    },
    'acne-soap': {
      name: 'Acne Soap', label: 'Clarity Bar', image: 'images/product%20images/acne%20soap.webp',
      description: 'A clean-feel herbal soap designed for blemish-prone skin. Enriched with kadukkai, jathikai, aloe vera, and licorice to support a clearer, balanced complexion while soothing and calming irritation.',
      ingredients: 'Coconut Oil, Sweet Almond Oil, Shea Butter, Goat Milk, Rice Bran Oil, Kadukkai (Haritaki) Powder, Jathikai (Nutmeg) Powder, Aloe Vera, Athimathuram (Licorice) Powder, Potato Powder',
      benefits: 'Helps reduce breakouts, balances oil, soothes skin, gentle clarity',
      usage: 'Lather on damp skin, massage gently on affected areas, rinse. Use twice daily.',
      price: '₹80 (85g)'
    },
    'hair-growth-serum': {
      name: 'Hair Growth Serum', label: 'Botanic Scalp Ritual', image: 'images/product%20images/hair%20growth%20serum.webp',
      description: 'A lightweight botanical scalp serum with a potent blend of herbal oils and extracts. Rosemary, jojoba, pumpkin seed, castor, coconut, and black seed oils work with amla, bhringraj, brahmi, and hibiscus to nourish roots and promote healthier-looking hair.',
      ingredients: 'Jojoba Oil, Pumpkin Seed Oil, Rosemary Oil, Castor Oil, Sweet Almond Oil, Coconut Oil, Argan Oil, Black Seed Oil, Amla Extract, Bhringraj Extract, Brahmi Extract, Hibiscus Extract, Fenugreek Extract, Curry Leaf Extract, Aloe Vera Extract, Vitamin E, Lavender Essential Oil, Peppermint Essential Oil',
      benefits: 'Nourishes roots, reduces hair fall, adds shine, fuller look',
      usage: 'Apply a few drops to scalp, massage gently for 2 minutes. Leave overnight or rinse after 1 hour. Use 3-4 times a week.',
      price: '₹350 (30ml)'
    },
    'mint-lip-balm': {
      name: 'Mint Lip Balm', label: 'Cooling Freshness', image: 'images/product%20images/Mint%20lip%20balm.webp',
      description: 'A refreshing lip balm that cools and hydrates with mint extracts and nourishing butters. Keeps lips soft, smooth, and fresh all day long with a pleasant tingling sensation.',
      ingredients: 'Sweet Almond Oil, Cocoa Butter, Shea Butter, Mint Extracts',
      benefits: 'Cooling sensation, deep hydration, lasting freshness, smooth lips',
      usage: 'Apply evenly to lips whenever needed. Reapply after meals or exposure to sun.',
      price: '₹70'
    },
    'beetroot-lip-balm': {
      name: 'Beet Root Lip Balm', label: 'Natural Rosy Glow', image: 'images/product%20images/beetroot%20lip%20balm.webp',
      description: 'A deeply nourishing lip balm infused with beetroot extracts for a soft, natural rosy tint. Sweet almond oil, cocoa butter, and shea butter provide intense moisture while giving lips a healthy, plush finish.',
      ingredients: 'Sweet Almond Oil, Cocoa Butter, Shea Butter, Beetroot Extracts',
      benefits: 'Natural rosy tint, intense hydration, smooth finish, plump lips',
      usage: 'Apply evenly to lips. Use daily for best results. Can be layered for deeper tint.',
      price: '₹70'
    },
    'kungumathi-oil': {
      name: 'Kungumathi Oil', label: 'Saffron Face Ritual', image: 'images/product%20images/kungumathi%20oil.webp',
      description: 'A luxurious golden facial oil for slow evenings and soft massage. Inspired by heirloom Indian beauty practices with saffron, sandalwood, rose, and turmeric to nourish deeply and leave skin with a visible, luminous glow.',
      ingredients: 'Saffron (Kumkumapoo), Sweet Almond Oil, Sesame Oil, Rose Petals, Sandalwood, Vetiver, Licorice (Athimadhuram), Manjistha, Turmeric, Lotus Extract, Goat Milk, Vitamin E Oil, Essential Oil (Rose or Lavender)',
      benefits: 'Brightens skin, reduces pigmentation and dark spots, improves skin tone, nourishes and hydrates, helps reduce fine lines, promotes a natural glow',
      usage: 'Apply 2-3 drops to clean, damp skin after cleansing. Massage gently upward. Use nightly.',
      price: '₹250 (15ml)'
    }
  };

  function openModal(id) {
    const p = products[id];
    if (!p) return;
    qs('[data-modal-image]', modal).src = p.image;
    qs('[data-modal-label]', modal).textContent = p.label;
    qs('[data-modal-name]', modal).textContent = p.name;
    qs('[data-modal-desc]', modal).textContent = p.description;
    qs('[data-modal-ingredients]', modal).textContent = p.ingredients;
    qs('[data-modal-benefits]', modal).textContent = p.benefits;
    qs('[data-modal-usage]', modal).textContent = p.usage;
    qs('[data-modal-price]', modal).innerHTML = p.price + ' <small>incl. tax</small>';
    const buyBtn = qs('[data-modal-buy]', modal);
    buyBtn.dataset.product = p.name;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-product, .whatsapp-link')) return;
      const id = card.dataset.productId;
      if (id) openModal(id);
    });
  });

  overlay.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

function initIngredientToggle() {
  const wrap = qs('[data-ingredient-wrap]');
  const btn = qs('[data-ingredient-toggle]');
  const section = qs('#ingredients');
  if (!wrap || !btn) return;

  btn.addEventListener('click', () => {
    const isOpen = wrap.classList.toggle('expanded');
    btn.classList.toggle('is-open', isOpen);
    btn.innerHTML = isOpen
      ? 'Show Less <i class="fa-solid fa-chevron-down"></i>'
      : 'Show More <i class="fa-solid fa-chevron-down"></i>';

    if (!isOpen) {
      window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
    }
  });
}

function initIngredientPopover() {
  const popover = qs('[data-ingredient-popover]');
  const overlay = qs('[data-popover-close]');
  const closeBtn = qs('.popover-close');
  const nameEl = qs('[data-popover-name]');
  const descEl = qs('[data-popover-desc]');
  const iconEl = qs('[data-popover-icon]');
  const productsEl = qs('[data-popover-products]');
  const benefitsEl = qs('[data-popover-benefits]');
  if (!popover) return;

  const glossary = {
    turmeric: {
      name: 'Turmeric',
      desc: 'A golden spice used for centuries in Indian beauty rituals for its brightening and soothing properties.',
      products: 'Kungumathi Oil',
      benefits: 'Brightens skin, reduces pigmentation, soothes inflammation'
    },
    saffron: {
      name: 'Saffron',
      desc: 'A prized botanical known as Kumkumapoo, cherished for its ability to impart a natural glow and even out skin tone.',
      products: 'Kungumathi Oil',
      benefits: 'Brightens complexion, reduces dark spots, promotes radiance'
    },
    aloe: {
      name: 'Aloe Vera',
      desc: 'A soothing succulent extract that calms irritation, hydrates deeply, and supports skin recovery.',
      products: 'Acne Soap, Hair Growth Serum',
      benefits: 'Soothes skin, hydrates, reduces inflammation'
    },
    coconut: {
      name: 'Coconut Oil',
      desc: 'A classic emollient that nourishes, softens, and protects skin and hair with its rich fatty acid profile.',
      products: 'De-Tan Soap, Acne Soap, Hair Growth Serum',
      benefits: 'Nourishes, softens, strengthens hair, moisturizes skin'
    },
    rose: {
      name: 'Rose',
      desc: 'A delicate botanical extract known for its soothing, hydrating, and luxurious sensorial properties.',
      products: 'Kungumathi Oil',
      benefits: 'Soothes skin, provides hydration, adds luxury feel'
    },
    almond: {
      name: 'Sweet Almond Oil',
      desc: 'A light, nutrient-rich oil that deeply moisturizes and supports smooth, healthy-looking skin and hair.',
      products: 'De-Tan Soap, Acne Soap, Kungumathi Oil, Hair Growth Serum, Lip Balms',
      benefits: 'Deeply moisturizes, supports smoothness, rich in vitamin E'
    },
    'goat-milk': {
      name: 'Goat Milk',
      desc: 'A gentle, nutrient-rich base traditionally used in skincare for its nourishing and soothing properties.',
      products: 'De-Tan Soap, Acne Soap, Kungumathi Oil',
      benefits: 'Nourishes, soothes, gently cleanses'
    },
    'shea-butter': {
      name: 'Shea Butter',
      desc: 'A deeply moisturizing butter extracted from shea nuts that softens, protects, and restores skin elasticity.',
      products: 'De-Tan Soap, Acne Soap, Mint Lip Balm, Beet Root Lip Balm',
      benefits: 'Deeply moisturizes, softens skin, restores elasticity'
    },
    rice: {
      name: 'Rice',
      desc: 'A traditional brightening grain used in herbal soaps to gently exfoliate and promote an even skin tone.',
      products: 'De-Tan Soap',
      benefits: 'Gently exfoliates, brightens skin, evens tone'
    },
    'cocoa-butter': {
      name: 'Cocoa Butter',
      desc: 'A rich natural butter that provides deep hydration and gives lips a smooth, plush, healthy finish.',
      products: 'Mint Lip Balm, Beet Root Lip Balm',
      benefits: 'Deeply hydrates, smooths lips, gives plush finish'
    },
    sandalwood: {
      name: 'Sandalwood',
      desc: 'A prized aromatic wood known for its calming, cooling, and skin-brightening properties in traditional rituals.',
      products: 'Kungumathi Oil',
      benefits: 'Calms skin, cools inflammation, brightens complexion'
    },
    amla: {
      name: 'Amla',
      desc: 'A potent Ayurvedic botanical rich in vitamin C that nourishes hair roots and promotes natural strength and shine.',
      products: 'Hair Growth Serum',
      benefits: 'Nourishes roots, strengthens hair, adds shine'
    },
    bhringraj: {
      name: 'Bhringraj',
      desc: 'A traditional Ayurvedic herb prized for its ability to support hair growth and reduce hair fall naturally.',
      products: 'Hair Growth Serum',
      benefits: 'Promotes hair growth, reduces hair fall, strengthens roots'
    },
    hibiscus: {
      name: 'Hibiscus',
      desc: 'A vibrant flower extract that strengthens hair, adds natural shine, and promotes a fuller-looking appearance.',
      products: 'Hair Growth Serum',
      benefits: 'Strengthens hair, adds shine, promotes fullness'
    },
    vetiver: {
      name: 'Vetiver',
      desc: 'A cooling root extract traditionally used to soothe skin, reduce inflammation, and refresh the senses.',
      products: 'Kungumathi Oil',
      benefits: 'Soothes skin, reduces inflammation, refreshes'
    },
    licorice: {
      name: 'Licorice',
      desc: 'A brightening botanical known as Athimathuram that helps reduce pigmentation and even out skin tone naturally.',
      products: 'Acne Soap, Kungumathi Oil',
      benefits: 'Reduces pigmentation, evens skin tone, brightens'
    }
  };

  function openPopover(id) {
    const data = glossary[id];
    if (!data) return;
    nameEl.textContent = data.name;
    descEl.textContent = data.desc;
    productsEl.textContent = data.products;
    benefitsEl.textContent = data.benefits;

    const article = qs(`[data-ingredient="${id}"]`);
    const img = article?.querySelector('img');
    if (img) {
      iconEl.innerHTML = `<img src="${img.src}" alt="${data.name}" />`;
    } else {
      iconEl.innerHTML = `<div style="width:100%;height:100%;display:grid;place-items:center;background:var(--cream);color:var(--gold);font-size:2rem;font-weight:900;">${data.name[0]}</div>`;
    }

    popover.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closePopover() {
    popover.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  qsa('[data-ingredient]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = el.dataset.ingredient;
      if (id) openPopover(id);
    });
    el.style.cursor = 'pointer';
  });

  overlay?.addEventListener('click', closePopover);
  closeBtn?.addEventListener('click', closePopover);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopover(); });
}

function init() {
  initLoader();
  initHeaderAndNav();
  initSmoothScroll();
  initWhatsAppLinks();
  initContactForm();
  initAOS();
  initGSAPAnimations();
  initHeroRotator();
  initProductModal();
  initSwiper();
  initTilt();
  initAccordion();
  initMagneticButtons();
  initCursor();
  initProductParallax();
  initCurrentNav();
  initFooterYear();
  initIngredientToggle();
  initIngredientPopover();
}

document.addEventListener('DOMContentLoaded', init);
