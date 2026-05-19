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
                statusDiv.innerText = "ERREUR: IDENTIFIANT FORMSPREE MANQUANT. VEUILLEZ CONFIGURER LE FORMULAIRE.";
                return;
            }

            statusDiv.style.display = 'block';
            statusDiv.style.color = 'var(--hud-primary, #0f0)';
            statusDiv.innerText = "ENVOI EN COURS...";
            
            try {
                const response = await fetch(action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    statusDiv.innerHTML = "MESSAGE ENVOYE. <br>MERCI POUR VOTRE CONTACT.";
                    form.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        statusDiv.style.color = 'var(--hud-alert, #f00)';
                        statusDiv.innerText = "ECHEC ENVOI: " + data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        statusDiv.style.color = 'var(--hud-alert, #f00)';
                        statusDiv.innerText = "ECHEC ENVOI: ERREUR INCONNUE";
                    }
                }
            } catch (error) {
                statusDiv.style.color = 'var(--hud-alert, #f00)';
                statusDiv.innerText = "ECHEC RESEAU: IMPOSSIBLE D'ETABLIR LA CONNEXION.";
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initContactForm);