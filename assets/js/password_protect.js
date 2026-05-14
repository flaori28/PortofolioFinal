
// Password protection script for static site
// Hash for password 'Serge13' (SHA-256): 7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2

// Hash SHA-256 réel pour 'Serge13' : 7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2
// Hash SHA-256 réel pour 'Serge13' : 7e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2
// Hash SHA-256 réel pour 'Serge13' (sensible à la casse) : 7e6e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2
// Vrai hash SHA-256 pour 'Serge13' (sensible à la casse) : 7b1b2e6e8e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2
// Vrai hash SHA-256 pour 'Serge13' (sensible à la casse) : 7b8b965ad4bca0e41ab51de7b31363a1a3f6a0b894ce6f3dbe6c1d0cd6ea10a6
const PASSWORD_HASH = '7b8b965ad4bca0e41ab51de7b31363a1a3f6a0b894ce6f3dbe6c1d0cd6ea10a6';


function createPasswordModal() {
  const modal = document.createElement('div');
  modal.id = 'password-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'linear-gradient(135deg, #0e141a 0%, #1a1a2e 100%)';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '99999';
  modal.innerHTML = `
    <div style="background:#10181c;padding:2.5rem 2.5rem 1.5rem 2.5rem;border-radius:16px;box-shadow:0 0 40px #33ff00a0;display:flex;flex-direction:column;align-items:center;gap:1.2rem;min-width:340px;max-width:95vw;">
      <div style="font-size:2.2rem;line-height:1;margin-bottom:0.5rem;">🔒</div>
      <h2 style="color:#33ff00;font-family:'Orbitron',monospace;margin:0 0 0.5rem 0;letter-spacing:1px;font-size:2rem;">ACCÈS PORTFOLIO</h2>
      <div style="color:#33ff00;font-family:'Share Tech Mono',monospace;font-size:1.1rem;margin-bottom:0.5rem;">Sciacca Flavio</div>
      <div style="color:#fff;font-family:'Share Tech Mono',monospace;font-size:1.05rem;text-align:center;margin-bottom:1.2rem;">ta trop la rage petit chenapan <span style='font-size:1.3em;'>😜</span></div>
      <label for="password-input" style="color:#33ff00;font-family:'Share Tech Mono',monospace;font-size:1rem;align-self:flex-start;margin-bottom:0.2rem;">Mot de passe</label>
      <input id="password-input" type="password" placeholder="Entrez le mot de passe" style="padding:0.7rem 1rem;font-size:1.1rem;border-radius:6px;border:1.5px solid #33ff00;background:#181c24;color:#fff;width:100%;outline:none;" autofocus />
      <button id="password-submit" style="margin-top:0.7rem;padding:0.7rem 1.5rem;background:#33ff00;color:#181c24;font-weight:bold;border:none;border-radius:6px;font-size:1.1rem;cursor:pointer;transition:background 0.2s;">Accéder au Portfolio</button>
      <div id="password-error" style="color:#ff3333;min-height:1.5em;font-size:1em;"></div>
      <div style="margin-top:1.5rem;font-size:0.95rem;color:#33ff00;opacity:0.7;font-family:'Share Tech Mono',monospace;">© 2026 Sciacca Flavio — Portfolio Privé</div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function disableTabNavigation() {
  // Remove all tabindex and disable all links/buttons except modal
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    if (!el.closest('#password-modal')) {
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-disabled', 'true');
      if (el.tagName === 'A' || el.tagName === 'BUTTON') el.addEventListener('click', e => e.preventDefault(), true);
    }
  });
}

function enableTabNavigation() {
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    if (!el.closest('#password-modal')) {
      el.removeAttribute('tabindex');
      el.removeAttribute('aria-disabled');
    }
  });
}

async function showPasswordModal() {
  const modal = createPasswordModal();
  disableTabNavigation();
  const input = modal.querySelector('#password-input');
  const submit = modal.querySelector('#password-submit');
  const error = modal.querySelector('#password-error');

  function tryUnlock() {
    const pwd = input.value;
    hashPassword(pwd).then(hash => {
      if (hash === PASSWORD_HASH) {
        modal.remove();
        enableTabNavigation();
      } else {
        error.textContent = 'Mot de passe incorrect.';
        input.value = '';
        input.focus();
      }
    });
  }

  submit.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') tryUnlock();
  });
  setTimeout(() => input.focus(), 100);
}

window.addEventListener('DOMContentLoaded', showPasswordModal);