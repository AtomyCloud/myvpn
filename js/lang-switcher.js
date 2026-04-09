
(function () {
  const switchers = document.querySelectorAll('[data-lang-switcher]');
  if (!switchers.length) return;

  const html = document.documentElement;
  const currentLang = html.dataset.currentLang || 'en';
  const pageKey = html.dataset.pageKey || 'home';
  const rootPath = html.dataset.rootPath || '.';
  const pageMap = {
    home: 'index.html',
    privacy: 'privacy-policy.html',
    terms: 'terms.html'
  };

  const pageFile = pageMap[pageKey] || 'index.html';
  const siteRoot = new URL((rootPath.endsWith('/') ? rootPath : rootPath + '/') , window.location.href);

  function buildTargetUrl(lang) {
    const prefix = lang === 'en' ? '' : `lang/${lang}/`;
    return new URL(prefix + pageFile, siteRoot).href;
  }

  function closeAll(except) {
    switchers.forEach((switcher) => {
      if (switcher !== except) {
        switcher.classList.remove('is-open');
        const toggle = switcher.querySelector('.lang-switcher__toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  switchers.forEach((switcher) => {
    const toggle = switcher.querySelector('.lang-switcher__toggle');
    const options = switcher.querySelectorAll('[data-lang-target]');

    if (!toggle) return;

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isOpen = switcher.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) closeAll(switcher);
    });

    options.forEach((option) => {
      const optionLang = option.getAttribute('data-lang-target');
      const isActive = optionLang === currentLang;
      option.setAttribute('aria-checked', String(isActive));
      option.classList.toggle('is-active', isActive);

      option.addEventListener('click', () => {
        if (!optionLang || optionLang === currentLang) {
          switcher.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          return;
        }

        try {
          window.localStorage.setItem('myvpn-preferred-language', optionLang);
        } catch (error) {
          // Ignore storage errors and continue navigation.
        }

        window.location.href = buildTargetUrl(optionLang);
      });
    });
  });

  document.addEventListener('click', (event) => {
    switchers.forEach((switcher) => {
      if (!switcher.contains(event.target)) {
        switcher.classList.remove('is-open');
        const toggle = switcher.querySelector('.lang-switcher__toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
