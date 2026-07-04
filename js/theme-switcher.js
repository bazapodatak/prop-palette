(function() {
  var KEY = 'themer-pref';
  var THEMES = ['light', 'dark', 'solarized', 'high-contrast'];
  var VARS = ['--bg', '--bg-secondary', '--fg', '--fg-muted', '--accent', '--accent-hover', '--card', '--border', '--shadow-color'];
  var root = document.documentElement;
  var btns = document.querySelectorAll('.switcher-btn');
  var grid = document.getElementById('swatches');

  function getInitial() {
    try {
      var s = localStorage.getItem(KEY);
      if (s && THEMES.indexOf(s) !== -1) return s;
    } catch(e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function apply(theme) {
    if (THEMES.indexOf(theme) === -1) return;
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch(e) {}
    
    btns.forEach(function(btn) {
      if (btn.getAttribute('data-theme') === theme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    updateSwatches();
  }

  function buildSwatches() {
    if (!grid) return;
    grid.innerHTML = '';
    VARS.forEach(function(name) {
      var div = document.createElement('div');
      div.className = 'swatch';
      div.innerHTML = '<div class="swatch-color" data-c="'+name+'"></div><div class="swatch-name">'+name+'</div><div class="swatch-value" data-v="'+name+'"></div>';
      grid.appendChild(div);
    });
    updateSwatches();
  }

  function updateSwatches() {
    var cs = getComputedStyle(root);
    VARS.forEach(function(name) {
      var val = cs.getPropertyValue(name).trim();
      var cEl = document.querySelector('[data-c="'+name+'"]');
      var vEl = document.querySelector('[data-v="'+name+'"]');
      if (cEl) cEl.style.backgroundColor = val;
      if (vEl) vEl.textContent = val;
    });
  }

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      apply(this.getAttribute('data-theme'));
    });
  });

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      try {
        if (!localStorage.getItem(KEY)) {
          apply(e.matches ? 'dark' : 'light');
        }
      } catch(err) {}
    });
  }

  apply(getInitial());
  buildSwatches();
})();
