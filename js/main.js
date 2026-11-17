document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNavPill();
  initMobileMenu();
  initBackToTop();
  initStatsCounter();
  initScrollAnimations();
  initContactForm();
  initHeroVideo();
  initWorkGallery();
  initPageTransitions();
});

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initNavPill() {
  const menu = document.getElementById('navMenu');
  const pill = document.getElementById('navPill');
  if (!menu || !pill) return;

  const items = [...menu.querySelectorAll('.navbar__link')];
  if (!items.length) return;

  const canAnimate = () => window.matchMedia('(min-width: 901px)').matches;

  const movePill = (item, animate = true) => {
    if (!item) return;

    if (!canAnimate()) {
      items.forEach(el => el.classList.remove('is-pill'));
      pill.style.width = '0px';
      pill.style.transform = 'translateX(0)';
      return;
    }

    const menuRect = menu.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const left = itemRect.left - menuRect.left;
    const width = itemRect.width;

    items.forEach(el => el.classList.toggle('is-pill', el === item));

    if (!animate) pill.style.transition = 'none';
    pill.style.width = `${width}px`;
    pill.style.transform = `translateX(${left}px)`;
    if (!animate) {
      void pill.offsetWidth;
      pill.style.transition = '';
    }
  };

  const setActive = (item, animate = true) => {
    items.forEach(el => el.classList.toggle('is-active', el === item));
    movePill(item, animate);
  };

  const syncFromScroll = () => {
    const offset = window.innerHeight * 0.28;
    let current = items[0];

    items.forEach(item => {
      const id = item.dataset.section;
      if (!id) return;
      const section = document.getElementById(id);
      if (!section) return;
      if (section.getBoundingClientRect().top - offset <= 0) {
        current = item;
      }
    });

    if (current && !current.classList.contains('is-active')) {
      setActive(current, true);
    } else if (current) {
      movePill(current, true);
    }
  };

  items.forEach(item => {
    item.addEventListener('mouseenter', () => movePill(item, true));
    item.addEventListener('focus', () => movePill(item, true));
  });

  menu.addEventListener('mouseleave', () => {
    const active = menu.querySelector('.navbar__link.is-active') || items[0];
    movePill(active, true);
  });

  window.addEventListener('resize', () => {
    const active = menu.querySelector('.navbar__link.is-active') || items[0];
    movePill(active, false);
  }, { passive: true });

  window.addEventListener('scroll', syncFromScroll, { passive: true });

  const active = menu.querySelector('.navbar__link.is-active') || items[0];
  movePill(active, false);
  syncFromScroll();

  window.__navSetActive = (sectionId) => {
    const item = items.find(el => el.dataset.section === sectionId);
    if (item) setActive(item, true);
  };
  window.__navDockRefresh = (animate = true) => {
    const current = menu.querySelector('.navbar__link.is-active') || items[0];
    movePill(current, animate);
  };
}

function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const tray = document.querySelector('.navbar__tray');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('navbar__menu--open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', window.t ? window.t('nav_open') : 'Menü öffnen');
    document.body.classList.remove('menu-open');
    tray?.classList.remove('is-open');
  };

  const openMenu = () => {
    menu.classList.add('navbar__menu--open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', window.t ? window.t('nav_close') : 'Menü schließen');
    document.body.classList.add('menu-open');
    tray?.classList.add('is-open');
  };

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('navbar__menu--open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMenu();
  }, { passive: true });
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initStatsCounter() {
  const counters = document.querySelectorAll('.stats__number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          animateCounter(counter, target);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.stats');
  if (statsSection) observer.observe(statsSection);
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.card, .gallery__item, .process__step, .review, .faq__item, .contact__card, .section__header'
  );

  elements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in--visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

function initPageTransitions() {
  const veil = document.getElementById('pageTransition');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const runVeil = () => {
    if (!veil || prefersReduced) return Promise.resolve();
    return new Promise(resolve => {
      veil.classList.remove('is-active');
      void veil.offsetWidth;
      veil.classList.add('is-active');
      window.setTimeout(resolve, 380);
    });
  };

  const animateSection = (target) => {
    target.classList.remove('section--enter', 'section--flash');
    void target.offsetWidth;
    target.classList.add('section--enter', 'section--flash');
    window.setTimeout(() => {
      target.classList.remove('section--enter', 'section--flash');
    }, 850);
  };

  const goToSection = async (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    await runVeil();

    const top = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
    history.pushState(null, '', `#${id}`);

    if (window.__navSetActive) {
      window.__navSetActive(id);
    }

    if (!prefersReduced) {
      window.setTimeout(() => animateSection(target), 120);
    }
  };

  document.querySelectorAll('a[data-nav-link], a[href^="#"]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('http') || href.endsWith('.html')) return;
    if (!href.startsWith('#')) return;

    link.addEventListener('click', async (e) => {
      e.preventDefault();
      await goToSection(href.slice(1));
    });
  });

  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    link.addEventListener('click', async (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target === '_blank') return;
      e.preventDefault();
      if (veil && !prefersReduced) {
        veil.classList.remove('is-active');
        void veil.offsetWidth;
        veil.classList.add('is-active');
        await new Promise(r => setTimeout(r, 380));
      }
      window.location.href = link.href;
    });
  });

  if (veil && !prefersReduced) {
    document.body.classList.add('page-enter');
    window.setTimeout(() => document.body.classList.remove('page-enter'), 700);
  }
}

function initWorkGallery() {
  const gallery = document.getElementById('workGallery');
  if (!gallery) return;

  gallery.querySelectorAll('.work-gallery__video').forEach((video) => {
    const item = video.closest('.work-gallery__item');
    video.addEventListener('error', () => {
      if (item) item.classList.add('is-hidden');
    }, { once: true });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      }, { threshold: 0.35 });
      observer.observe(video);
    } else {
      video.play().catch(() => {});
    }
  });
}

function initHeroVideo() {
  const video = document.querySelector('.hero__video');
  const hero = document.querySelector('.hero');
  if (!video) return;

  const play = () => {
    if (video.paused) {
      video.play().catch(() => {});
    }
  };

  video.addEventListener('loadeddata', play, { once: true });
  if (video.readyState >= 2) play();

  if (hero && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else video.pause();
    }, { threshold: 0.15 });
    observer.observe(hero);
  }
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const CONTACT_EMAIL = 'handwerkhoxha@gmail.com';
  const submitBtn = document.getElementById('formSubmitBtn');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');

  const mailCopy = {
    de: {
      hello: 'Hallo,',
      intro: 'eine neue Anfrage ist über die Website eingegangen.',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      service: 'Leistung',
      message: 'Nachricht',
      notSpecified: 'Nicht angegeben',
      subject: 'Neue Anfrage'
    },
    en: {
      hello: 'Hello,',
      intro: 'a new enquiry has been submitted via the website.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      service: 'Service',
      message: 'Message',
      notSpecified: 'Not specified',
      subject: 'New enquiry'
    },
    tr: {
      hello: 'Merhaba,',
      intro: 'web sitesinden yeni bir talep geldi.',
      name: 'Ad',
      email: 'E-posta',
      phone: 'Telefon',
      service: 'Hizmet',
      message: 'Mesaj',
      notSpecified: 'Belirtilmedi',
      subject: 'Yeni talep'
    },
    ar: {
      hello: 'مرحباً،',
      intro: 'وصل طلب جديد عبر الموقع.',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      service: 'الخدمة',
      message: 'الرسالة',
      notSpecified: 'غير محدد',
      subject: 'طلب جديد'
    },
    pl: {
      hello: 'Dzień dobry,',
      intro: 'wpłynęło nowe zapytanie ze strony internetowej.',
      name: 'Imię i nazwisko',
      email: 'E-mail',
      phone: 'Telefon',
      service: 'Usługa',
      message: 'Wiadomość',
      notSpecified: 'Nie podano',
      subject: 'Nowe zapytanie'
    },
    ru: {
      hello: 'Здравствуйте,',
      intro: 'через сайт поступила новая заявка.',
      name: 'Имя',
      email: 'Эл. почта',
      phone: 'Телефон',
      service: 'Услуга',
      message: 'Сообщение',
      notSpecified: 'Не указано',
      subject: 'Новая заявка'
    },
    ro: {
      hello: 'Bună ziua,',
      intro: 'a sosit o solicitare nouă de pe site.',
      name: 'Nume',
      email: 'E-mail',
      phone: 'Telefon',
      service: 'Serviciu',
      message: 'Mesaj',
      notSpecified: 'Nespecificat',
      subject: 'Solicitare nouă'
    },
    it: {
      hello: 'Buongiorno,',
      intro: 'è arrivata una nuova richiesta dal sito.',
      name: 'Nome',
      email: 'E-mail',
      phone: 'Telefono',
      service: 'Servizio',
      message: 'Messaggio',
      notSpecified: 'Non specificato',
      subject: 'Nuova richiesta'
    },
    uk: {
      hello: 'Вітаємо,',
      intro: 'через сайт надійшов новий запит.',
      name: 'Ім’я',
      email: 'Ел. пошта',
      phone: 'Телефон',
      service: 'Послуга',
      message: 'Повідомлення',
      notSpecified: 'Не вказано',
      subject: 'Новий запит'
    },
    sq: {
      hello: 'Përshëndetje,',
      intro: 'ka arritur një kërkesë e re nga faqja e internetit.',
      name: 'Emri',
      email: 'E-mail',
      phone: 'Telefoni',
      service: 'Shërbimi',
      message: 'Mesazhi',
      notSpecified: 'Nuk është specifikuar',
      subject: 'Kërkesë e re'
    }
  };

  const buildMailBlock = (copy, data) => [
    copy.hello,
    '',
    copy.intro,
    '',
    `${copy.name}: ${data.name}`,
    `${copy.email}: ${data.email}`,
    `${copy.phone}: ${data.phone}`,
    '',
    `${copy.message}:`,
    data.message
  ].join('\n');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (form._honey.value) return;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();
    const lang = document.documentElement.lang || 'de';
    const userCopy = mailCopy[lang] || mailCopy.de;
    const deCopy = mailCopy.de;

    const userData = {
      name,
      email,
      phone: phone || userCopy.notSpecified,
      message
    };
    const deData = {
      name,
      email,
      phone: phone || deCopy.notSpecified,
      message
    };

    let text = buildMailBlock(userCopy, userData);
    if (lang !== 'de') {
      text += '\n\n------------------------------\nDeutsch:\n\n' + buildMailBlock(deCopy, deData);
    }

    successMsg.hidden = true;
    errorMsg.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = window.t ? window.t('form_sending') : 'Wird gesendet...';

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          _replyto: email,
          message: text,
          _subject: `${userCopy.subject}: ${name}`,
          _captcha: 'false',
          _template: 'basic'
        })
      });

      if (!response.ok) throw new Error('Send failed');

      form.reset();
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch {
      errorMsg.hidden = false;
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = window.t ? window.t('form_submit') : 'Anfrage senden';
    }
  });
}
