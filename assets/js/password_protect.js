// Password protection script for static site
// Hash for password 'pingus13' (SHA-256): 866a003416ef4dd95f6a52237687d22f8a8018cecc40283e4de9c52d26a0f4d9
const PASSWORD_HASH = '866a003416ef4dd95f6a52237687d22f8a8018cecc40283e4de9c52d26a0f4d9';
const AUTH_FLAG_KEY = 'portfolio_unlocked';

function blockInteraction(event) {
  event.preventDefault();
}

function createPasswordModal() {
  const modal = document.createElement('div');
  modal.id = 'password-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'radial-gradient(1200px 500px at 50% -120px, rgba(255, 230, 170, 0.45), rgba(255, 230, 170, 0) 60%), linear-gradient(180deg, #faf4ec 0%, #f5ede0 60%, #ede0cc 100%)';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '99999';
  modal.innerHTML = `
    <div style="background:linear-gradient(160deg, rgba(250, 244, 236, 0.98) 0%, rgba(237, 224, 204, 0.96) 100%);padding:2.5rem 2.5rem 1.5rem 2.5rem;border-radius:16px;box-shadow:0 14px 34px rgba(125, 85, 30, 0.2), inset 0 1px 0 rgba(255,255,255,0.65);border:1px solid #c8b89a;display:flex;flex-direction:column;align-items:center;gap:1.2rem;min-width:340px;max-width:95vw;">
      <div style="font-size:2.2rem;line-height:1;margin-bottom:0.5rem;color:#c9880a;">🔒</div>
      <h2 style="color:#2e1f0e;font-family:'Cinzel','Cormorant Garamond',serif;margin:0 0 0.5rem 0;letter-spacing:0.08em;font-size:2rem;">ACCES PORTFOLIO</h2>
      <div style="color:#6b4c2a;font-family:'Lora','EB Garamond',serif;font-size:1.1rem;margin-bottom:0.5rem;">Sciacca Flavio</div>
      <div style="color:#6b4c2a;font-family:'Lora','EB Garamond',serif;font-size:1.05rem;text-align:center;margin-bottom:1.2rem;">ta trop la rage petit chenapan <span style='font-size:1.3em;'>😜</span></div>
      <label for="password-input" style="color:#2e1f0e;font-family:'Lora','EB Garamond',serif;font-size:1rem;align-self:flex-start;margin-bottom:0.2rem;">Mot de passe</label>
      <input id="password-input" type="password" placeholder="Entrez le mot de passe" style="padding:0.7rem 1rem;font-size:1.1rem;border-radius:8px;border:1.5px solid #c8b89a;background:#faf4ec;color:#2e1f0e;width:100%;outline:none;box-shadow:inset 0 1px 4px rgba(125, 85, 30, 0.12);" autofocus />
      <button id="password-submit" style="margin-top:0.7rem;padding:0.7rem 1.5rem;background:linear-gradient(160deg, #f5e7d1 0%, #efdfc8 100%);color:#2e1f0e;font-weight:bold;border:1px solid #c89d54;border-radius:8px;font-size:1.1rem;cursor:pointer;transition:all 0.2s;box-shadow:0 6px 16px rgba(180, 125, 38, 0.2);">Acceder au Portfolio</button>
      <div id="password-error" style="color:#b54827;min-height:1.5em;font-size:1em;"></div>
      <div style="margin-top:1.5rem;font-size:0.95rem;color:#6b4c2a;opacity:0.9;font-family:'Lora','EB Garamond',serif;">© 2026 Sciacca Flavio - Portfolio Prive</div>
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
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    if (!el.closest('#password-modal')) {
      el.setAttribute('tabindex', '-1');
      el.setAttribute('aria-disabled', 'true');
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        el.addEventListener('click', blockInteraction, true);
      }
    }
  });
}

function enableTabNavigation() {
  document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
    if (!el.closest('#password-modal')) {
      el.removeAttribute('tabindex');
      el.removeAttribute('aria-disabled');
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        el.removeEventListener('click', blockInteraction, true);
      }
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
        sessionStorage.setItem(AUTH_FLAG_KEY, '1');
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

function isUnlocked() {
  return sessionStorage.getItem(AUTH_FLAG_KEY) === '1';
}

function isHomePage() {
  const path = window.location.pathname.toLowerCase();
  const page = path.split('/').pop();
  return page === '' || page === 'index.html';
}

function enforceAccess() {
  if (isUnlocked()) return;

  if (isHomePage()) {
    showPasswordModal();
    return;
  }

  // Force first unlock on home page, then allow navigating everywhere.
  window.location.replace('index.html');
}

window.addEventListener('DOMContentLoaded', enforceAccess);
