const retryBtn = document.getElementById('retry-btn');
const card = document.getElementById('auth-card');

if (retryBtn && card) {
  retryBtn.addEventListener('click', () => {
    card.classList.remove('pulse');
    void card.offsetWidth; 
    card.classList.add('pulse');

    setTimeout(() => {
      location.reload();
    }, 350);
  });
}

const OFFICIAL_URLS = new Set([
  'https://backuppass.github.io/Authentic-Product/',
  'https://backuppass.github.io/Authentic-Product'
]);

const scanArea = document.getElementById('scan-area');
const verifiedContent = document.getElementById('verified-content');
const scanPill = document.getElementById('scan-pill');
const scanHint = document.getElementById('scan-hint');
const scanResult = document.getElementById('scan-result');

const startBtn = document.getElementById('start-scan');
const stopBtn = document.getElementById('stop-scan');

function setPill(type, text) {
  scanPill.classList.remove('ok', 'danger', 'warning', 'neutral');
  scanPill.classList.add(type);
  scanPill.textContent = text;
}

function showVerified() {
  scanArea.classList.add('hidden');
  verifiedContent.classList.remove('hidden');
}

function showNotAuthentic(scannedText) {
  setPill('danger', 'Authenticity: Not Verified');
  scanHint.textContent = 'Scanned QR is not the official PlingifyPlug destination';
  scanResult.textContent = `Scanned: ${scannedText}`;
}

function attachReload(btnId) {
  const btn = document.getElementById(btnId);
  const card = document.getElementById('auth-card');
  if (!btn || !card) return;

  btn.addEventListener('click', () => {
    card.classList.remove('pulse');
    void card.offsetWidth;
    card.classList.add('pulse');
    setTimeout(() => location.reload(), 350);
  });
}
attachReload('retry-btn');
attachReload('retry-btn-verified');

let qr = null;
let scanning = false;

async function startScan() {
  if (scanning) return;
  scanning = true;

  setPill('warning', 'Scanner: Starting…');
  scanHint.textContent = 'Allow camera access…';
  scanResult.textContent = '';

  startBtn.disabled = true;
  stopBtn.disabled = false;

  try {
    qr = new Html5Qrcode('qr-reader');

    const config = { fps: 10, qrbox: { width: 240, height: 240 } };

    await qr.start(
      { facingMode: 'environment' },
      config,
      async (decodedText) => {
        await stopScan();

        const cleaned = String(decodedText || '').trim();

        if (OFFICIAL_URLS.has(cleaned)) {

          showVerified();
        } else {
          showNotAuthentic(cleaned);
        }
      },
      () => {
      }
    );

    setPill('neutral', 'Scanner: Active');
    scanHint.textContent = 'Point your camera at the QR shown in the product';
  } catch (e) {
    setPill('danger', 'Scanner: Failed');
    scanHint.textContent = 'Camera blocked or not available. Try Safari/Chrome on your phone.';
    scanResult.textContent = `Error: ${e && e.message ? e.message : e}`;
    scanning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

async function stopScan() {
  if (!qr) {
    scanning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    return;
  }

  try {
    await qr.stop();
  } catch {}
  try {
    await qr.clear();
  } catch {}

  qr = null;
  scanning = false;

  startBtn.disabled = false;
  stopBtn.disabled = true;

  if (!verifiedContent.classList.contains('hidden')) return;
  setPill('warning', 'Scanner: Waiting');
  scanHint.textContent = 'Press Start scanning to verify';
}

startBtn?.addEventListener('click', startScan);
stopBtn?.addEventListener('click', stopScan);

setPill('warning', 'Scanner: Waiting');
scanHint.textContent = 'Press Start scanning to verify authenticity';
verifiedContent.classList.add('hidden');
