// CONTACT FORM MAILTO HANDLER
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form[action^="mailto:"]');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Construct email body
            const body = `NOM: ${name}
EMAIL: ${email}

MESSAGE:
${message}`;

            // Create mailto link
            const mailtoLink = `mailto:FlavioSciacca28@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Open mail client
            window.location.href = mailtoLink;
        });
    }
});