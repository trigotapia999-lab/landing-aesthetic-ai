// Initialize Lucide icons
lucide.createIcons();

const modal = document.getElementById('leadModal');
const modalBox = document.getElementById('modalBox');
const successMessage = document.getElementById('successMessage');
const leadForm = document.getElementById('leadForm');

function openModal() {
    modal.classList.remove('hidden');
    // Small delay to allow display:block to apply before transition
    setTimeout(() => {
        modalBox.classList.remove('scale-95', 'opacity-0');
        modalBox.classList.add('scale-100', 'opacity-100');
    }, 10);

    // Reset form state if it was submitted before
    if (leadForm) leadForm.reset();
    if (leadForm) leadForm.style.display = 'block';
    successMessage.classList.add('hidden');
    successMessage.classList.remove('flex');
}

function closeModal() {
    modalBox.classList.remove('scale-100', 'opacity-100');
    modalBox.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Wait for transition to finish
}



// FAQ Toggle Logic
function toggleFaq(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);

    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0px';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Scroll Reveal Animations & Formspree
document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    const reveals = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Dejar de observar una vez que se muestra
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% del elemento es visible
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Formspree Integration
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const originalBtnText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 mx-auto animate-spin"></i>';
            submitBtn.disabled = true;
            lucide.createIcons();

            const formData = new FormData(leadForm);

            try {
                // ID de Formspree actualizado
                const response = await fetch('https://formspree.io/f/xeerqwqp', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    leadForm.style.display = 'none';
                    document.querySelector('#modalBox > div.text-center').style.display = 'none';
                    successMessage.classList.remove('hidden');
                    successMessage.classList.add('flex');

                    setTimeout(() => {
                        document.querySelector('#modalBox > div.text-center').style.display = 'block';
                    }, 500);

                    leadForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert("Hubo un problema al enviar la solicitud. Por favor intenta de nuevo.");
                    }
                }
            } catch (error) {
                alert("Hubo un problema de conexión. Por favor intenta de nuevo.");
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                lucide.createIcons();
            }
        });
    }
});
