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

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Update aria-label for the toggle button
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  // Apply theme immediately to prevent flash
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function () {
        const current = htmlEl.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    // Also listen for OS-level preference changes
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', function (e) {
        // Only auto-switch if user hasn't explicitly chosen
        if (!localStorage.getItem(THEME_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
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
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      if (!mobileNav || !menuToggle) return;
      mobileNav.classList.remove('is-open');
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
      if (e.key === 'Escape') closeMenu();
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
      const navObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const id = entry.target.getAttribute('id');
              navLinks.forEach(function (link) {
                link.classList.toggle(
                  'is-active',
                  link.getAttribute('href') === '#' + id
                );
              });
            }
          });
        },
        {
          rootMargin: '-20% 0px -70% 0px',
        }
      );

      sections.forEach(function (section) {
        navObserver.observe(section);
      });
    }

    /* --------------------------------------------------------
       SCROLL REVEAL (IntersectionObserver)
       One observer for all .reveal elements.
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
       GITHUB PROJECTS — Fetch repos from the public API
       Shows skeleton loaders while fetching, falls back to
       static placeholder cards on error/empty/rate-limit.
       -------------------------------------------------------- */
    var projectsContainer = document.getElementById('projects-container');

    // GitHub language colors (subset for common languages)
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

    function renderFallbackCards() {
      if (!projectsContainer) return;
      /* Add your project here — replace these placeholder cards
         with real project data or customize the static fallback */
      projectsContainer.innerHTML = '';
      for (var i = 0; i < 3; i++) {
        var card = document.createElement('div');
        card.className = 'project-card project-card--placeholder';
        card.innerHTML =
          '<p class="project-card-name">Add your project here</p>';
        projectsContainer.appendChild(card);
      }
    }

    function renderRepoCards(repos) {
      if (!projectsContainer) return;
      projectsContainer.innerHTML = '';

      // Filter out forked repos and those without descriptions, take up to 6
      var filtered = repos
        .filter(function (r) {
          return !r.fork;
        })
        .slice(0, 6);

      if (filtered.length === 0) {
        renderFallbackCards();
        return;
      }

      filtered.forEach(function (repo) {
        var langColor = langColors[repo.language] || '#8B949E';
        var card = document.createElement('a');
        card.className = 'project-card';
        card.href = repo.html_url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.innerHTML =
          '<div class="project-card-header">' +
          '<span class="project-card-name">' +
          escapeHtml(repo.name) +
          '</span>' +
          '<span class="project-card-icon">' +
          '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M6 3L11 8L6 13"/>' +
          '</svg>' +
          '</span>' +
          '</div>' +
          '<p class="project-card-desc">' +
          escapeHtml(repo.description || 'No description available.') +
          '</p>' +
          '<div class="project-card-meta">' +
          (repo.language
            ? '<span class="project-meta-item">' +
              '<span class="project-lang-dot" style="background-color:' +
              langColor +
              '"></span>' +
              escapeHtml(repo.language) +
              '</span>'
            : '') +
          '<span class="project-meta-item">' +
          '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>' +
          (repo.stargazers_count || 0) +
          '</span>' +
          '</div>';

        projectsContainer.appendChild(card);
      });
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    if (projectsContainer) {
      fetch(
        'https://api.github.com/users/adamlogman/repos?sort=pushed&per_page=6'
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
       If profile.jpg fails to load, hide it and show the
       initials placeholder that sits behind it.
       -------------------------------------------------------- */
    var profileImg = document.getElementById('profile-img');
    if (profileImg) {
      profileImg.addEventListener('error', function () {
        this.style.display = 'none';
      });

      // If the image already errored before this listener attached
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
