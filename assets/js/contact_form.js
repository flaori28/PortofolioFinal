// CONTACT FORM SYSTEM
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = new FormData(form);
            const action = form.action;
            
            // Basic validation for the ID
            if (action.includes("YOUR_FORM_ID")) {
                statusDiv.style.display = 'block';
                statusDiv.style.color = 'var(--hud-alert, #f00)';
                statusDiv.innerText = "ERREUR SYSTEME: IDENTIFIANT FORMSPREE MANQUANT. VEUILLEZ CONFIGURER LE FORMULAIRE.";
                return;
            }

            statusDiv.style.display = 'block';
            statusDiv.style.color = 'var(--hud-primary, #0f0)';
            statusDiv.innerText = "TRANSMISSION EN COURS...";
            
            try {
                const response = await fetch(action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    statusDiv.innerHTML = "TRANSMISSION REUSSIE. <br>LIAISON TERMINEE.";
                    form.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        statusDiv.style.color = 'var(--hud-alert, #f00)';
                        statusDiv.innerText = "ECHEC TRANSMISSION: " + data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        statusDiv.style.color = 'var(--hud-alert, #f00)';
                        statusDiv.innerText = "ECHEC TRANSMISSION: ERREUR INCONNUE";
                    }
                }
            } catch (error) {
                statusDiv.style.color = 'var(--hud-alert, #f00)';
                statusDiv.innerText = "ECHEC RÉSEAU: IMPOSSIBLE D'ETABLIR LA LIAISON.";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initContactForm);