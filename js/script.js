/* ============================================================
   Adam Logman — Portfolio Scripts
   Dependency-free vanilla JS.
   ============================================================ */

(function () {
  'use strict';

  /* --------------------------------------------------------
     THEME TOGGLE
     Priority: localStorage → OS preference → light
     -------------------------------------------------------- */
  const THEME_KEY = 'adam-theme-preference';
  const htmlEl = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  function applyTheme(theme, saveUserChoice) {
    htmlEl.setAttribute('data-theme', theme);
    if (saveUserChoice) {
      localStorage.setItem(THEME_KEY, theme);
    }
    // Update aria-label for the toggle button
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  // Apply theme immediately to prevent flash, without overwriting localStorage default
  applyTheme(getPreferredTheme(), false);

  document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      });
    }

    // Also listen for OS-level preference changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function (e) {
        // Only auto-switch if user hasn't explicitly chosen
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      });

    /* --------------------------------------------------------
       MOBILE MENU
       -------------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavLinks = mobileNav
      ? mobileNav.querySelectorAll('.mobile-nav-link')
      : [];

    function openMenu() {
      if (!mobileNav || !menuToggle) return;
      mobileNav.classList.add('is-open');
      mobileNav.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (mobileNavClose) mobileNavClose.focus();
    }

    function closeMenu() {
      if (!mobileNav || !menuToggle) return;
      mobileNav.classList.remove('is-open');
      mobileNav.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', function () {
        const isOpen = mobileNav.classList.contains('is-open');
        isOpen ? closeMenu() : openMenu();
      });
    }

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeMenu);
    }

    mobileNavLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('is-open')) {
        closeMenu();
        if (menuToggle) menuToggle.focus();
      }
    });

    // Close when clicking the overlay background
    if (mobileNav) {
      mobileNav.addEventListener('click', function (e) {
        if (e.target === mobileNav) closeMenu();
      });
    }

    /* --------------------------------------------------------
       ACTIVE NAV HIGHLIGHTING ON SCROLL
       -------------------------------------------------------- */
    const navLinks = document.querySelectorAll('.header-nav-link');
    const sections = document.querySelectorAll(
      '.content-section, .hero-section, .site-footer'
    );

    if (sections.length > 0 && navLinks.length > 0) {
      const visibleSections = new Map();

      const navObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            const id = entry.target.getAttribute('id');
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio);
            } else {
              visibleSections.delete(id);
            }
          });

          // Highlight the section that is most visible
          let activeId = '';
          let maxRatio = -1;
          visibleSections.forEach(function (ratio, id) {
            if (ratio > maxRatio && id !== 'hero') {
              maxRatio = ratio;
              activeId = id;
            }
          });

          navLinks.forEach(function (link) {
            link.classList.toggle(
              'is-active',
              link.getAttribute('href') === '#' + activeId
            );
          });
        },
        {
          threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
          rootMargin: '-10% 0px -40% 0px',
        }
      );

      sections.forEach(function (section) {
        navObserver.observe(section);
      });
    }

    /* --------------------------------------------------------
       SCROLL REVEAL (IntersectionObserver)
       -------------------------------------------------------- */
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
      const revealElements = document.querySelectorAll('.reveal');
      if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver(
          function (entries, observer) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px',
          }
        );

        revealElements.forEach(function (el) {
          revealObserver.observe(el);
        });
      }
    }

    /* --------------------------------------------------------
       GITHUB PROJECTS — Fetch repos & fallback cards
       -------------------------------------------------------- */
    var projectsContainer = document.getElementById('projects-container');

    // Language color definitions
    var langColors = {
      Python: '#3572A5',
      JavaScript: '#F1E05A',
      TypeScript: '#3178C6',
      HTML: '#E34C26',
      CSS: '#563D7C',
      Jupyter: '#DA5B0B',
      'Jupyter Notebook': '#DA5B0B',
      Shell: '#89E051',
      R: '#198CE7',
      Dockerfile: '#384D54',
      Java: '#B07219',
      'C++': '#F34B7D',
      C: '#555555',
      Go: '#00ADD8',
      Rust: '#DEA584',
    };

    // Custom descriptions & metadata for Adam's repositories
    var repoMetaMap = {
      'AirQo-api': {
        name: 'AirQo Air Quality ML API & Pipeline',
        desc: 'Continent-scale air quality monitoring system blending Sentinel satellite data with sparse sensor networks for PM2.5 prediction across Africa.',
        lang: 'Python'
      },
      'AMP-Parkinson-s-Disease-Progression-Prediction.': {
        name: 'AMP Parkinson\'s Disease Progression Prediction',
        desc: 'Kaggle competition solution predicting Parkinson\'s disease progression using mass spectrometry protein and peptide data.',
        lang: 'Jupyter Notebook'
      },
      'DataDrive2030-Early-Learning-Predictors-Challenge': {
        name: 'DataDrive2030 Early Learning Predictors',
        desc: 'Zindi challenge model evaluating early childhood development indicators to predict learning outcomes in South Africa.',
        lang: 'Jupyter Notebook'
      },
      'Zindi': {
        name: 'Zindi Competitive ML Solutions',
        desc: 'Collection of top-performing machine learning pipelines, feature engineering techniques, and model ensembles for Zindi competitions (Top 1% Rank).',
        lang: 'Jupyter Notebook'
      },
      'Deployment': {
        name: 'Production ML Deployment Pipeline',
        desc: 'End-to-end MLOps pipeline featuring model deployment, containerized inference with Docker, and automated CI/CD workflows on GCP.',
        lang: 'Python'
      },
      'MLops': {
        name: 'MLOps & Model Tracking Architecture',
        desc: 'Scalable machine learning operations platform incorporating experiment tracking with MLflow, model registry, and monitoring.',
        lang: 'Python'
      },
      'Kaggle': {
        name: 'Kaggle Competition Pipeline Suite',
        desc: 'Ensemble models, tabular data pipelines, and computer vision models developed for Kaggle Expert-tier competitions.',
        lang: 'Jupyter Notebook'
      }
    };

    // Featured static fallback projects in case GitHub API is unreachable or rate-limited
    var fallbackProjects = [
      {
        name: 'AirQo Air Quality ML Pipeline',
        url: 'https://github.com/adamlogman/AirQo-api',
        desc: 'Continent-scale air quality prediction combining Sentinel satellite imagery with ground sensor networks to estimate PM2.5 levels across Africa.',
        lang: 'Python',
        stars: 0
      },
      {
        name: 'Zindi Competitive ML Suite',
        url: 'https://github.com/adamlogman/Zindi',
        desc: 'Top-performing ML pipelines and model ensembles powering a Top 1% rank among 200,000+ data scientists on Zindi (1 Gold, 3 Silver, 6 Bronze).',
        lang: 'Jupyter Notebook',
        stars: 0
      },
      {
        name: 'Production MLOps & Deployment',
        url: 'https://github.com/adamlogman/Deployment',
        desc: 'Containerized model deployment pipeline built with PyTorch, Docker, MLflow, and GCP for low-latency production inference.',
        lang: 'Python',
        stars: 0
      },
      {
        name: 'AMP Parkinson\'s Disease Progression',
        url: 'https://github.com/adamlogman/AMP-Parkinson-s-Disease-Progression-Prediction.',
        desc: 'Kaggle competition solution analyzing longitudinal protein and peptide mass spectrometry metrics to predict disease progression.',
        lang: 'Jupyter Notebook',
        stars: 0
      },
      {
        name: 'DataDrive2030 Early Learning Predictors',
        url: 'https://github.com/adamlogman/DataDrive2030-Early-Learning-Predictors-Challenge',
        desc: 'Machine learning model predicting early childhood development outcomes using survey data and socioeconomic predictors.',
        lang: 'Jupyter Notebook',
        stars: 0
      },
      {
        name: 'Kaggle Competition Pipeline Suite',
        url: 'https://github.com/adamlogman/Kaggle',
        desc: 'Ensemble learning framework and computer vision/NLP model architectures built for Kaggle Expert-tier competitions.',
        lang: 'Jupyter Notebook',
        stars: 0
      }
    ];

    function renderFallbackCards() {
      if (!projectsContainer) return;
      projectsContainer.innerHTML = '';
      fallbackProjects.forEach(function (project) {
        var card = createProjectCard(
          project.name,
          project.url,
          project.desc,
          project.lang,
          project.stars
        );
        projectsContainer.appendChild(card);
      });
    }

    function createProjectCard(name, url, desc, lang, stars) {
      var langColor = langColors[lang] || '#8B949E';
      var card = document.createElement('a');
      card.className = 'project-card';
      card.href = url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.innerHTML =
        '<div class="project-card-header">' +
        '<span class="project-card-name">' +
        escapeHtml(name) +
        '</span>' +
        '<span class="project-card-icon">' +
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 3L11 8L6 13"/>' +
        '</svg>' +
        '</span>' +
        '</div>' +
        '<p class="project-card-desc">' +
        escapeHtml(desc) +
        '</p>' +
        '<div class="project-card-meta">' +
        (lang
          ? '<span class="project-meta-item">' +
            '<span class="project-lang-dot" style="background-color:' +
            langColor +
            '"></span>' +
            escapeHtml(lang) +
            '</span>'
          : '') +
        '<span class="project-meta-item">' +
        '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>' +
        (stars || 0) +
        '</span>' +
        '</div>';
      return card;
    }

    function renderRepoCards(repos) {
      if (!projectsContainer) return;
      projectsContainer.innerHTML = '';

      // Filter out utility repos and forks if enough original repos exist
      var filtered = repos.filter(function (r) {
        return r.name !== 'adam_logman' && r.name !== 'Portfolio-';
      });

      var nonForks = filtered.filter(function (r) { return !r.fork; });
      var selected = (nonForks.length >= 3 ? nonForks : filtered).slice(0, 6);

      if (selected.length === 0) {
        renderFallbackCards();
        return;
      }

      selected.forEach(function (repo) {
        var meta = repoMetaMap[repo.name] || {};
        var displayName = meta.name || formatRepoName(repo.name);
        var displayDesc = repo.description || meta.desc || 'Machine learning and data science project by Adam Logman.';
        var displayLang = repo.language || meta.lang || 'Python';

        var card = createProjectCard(
          displayName,
          repo.html_url,
          displayDesc,
          displayLang,
          repo.stargazers_count
        );
        projectsContainer.appendChild(card);
      });
    }

    function formatRepoName(name) {
      return name
        .replace(/[-_.]+/g, ' ')
        .replace(/\b\w/g, function (l) { return l.toUpperCase(); })
        .trim();
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    if (projectsContainer) {
      fetch(
        'https://api.github.com/users/adamlogman/repos?sort=pushed&per_page=30'
      )
        .then(function (res) {
          if (!res.ok) throw new Error('GitHub API error: ' + res.status);
          return res.json();
        })
        .then(function (repos) {
          if (!Array.isArray(repos) || repos.length === 0) {
            renderFallbackCards();
          } else {
            renderRepoCards(repos);
          }
        })
        .catch(function () {
          renderFallbackCards();
        });
    }

    /* --------------------------------------------------------
       PROFILE PHOTO FALLBACK
       -------------------------------------------------------- */
    var profileImg = document.getElementById('profile-img');
    if (profileImg) {
      profileImg.addEventListener('error', function () {
        this.style.display = 'none';
      });

      if (profileImg.complete && profileImg.naturalWidth === 0) {
        profileImg.style.display = 'none';
      }
    }

    /* --------------------------------------------------------
       COPYRIGHT YEAR
       -------------------------------------------------------- */
    var yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });
})();

