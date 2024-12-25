let audioFile = null;
let logoFile = null;

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        logoFile = file;
    } else {
        alert('Please upload a valid image file for the logo.');
    }
}

function openTab(tab) {
    const sections = document.querySelectorAll('.form-section');
    const buttons = document.querySelectorAll('.tab-button');
    sections.forEach(section => section.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));

    document.getElementById(tab).classList.add('active');
    document.querySelector(`.tab-button[onclick="openTab('${tab}')"]`).classList.add('active');
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

        if (!name || !phone || !email) {
            alert('Please provide all fields for the vCard.');
            return;
        }

        data = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nEND:VCARD`;
    } else if (type === 'upi') {
        const upiId = document.getElementById('upi-id').value.trim();
        const merchantName = "Merchant";
        const transactionId = "12345";
        const transactionNote = "Payment for order";
        if (!upiId) {
            alert('Please enter a valid UPI ID.');
            return;
        }

        data = `upi://pay?pa=${upiId}&pn=${merchantName}&tid=${transactionId}&cu=INR&tn=${transactionNote}`;
    } else if (type === 'text') {
        data = document.getElementById('text-input').value.trim();
        if (!data) {
            alert('Please enter some text.');
            return;
        }
    }  else if (type === 'email') {
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

    const foregroundColor = document.getElementById('qr-foreground').value;
    const backgroundColor = document.getElementById('qr-background').value;

    const qrSize = 4000;

    QRCode.toCanvas(data, {
        width: qrSize,
        margin: 2,
        color: {
            dark: foregroundColor,
            light: backgroundColor,
        },
    }, function(error, canvas) {
        if (error) {
            alert("Error generating QR code: " + error);
        } else {
            if (logoFile) {
                const ctx = canvas.getContext('2d');
                const logo = new Image();
                logo.onload = function() {
                    const logoSize = qrSize / 5;
                    const logoX = (qrSize - logoSize) / 2;
                    const logoY = (qrSize - logoSize) / 2;

                    ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                    previewQRCode(canvas);
                };
                logo.src = URL.createObjectURL(logoFile);
            } else {
                previewQRCode(canvas);
            }
        }
    });
}

function previewQRCode(canvas) {
    const previewCanvas = document.createElement('canvas');
    const ctx = previewCanvas.getContext('2d');
    previewCanvas.width = 300;
    previewCanvas.height = 300;
    ctx.drawImage(canvas, 0, 0, 300, 300);

    document.getElementById('code-preview').appendChild(previewCanvas);
    createDownloadButton(canvas);
}

function createDownloadButton(canvas) {
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download QR Code';
    downloadButton.onclick = function() {
        const link = document.createElement('a');
        const largeCanvas = document.createElement('canvas');
        const ctx = largeCanvas.getContext('2d');
        largeCanvas.width = 4000;
        largeCanvas.height = 4000;
        ctx.drawImage(canvas, 0, 0, 4000, 4000);

        link.href = largeCanvas.toDataURL();
        link.download = 'qr_code.png';
        link.click();
    };
    document.getElementById('code-preview').appendChild(downloadButton);
}
