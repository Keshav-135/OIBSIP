document.addEventListener('DOMContentLoaded', () => {
  //--========= Select DOM elements===============--
  const sections = document.querySelectorAll('.section');
  const navItems = document.querySelectorAll('.nav-links li');
  const navLinks = document.querySelectorAll('.nav-links a, .home-text .btn, .about-btns .btn-secondary');
  const aside = document.querySelector('aside');
  const navToggler = document.querySelector('.nav-toggler') || document.getElementById('nav-toggler');
  const themePanel = document.querySelector('.theme-panel') || document.getElementById('theme-panel');
  const darkModeBtn = document.querySelector('.control-btn:nth-child(2)') || document.getElementById('dark-mode-btn');
  const settingsBtn = document.querySelector('.control-btn:nth-child(1)') || document.getElementById('theme-settings-btn');
  const colorBoxes = document.querySelectorAll('.color-box');

  //--========== Cache form elements============--
  const contactForm = document.querySelector('.contact-form') || document.getElementById('contact-form');
  const popupOverlay = document.querySelector('.popup-overlay') || document.getElementById('popup-overlay');
  const popupCloseBtn = document.querySelector('.popup-close-btn') || document.getElementById('popup-close-btn');

  //--=========== Cache popup elements===========--
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  const projectDetailPopup = document.getElementById('project-detail-popup');
  const projectPopupTitle = document.getElementById('project-popup-title');
  const projectPopupText = document.getElementById('project-popup-text');
  const projectPopupCloseBtn = document.getElementById('project-popup-close-btn');

  // --==============Handle intro animation==========--
  window.addEventListener('load', () => {
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
      setTimeout(() => {
        introScreen.classList.add('fade-out');
      }, 2000);
    }
  });

  //--========== Observe section visibility==========--
  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-anim');
        } else {
          entry.target.classList.remove('active-anim');
        }
      });
    }, { root: null, threshold: 0.15 });

    sections.forEach(section => sectionObserver.observe(section));
  }

  //--=========== Update active navigation=========--
  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      const link = item.querySelector('a');
      if (link) {
        const href = link.getAttribute('href');
        if (href === `#${current}` || item.getAttribute('data-target') === current) {
          item.classList.add('active');
        }
      }
    });
  });

  //--============= Handle smooth scrolling==========--
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.getElementById(href.substring(1));

        if (targetSection) {
          targetSection.classList.remove('active-anim');
          targetSection.scrollIntoView({ behavior: 'smooth' });

          setTimeout(() => {
            targetSection.classList.add('active-anim');
          }, 100);
        }
      }

      if (aside) aside.classList.remove('open');
      if (navToggler) navToggler.classList.remove('active');
      if (themePanel) themePanel.classList.remove('active');
    });
  });

  //--============ Toggle mobile menu===========--
  if (navToggler && aside) {
    navToggler.addEventListener('click', () => {
      aside.classList.toggle('open');
      navToggler.classList.toggle('active');
      if (themePanel) themePanel.classList.remove('active');
    });
  }

  //--============ Toggle dark mode===========--
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const icon = darkModeBtn.querySelector('i');
      if (icon) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        icon.classList.toggle('fa-moon', !isDarkMode);
        icon.classList.toggle('fa-sun', isDarkMode);
      }
    });
  }

  //--==========Toggle theme panel============--
  if (settingsBtn && themePanel) {
    settingsBtn.addEventListener('click', () => {
      themePanel.classList.toggle('active');
    });
  }

  //--========== Update theme color============--
  colorBoxes.forEach(box => {
    box.addEventListener('click', () => {
      const color = box.getAttribute('data-color') || box.style.background;
      if (color) {
        document.documentElement.style.setProperty('--skin-color', color);
      }
      if (themePanel) themePanel.classList.remove('active');
    });
  });

  //--============ Handle project slider============--
  const grid = document.getElementById('projectsGrid');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const getScrollAmount = () => {
    const card = grid.querySelector('.projects-item');
    const gap = parseInt(window.getComputedStyle(grid).gap) || 20;
    return card.offsetWidth + gap;
  };

  if (prevBtn && nextBtn && grid) {
    prevBtn.addEventListener('click', () => {
      grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  //--================ Handle form submission=========--
  if (contactForm && popupOverlay) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      popupOverlay.classList.add('active');
      contactForm.reset();
    });
  }

  if (popupOverlay) {
    if (popupCloseBtn) {
      popupCloseBtn.addEventListener('click', () => {
        popupOverlay.classList.remove('active');
      });
    }

    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
      }
    });
  }

  //----======= Handle project details==========--
  readMoreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      const content = btn.getAttribute('data-content');

      if (type === 'problem') {
        projectPopupTitle.textContent = 'Problem Details';
      } else if (type === 'solution') {
        projectPopupTitle.textContent = 'Solution Details';
      }

      projectPopupText.textContent = content;
      if (projectDetailPopup) {
        projectDetailPopup.classList.add('active');
      }
    });
  });

  if (projectDetailPopup) {
    if (projectPopupCloseBtn) {
      projectPopupCloseBtn.addEventListener('click', () => {
        projectDetailPopup.classList.remove('active');
      });
    }

    projectDetailPopup.addEventListener('click', (e) => {
      if (e.target === projectDetailPopup) {
        projectDetailPopup.classList.remove('active');
      }
    });
  }

  //--========== Handle typing effect==========--
  const typingSpan = document.querySelector('.typing-text');
  if (typingSpan) {
    const texts = ["Frontend Developer", "Web Developer"];
    let count = 0;
    let index = 0;

    (function type() {
      if (count === texts.length) count = 0;
      const currentText = texts[count];
      const letter = currentText.slice(0, ++index);

      typingSpan.textContent = letter;

      if (letter.length === currentText.length) {
        count++;
        index = 0;
        setTimeout(type, 2000);
      } else {
        setTimeout(type, 100);
      }
    }());
  }
});