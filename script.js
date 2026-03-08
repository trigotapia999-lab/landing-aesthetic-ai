// Initialize Lucide icons
lucide.createIcons();

// Desactivar clic derecho en toda la página para proteger el contenido
document.addEventListener('contextmenu', (e) => {
    // Solo bloqueamos si el objetivo es un video o está dentro de un contenedor de video
    if (e.target.tagName === 'VIDEO' || e.target.closest('[data-video-src]')) {
        e.preventDefault();
    }
});

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

    successMessage.classList.add('hidden');
    successMessage.classList.remove('flex');

    // TikTok Event: Click en el botón de Auditoría (ViewContent)
    if (typeof ttq !== 'undefined') {
        ttq.track('ClickButton', {
            content_name: 'Abrir Modal Auditoria',
            value: 0,
            currency: 'CLP'
        });
    }
}

function closeModal() {
    modalBox.classList.remove('scale-100', 'opacity-100');
    modalBox.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Wait for transition to finish
}

function loadAndPlayVideo(containerId) {
    const container = document.getElementById(containerId);
    const videoSrc = container.getAttribute('data-video-src');

    // Si ya hay un video, no hacemos nada
    if (container.querySelector('video')) return;

    // Crear el elemento de video
    const video = document.createElement('video');
    video.src = videoSrc;
    video.className = 'absolute inset-0 w-full h-full object-cover z-20';
    video.autoplay = true;
    video.controls = true;
    video.loop = true;

    // Desactivar clic derecho y botón de descarga
    video.setAttribute('controlsList', 'nodownload');
    video.oncontextmenu = (e) => e.preventDefault();

    // Limpiar contenido previo (imagen y botón) pero mantener info
    container.innerHTML = '';
    container.appendChild(video);

    // Forzar el play ya que algunos navegadores bloquean el autoplay
    video.play().catch(error => {
        console.log("El autoplay fue bloqueado por el navegador, el usuario debe interactuar con los controles.");
    });
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

            // Sanitización básica (eliminar etiquetas HTML de los inputs de texto)
            for (let [key, value] of formData.entries()) {
                if (typeof value === 'string') {
                    formData.set(key, value.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
                }
            }

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

                    // TikTok Event: Formulario enviado con éxito (CompleteRegistration)
                    if (typeof ttq !== 'undefined') {
                        ttq.track('CompleteRegistration', {
                            content_name: 'Formulario Auditoria',
                            value: 0,
                            currency: 'CLP'
                        });
                    }

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

// Seguimiento de clic en WhatsApp
document.getElementById('whatsapp-btn')?.addEventListener('click', () => {
    ttq.track('Contact', {
        content_name: 'WhatsApp Chat',
        content_category: 'Lead'
    });
});
