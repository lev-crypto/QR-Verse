function openTab(tab) {
    const sections = document.querySelectorAll('.form-section');
    const buttons = document.querySelectorAll('.tab-button');
    sections.forEach(section => section.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tab}')"]`).classList.add('active');
}

let audioFile = null;

function handleAudioUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        audioFile = file; 
    } else {
        alert('Please upload a valid audio file.');
    }
}

function generateQRCode(type) {
    const preview = document.getElementById('code-preview');
    preview.innerHTML = '';

    let data = '';
    if (type === 'url') {
        data = document.getElementById('url-input').value.trim();
        if (!data) {
            alert('Please enter a URL.');
            return;
        }
    } else if (type === 'vcard') {
        const name = document.getElementById('vcard-name').value.trim();
        const phone = document.getElementById('vcard-phone').value.trim();
        const email = document.getElementById('vcard-email').value.trim();
        const address = document.getElementById('vcard-address').value.trim();
        const company = document.getElementById('vcard-company').value.trim();
        const title = document.getElementById('vcard-title').value.trim();
        const website = document.getElementById('vcard-website').value.trim();

        if (!name || !phone || !email) {
            alert('Please enter at least Name, Phone, and Email.');
            return;
        }

        data = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}`;
        if (address) data += `\nADR:${address}`;
        if (company) data += `\nORG:${company}`;
        if (title) data += `\nTITLE:${title}`;
        if (website) data += `\nURL:${website}`;
        data += `\nEND:VCARD`;
    } else if (type === 'text') {
        data = document.getElementById('text-input').value.trim();
        if (!data) {
            alert('Please enter some text.');
            return;
        }
    } else if (type === 'email') {
        const email = document.getElementById('email-address').value.trim();
        const subject = document.getElementById('email-subject').value.trim();
        if (!email || !subject) {
            alert('Please enter both email address and subject.');
            return;
        }
        data = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    } else if (type === 'sms') {
        const number = document.getElementById('sms-number').value.trim();
        const message = document.getElementById('sms-message').value.trim();
        if (!number || !message) {
            alert('Please enter both phone number and message.');
            return;
        }
        data = `sms:${number}?body=${encodeURIComponent(message)}`;
    } else if (type === 'wifi') {
        const ssid = document.getElementById('wifi-ssid').value.trim();
        const password = document.getElementById('wifi-password').value.trim();
        const security = document.getElementById('wifi-security').value;
        if (!ssid || !password) {
            alert('Please enter both Wi-Fi SSID and password.');
            return;
        }
        data = `WIFI:T:${security};S:${ssid};P:${password};;`;
    } else if (type === 'audio') {
        const audioUrl = document.getElementById('audio-url').value.trim();
        if (!audioUrl && !audioFile) {
            alert('Please enter a valid audio URL or upload an audio file.');
            return;
        }
        data = audioUrl || URL.createObjectURL(audioFile);
    }

    const qrSize = document.getElementById('qr-size').value;
    const qrWidth = qrSize === '4k' ? 4000 : 300;
    QRCode.toCanvas(data, { width: qrWidth, margin: 2 }, function(error, canvas) {
        if (error) {
            alert("Error generating QR code: " + error);
        } else {
            const scaledCanvas = document.createElement('canvas');
            const ctx = scaledCanvas.getContext('2d');
            scaledCanvas.width = 300;
            scaledCanvas.height = 300;
            ctx.drawImage(canvas, 0, 0, 300, 300);
            preview.appendChild(scaledCanvas);

            createDownloadButton(canvas);
        }
    });
}

function createDownloadButton(canvas) {
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download QR Code';
    downloadButton.onclick = function() {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'qr_code.png';
        link.click();
    };
    document.getElementById('code-preview').appendChild(downloadButton);
}