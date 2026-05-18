// Password protection script for static site
// Hash for password 'pingus13' (SHA-256): 866a003416ef4dd95f6a52237687d22f8a8018cecc40283e4de9c52d26a0f4d9
const PASSWORD_HASH = '866a003416ef4dd95f6a52237687d22f8a8018cecc40283e4de9c52d26a0f4d9';

function createPasswordModal() {
  const modal = document.createElement('div');
  modal.id = 'password-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.zIndex = '99999';
  modal.innerHTML = `
    <div style="background:#ffffff;padding:4rem 3.5rem;border:1px solid #e0e0e0;box-shadow:0 8px 32px rgba(0,0,0,0.1);display:flex;flex-direction:column;align-items:center;gap:1.5rem;min-width:360px;max-width:95vw;">
      <div style="font-size:2.5rem;line-height:1;margin-bottom:0.5rem;">🔒</div>
      <h2 style="color:#000;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;margin:0 0 0.5rem 0;letter-spacing:0;font-size:2rem;font-weight:700;">ACCÈS PORTFOLIO</h2>
      <div style="color:#333;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-size:1.1rem;margin-bottom:0.5rem;font-weight:400;">Sciacca Flavio</div>
      <div style="color:#666;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-size:1rem;text-align:center;margin-bottom:1.5rem;font-weight:300;">Merci d'entrer votre mot de passe pour accéder au portfolio</div>
      <label for="password-input" style="color:#333;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;font-size:0.95rem;align-self:flex-start;margin-bottom:0.5rem;font-weight:500;">Mot de passe</label>
      <input id="password-input" type="password" placeholder="Entrez le mot de passe" style="padding:0.9rem 1.2rem;font-size:1rem;border-radius:4px;border:1px solid #e0e0e0;background:#fff;color:#333;width:100%;outline:none;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;transition:border 0.3s;" autofocus />
      <button id="password-submit" style="margin-top:0.5rem;padding:0.9rem 2rem;background:#000;color:#fff;font-weight:600;border:2px solid #000;border-radius:4px;font-size:1rem;cursor:pointer;transition:all 0.3s;width:100%;text-transform:uppercase;letter-spacing:1px;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Accéder</button>
      <div id="password-error" style="color:#dc3545;min-height:1.5em;font-size:0.9em;text-align:center;"></div>
      <div style="margin-top:2rem;font-size:0.85rem;color:#999;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">© 2026 Sciacca Flavio — Portfolio Privé</div>
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
