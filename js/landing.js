(() => {
  'use strict';
  const navigation = document.getElementById('navigation');
  const menu = document.querySelector('.menu-button');
  function closeMenu() {
    navigation.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    menu.querySelector('span').textContent = '+';
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    navigation.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.querySelector('span').textContent = open ? '−' : '+';
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
  matchMedia('(min-width: 601px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });

  const capabilities = [...document.querySelectorAll('.capability')];
  capabilities.forEach(detail => detail.addEventListener('toggle', () => {
    if (detail.open) capabilities.forEach(other => {
      if (other !== detail) other.open = false;
    });
  }));

  const perspectives = {
    finance: {
      number: '01', title: 'Keep the work moving.',
      description: 'Manage application details, follow bank submissions and keep company records up to date. See where each facility stands before the next follow-up.',
      items: ['Application records & status', 'Company & bank details', 'Assigned officers']
    },
    management: {
      number: '02', title: 'Make an informed call.',
      description: 'Assess proposed financing terms in HOD Review. Look across the portfolio, refer to earlier decisions and prepare reports for the next management discussion.',
      items: ['HOD Review & proposed terms', 'Review History', 'Dashboard & management reports']
    },
    admin: {
      number: '03', title: 'Give your team the right access.',
      description: 'Manage staff roles, page permissions and dashboard chart visibility. Keep access aligned with the responsibilities of each account.',
      items: ['User accounts & roles', 'Staff page permissions', 'Dashboard chart visibility']
    }
  };
  const tabs = [...document.querySelectorAll('[data-team]')];
  function selectTeam(tab) {
    const perspective = perspectives[tab.dataset.team];
    tabs.forEach(item => {
      item.setAttribute('aria-selected', String(item === tab));
      item.tabIndex = item === tab ? 0 : -1;
    });
    document.getElementById('team-panel').setAttribute('aria-labelledby', tab.id);
    document.getElementById('team-number').textContent = perspective.number;
    document.getElementById('team-title').textContent = perspective.title;
    document.getElementById('team-description').textContent = perspective.description;
    document.getElementById('team-items').replaceChildren(...perspective.items.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTeam(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      selectTeam(tabs[next]);
    });
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.hero');
  function syncMotion() {
    hero.classList.toggle('motion-paused', document.hidden || reducedMotion.matches);
  }
  reducedMotion.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
})();
