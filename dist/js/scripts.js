/*!
* Start Bootstrap - New Age v6.0.7 (https://startbootstrap.com/theme/new-age)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-new-age/blob/master/LICENSE)
*/
//
// Scripts
//

const samples = 70;

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
    const saveTattooButton = document.getElementById('save-tattoo');
    const soundFileInput = document.getElementById('sound');

    soundFileInput.addEventListener('change', (e) => {
        const file = soundFileInput.files[0];
        const reader = new FileReader();

        reader.onerror = (error) => console.error(error);
        reader.onload = async () => {
            const audioContext = new AudioContext();
            const audioBuffer = await audioContext.decodeAudioData(reader.result);

            if (audioBuffer.duration > 20) {
                console.error('file is too big');
                return;
            }

            const filteredData = filterData(audioBuffer);
            const normalizedData = normalizeData(filteredData);
            draw(normalizedData);

            createTattooButton.style.display = 'none';
            saveTattooButton.style.display = 'block';
        };

        reader.readAsArrayBuffer(file);
    });

    saveTattooButton.addEventListener('click', () => {
        const svgNode = document.getElementById("tattoo-canvas").querySelector('svg');
        const svgString = (new XMLSerializer()).serializeToString(svgNode);
        const svgBlob = new Blob([svgString], {
            type: 'image/svg+xml;charset=utf-8'
        });

        const url = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.width = svgNode.width.baseVal.value;
        image.height = svgNode.height.baseVal.value;
        image.src = url;
        image.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            URL.revokeObjectURL(url);

            const imgURI = canvas
                .toDataURL('image/png')
                .replace('image/png', 'image/octet-stream');

            const a = document.createElement('a');
            a.download = 'tattoo.png';
            a.target = '_blank';
            a.href = imgURI;
            a.click();
        }
    });

    document.getElementById('tattooModal').addEventListener('hide.bs.modal', () => {
        soundFileInput.value = null;
        createTattooButton.style.display = 'block';
        saveTattooButton.style.display = 'none';
    });

    createTattooButton.addEventListener('click', () => {
        soundFileInput.click();
    });

});

// divide 1st channel of the buffer in {samples} amount of bins and take avg. from each
function filterData(audioBuffer) {
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
            sum = sum + rawData[blockStart + j];
        }
        filteredData.push(sum / blockSize);
    }
    return filteredData;
}

function normalizeData(filteredData) {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

function draw(normalizedData) {
    const barWidth = 4;
    const gap = 4;

    const audioSvg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
    );

    // width - number of samples * (width of the bar + gap)
    audioSvg.setAttribute("viewBox", "0 0 560 200");

    for (let i = 0; i < normalizedData.length; i++) {
        const data = normalizedData[i];
        const height = Math.abs(data * 100);

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

        rect.setAttribute("transform", `translate(${i * (barWidth + gap)},${100 - height / 2})`);
        rect.setAttribute("width", barWidth.toString());
        rect.setAttribute("height", height.toString());
        rect.setAttribute("fill", "#ffffff");

        audioSvg.appendChild(rect);
    }

    document.getElementById("tattoo-canvas").appendChild(audioSvg);
}
