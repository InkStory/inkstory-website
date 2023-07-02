//
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    const createTattooButton = document.getElementById('create-tattoo');
    const soundFileInput = document.getElementById('sound');

    soundFileInput.addEventListener('change', (e) => {
        const file = soundFileInput.files[0];
        const audioEl = document.createElement('audio');
        audioEl.autoplay = false;

        audioEl.addEventListener('loadeddata', () => {
            if (audioEl.duration > 20) {
                alert('this sound file is too big, max 20s');
                soundFileInput.value = null;
                return;
            }
        });

        audioEl.src = URL.createObjectURL(file);
    });

    document.getElementById('tattooModal').addEventListener('hide.bs.modal', () => {
        soundFileInput.value = null;
    });

    createTattooButton.addEventListener('click', () => {
        soundFileInput.click();
    });

});
