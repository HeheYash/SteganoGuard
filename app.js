// Secure Steganography Web Application
// LSB Steganography with AES Encryption Implementation

class SteganoApp {
    constructor() {
        this.currentImage = null;
        this.currentStegoImage = null;
        this.isProcessing = false;
        
        // Ensure loading overlay is hidden on startup
        this.hideLoadingOverlay();
        
        this.initializeApp();
        this.setupEventListeners();
    }

    initializeApp() {
        // Initialize dark mode
        this.initializeDarkMode();
        
        // Initialize tab system
        this.initializeTabs();
        
        // Initialize file upload systems
        this.initializeFileUploads();
        
        // Initialize form interactions
        this.initializeFormInteractions();
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    showLoadingOverlay(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.querySelector('p').textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    initializeDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Don't use localStorage in this environment
        const currentTheme = prefersDark ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-color-scheme', currentTheme);
        this.updateDarkModeIcon(currentTheme === 'dark');
        
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            this.updateDarkModeIcon(newTheme === 'dark');
        });
    }

    updateDarkModeIcon(isDark) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (isDark) {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        }
    }

    initializeTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = btn.getAttribute('data-tab');
                
                console.log('Tab clicked:', targetTab); // Debug log
                
                // Update active button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active panel - Fix the tab switching logic
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                });
                
                // Show the correct panel
                const targetPanel = document.getElementById(targetTab + 'Tab');
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    console.log('Switched to panel:', targetTab + 'Tab'); // Debug log
                } else {
                    console.error('Panel not found:', targetTab + 'Tab'); // Debug log
                }
            });
        });
    }

    initializeFileUploads() {
        // Hide message tab - cover image upload
        this.setupDropzone('imageDropzone', 'coverInput', (file) => {
            this.handleCoverImageUpload(file);
        });

        // Extract message tab - stego image upload  
        this.setupDropzone('stegoDropzone', 'stegoInput', (file) => {
            this.handleStegoImageUpload(file);
        });

        // Message file upload
        const messageFileInput = document.getElementById('messageFile');
        if (messageFileInput) {
            messageFileInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.handleMessageFileUpload(e.target.files[0]);
                }
            });
        }
    }

    setupDropzone(dropzoneId, inputId, onFileDrop) {
        const dropzone = document.getElementById(dropzoneId);
        const input = document.getElementById(inputId);
        
        if (!dropzone || !input) {
            console.log('Dropzone or input not found:', dropzoneId, inputId);
            return;
        }
        
        dropzone.addEventListener('click', () => input.click());
        
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });
        
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-over');
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                onFileDrop(files[0]);
            }
        });
        
        input.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                onFileDrop(e.target.files[0]);
            }
        });
    }

    initializeFormInteractions() {
        // inside initializeFormInteractions() - add this block
const integrityToggle = document.getElementById('integrityToggle');
const integrityWrap = document.getElementById('integrityPassWrap');
const integrityInput = document.getElementById('integrityPassphrase');

if (integrityToggle && integrityWrap) {
  integrityToggle.addEventListener('change', () => {
    integrityWrap.style.display = integrityToggle.checked ? 'block' : 'none';
    // keep embed button state accurate
    this.updateEmbedButton();
  });
}

// also ensure embed/extract buttons update when integrity pass changes
if (integrityInput) {
  integrityInput.addEventListener('input', () => this.updateEmbedButton());
}

        // Message text counter
        const messageText = document.getElementById('messageText');
        const messageLength = document.getElementById('messageLength');
        
        if (messageText && messageLength) {
            messageText.addEventListener('input', () => {
                messageLength.textContent = messageText.value.length;
                this.updateCapacityMeter();
                this.updateEmbedButton();
            });
        }

        // Encryption toggle - Fix the encryption toggle functionality
        const encryptionToggle = document.getElementById('encryptionToggle');
        const encryptionOptions = document.getElementById('encryptionOptions');
        
        if (encryptionToggle && encryptionOptions) {
            console.log('Setting up encryption toggle'); // Debug log
            
            encryptionToggle.addEventListener('change', (e) => {
                console.log('Encryption toggle changed:', e.target.checked); // Debug log
                
                if (e.target.checked) {
                    encryptionOptions.classList.remove('hidden');
                    console.log('Showing encryption options'); // Debug log
                } else {
                    encryptionOptions.classList.add('hidden');
                    console.log('Hiding encryption options'); // Debug log
                }
            });
        } else {
            console.error('Encryption toggle or options not found');
        }

        // Passphrase strength checker
        const passphrase = document.getElementById('passphrase');
        if (passphrase) {
            passphrase.addEventListener('input', () => {
                this.updatePasswordStrength(passphrase.value);
            });
        }

        // Embed button
        const embedBtn = document.getElementById('embedBtn');
        if (embedBtn) {
            embedBtn.addEventListener('click', () => {
                this.embedMessage();
            });
        }

        // Extract button
        const extractBtn = document.getElementById('extractBtn');
        if (extractBtn) {
            extractBtn.addEventListener('click', () => {
                this.extractMessage();
            });
        }
    }

    async handleCoverImageUpload(file) {
        if (!this.validateImageFile(file)) return;
        
        try {
            this.currentImage = await this.loadImage(file);
            this.displayImagePreview(file, 'imagePreview');
            this.updateCapacityMeter();
            this.updateEmbedButton();
            
            this.showToast('Cover image loaded successfully', 'success');
        } catch (error) {
            this.showToast('Error loading image: ' + error.message, 'error');
        }
    }

    async handleStegoImageUpload(file) {
        if (!this.validateImageFile(file)) return;
        
        try {
            this.currentStegoImage = await this.loadImage(file);
            this.displayImagePreview(file, 'stegoPreview');
            this.updateExtractButton();
            
            this.showToast('Stego image loaded successfully', 'success');
        } catch (error) {
            this.showToast('Error loading stego image: ' + error.message, 'error');
        }
    }

    async handleMessageFileUpload(file) {
        if (!file) return;
        
        if (file.type !== 'text/plain') {
            this.showToast('Please select a text file (.txt)', 'error');
            return;
        }
        
        if (file.size > 1024 * 1024) { // 1MB limit for text files
            this.showToast('Text file too large (max 1MB)', 'error');
            return;
        }
        
        try {
            const text = await file.text();
            const messageTextElement = document.getElementById('messageText');
            const messageLengthElement = document.getElementById('messageLength');
            
            if (messageTextElement && messageLengthElement) {
                messageTextElement.value = text;
                messageLengthElement.textContent = text.length;
                this.updateCapacityMeter();
                this.updateEmbedButton();
            }
            
            this.showToast('Text file loaded successfully', 'success');
        } catch (error) {
            this.showToast('Error reading text file: ' + error.message, 'error');
        }
    }

    validateImageFile(file) {
        // Check file type
        const allowedTypes = ['image/png', 'image/bmp'];
        if (!allowedTypes.includes(file.type)) {
            this.showToast('Please select a PNG or BMP image', 'error');
            return false;
        }
        
        // Check file size (16MB limit)
        if (file.size > 16 * 1024 * 1024) {
            this.showToast('Image file too large (max 16MB)', 'error');
            return false;
        }
        
        return true;
    }

    async loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                // Check resolution (8MP limit)
                const megapixels = (img.width * img.height) / 1000000;
                if (megapixels > 8) {
                    reject(new Error('Image resolution too high (max 8MP)'));
                    return;
                }
                resolve(img);
            };
            img.onerror = () => reject(new Error('Invalid image file'));
            img.src = URL.createObjectURL(file);
        });
    }

    displayImagePreview(file, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Image preview';
        
        const info = document.createElement('div');
        info.className = 'image-info';
        info.innerHTML = `
            <div>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</div>
            <div>Type: ${file.type}</div>
        `;
        
        container.appendChild(img);
        container.appendChild(info);
        container.classList.remove('hidden');
    }

    updateCapacityMeter() {
        const messageText = document.getElementById('messageText');
        const capacityMeter = document.getElementById('capacityMeter');
        const capacityText = document.getElementById('capacityText');
        const capacityFill = document.getElementById('capacityFill');
        
        if (!messageText || !capacityMeter || !capacityText || !capacityFill) return;
        
        const messageValue = messageText.value;
        
        if (!this.currentImage || !messageValue) {
            capacityMeter.classList.add('hidden');
            return;
        }
        
        // Calculate capacity (3 bits per pixel for RGB)
        const imageCapacity = this.currentImage.width * this.currentImage.height * 3 / 8; // bytes
        const messageSize = new TextEncoder().encode(messageValue).length;
        const headerSize = 32; // Estimated header size
        const totalRequired = messageSize + headerSize;
        
        const usagePercent = Math.min((totalRequired / imageCapacity) * 100, 100);
        
        capacityText.textContent = `${totalRequired} / ${Math.floor(imageCapacity)} bytes`;
        capacityFill.style.width = `${usagePercent}%`;
        
        // Color coding
        if (usagePercent > 90) {
            capacityFill.style.background = 'var(--color-error)';
        } else if (usagePercent > 70) {
            capacityFill.style.background = 'var(--color-warning)';
        } else {
            capacityFill.style.background = 'var(--color-success)';
        }
        
        capacityMeter.classList.remove('hidden');
        
        if (totalRequired > imageCapacity) {
            this.showToast('Message too large for selected image', 'warning');
        }
    }

    updatePasswordStrength(password) {
        const strengthFill = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;
        
        if (!password) {
            strengthFill.className = 'strength-fill';
            strengthText.textContent = 'Enter passphrase';
            strengthText.className = 'strength-text';
            return;
        }
        
        let score = 0;
        let feedback = [];
        
        if (password.length >= 8) score++;
        else feedback.push('at least 8 characters');
        
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        else feedback.push('uppercase and lowercase letters');
        
        if (/\d/.test(password)) score++;
        else feedback.push('numbers');
        
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        else feedback.push('special characters');
        
        strengthFill.className = 'strength-fill';
        strengthText.className = 'strength-text';
        
        if (score <= 1) {
            strengthFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Weak - Add ' + feedback.slice(0, 2).join(', ');
        } else if (score <= 2) {
            strengthFill.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Medium - Add ' + feedback.slice(0, 1).join(', ');
        } else {
            strengthFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Strong passphrase';
        }
    }
    updateExtractButton() {
  const extractBtn = document.getElementById('extractBtn');
  if (!extractBtn) return;

  // Only enable if a stego image has been loaded
  extractBtn.disabled = !this.currentStegoImage;
}


    updateEmbedButton() {
  const embedBtn = document.getElementById('embedBtn');
  const messageText = document.getElementById('messageText');
  const integrityToggle = document.getElementById('integrityToggle');
  const integrityPass = document.getElementById('integrityPassphrase');

  if (!embedBtn || !messageText) return;
  if (integrityToggle && integrityToggle.checked) {
    embedBtn.disabled = !this.currentImage || !messageText.value.trim() || !integrityPass.value.trim();
  } else {
    embedBtn.disabled = !this.currentImage || !messageText.value.trim();
  }
}


    async embedMessage() {
  if (this.isProcessing) return;

  const messageText = document.getElementById('messageText').value.trim();
  const encryptionEnabled = document.getElementById('encryptionToggle').checked;
  const passphrase = document.getElementById('passphrase').value;
  const integrityEnabled = document.getElementById('integrityToggle').checked;
  const integrityPassphrase = document.getElementById('integrityPassphrase').value.trim();

  if (!messageText) { this.showToast('Please enter a message to hide', 'error'); return; }
  if (encryptionEnabled && !passphrase) { this.showToast('Please enter a passphrase for encryption', 'error'); return; }
  if (integrityEnabled && !integrityPassphrase) { this.showToast('Integrity enabled: enter an integrity passphrase', 'error'); return; }

  try {
    this.isProcessing = true;
    this.showProgress('embedProgress', 'Embedding message.');
    await new Promise(r => setTimeout(r, 100));

    let messageData = new TextEncoder().encode(messageText);
    let isEncrypted = false;
    let salt = null;
    let iv = null;

    if (encryptionEnabled) {
      const encryptionResult = await this.encryptMessage(messageData, passphrase);
      messageData = encryptionResult.encryptedData;
      salt = encryptionResult.salt;
      iv = encryptionResult.iv;
      isEncrypted = true;
    }

    // Build header length estimate
    const headerBase = 5 + 1 + 4; // magic + flags + length
    const saltLen = (isEncrypted || integrityEnabled) ? 16 : 0;
    const ivLen = isEncrypted ? 12 : 0;
    const shaLen = 32;
    const hmacLen = integrityEnabled ? 32 : 0;
    const headerLen = headerBase + saltLen + ivLen + shaLen + hmacLen;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.currentImage.width;
    canvas.height = this.currentImage.height;
    ctx.drawImage(this.currentImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const availableCapacity = (imageData.data.length / 4) * 3 / 8; // bytes
    const requiredCapacity = messageData.length + headerLen;

    if (requiredCapacity > availableCapacity) throw new Error('Message too large for image capacity');

    // embed (pass integrity passphrase if enabled)
    await this.embedLSB(imageData, messageData, isEncrypted, salt, iv, integrityEnabled ? integrityPassphrase : null);

    ctx.putImageData(imageData, 0, 0);

    // Download
    canvas.toBlob((blob) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'stego.png';   // always output PNG
  a.click();
  URL.revokeObjectURL(url);
  this.showToast('Stego image generated successfully!', 'success');
}, 'image/png');  // force PNG output

  } catch (error) {
    this.showToast('Error embedding message: ' + error.message, 'error');
  } finally {
    this.isProcessing = false;
    this.hideProgress('embedProgress');
  }
}

    async extractMessage() {
  if (this.isProcessing) return;

  const decryptPassphrase = document.getElementById('extractPassphrase').value;
  const integrityPassphrase = document.getElementById('extractIntegrityPassphrase').value.trim();

  try {
    this.isProcessing = true;
    this.showProgress('extractProgress', 'Extracting message.');
    await new Promise(r => setTimeout(r, 100));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.currentStegoImage.width;
    canvas.height = this.currentStegoImage.height;
    ctx.drawImage(this.currentStegoImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // extraction will verify SHA and HMAC (if present)
    const extractionResult = await this.extractLSB(imageData, integrityPassphrase); // may throw on mismatch

    let payload = extractionResult.messageData;

    if (extractionResult.isEncrypted) {
      if (!decryptPassphrase) {
        throw new Error('This stego payload is encrypted — please enter the decryption passphrase.');
      }
      // decryptMessage should accept (ciphertext, passphrase, salt, iv)
      const decrypted = await this.decryptMessage(payload, decryptPassphrase, extractionResult.salt, extractionResult.iv);
      payload = decrypted; // Uint8Array plaintext
    }

    // show extracted text (assume UTF-8)
    const text = new TextDecoder().decode(payload);
    // display in UI...
    const extractedEl = document.getElementById('extractedMessage');
    if (extractedEl) extractedEl.innerHTML = `<pre class="extracted-text">${this.escapeHtml(text)}</pre>`;

    this.showToast('Message extracted successfully', 'success');
  } catch (err) {
    this.showToast('Extraction error: ' + err.message, 'error');
  } finally {
    this.isProcessing = false;
    this.hideProgress('extractProgress');
  }
}

    // --- Integrity helpers (inside SteganoApp class) ---

async computeSHA256(uint8arr) {
  const hash = await crypto.subtle.digest('SHA-256', uint8arr);
  return new Uint8Array(hash);
}

async deriveHMACKey(passphrase, salt) {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  );
  const derived = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
    baseKey,
    { name: 'HMAC', hash: 'SHA-256', length: 256 },
    false,
    ['sign', 'verify']
  );
  return derived;
}

async computeHMAC(hmacCryptoKey, uint8arr) {
  const sig = await crypto.subtle.sign('HMAC', hmacCryptoKey, uint8arr);
  return new Uint8Array(sig);
}


    async encryptMessage(messageData, passphrase) {
        // Generate salt and IV
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Derive key using PBKDF2
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(passphrase),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt']
        );
        
        // Encrypt message
        const encryptedBuffer = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            messageData
        );
        
        return {
            encryptedData: new Uint8Array(encryptedBuffer),
            salt: salt,
            iv: iv
        };
    }

    async decryptMessage(encryptedData, passphrase, salt, iv) {
        // Derive key using PBKDF2
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(passphrase),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        
        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['decrypt']
        );
        
        // Decrypt message
        const decryptedBuffer = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encryptedData
        );
        
        return new Uint8Array(decryptedBuffer);
    }

   // Replace existing embedLSB(...) with this:
async embedLSB(imageData, payloadBytes, isEncrypted, salt, iv, integrityPassphrase = null) {
  const data = imageData.data;

  // Format: magic(5) | flags(1) | length(4) | [salt(16) if (isEncrypted||hmac)] | [iv(12) if isEncrypted] | sha256(32) | [hmac(32) if present]
  const magic = new TextEncoder().encode('STEG2');
  let flagsByte = isEncrypted ? 1 : 0;
  const hmacPresent = typeof integrityPassphrase === 'string' && integrityPassphrase.length > 0;
  if (hmacPresent) flagsByte |= 2;

  // Ensure salt exists if either encrypted or hmac required
  let saltBytes = null;
  if (isEncrypted) {
    if (!salt) throw new Error('Missing encryption salt');
    saltBytes = salt; // expected Uint8Array(16) from encryptMessage
  } else if (hmacPresent) {
    // generate salt for HMAC derivation and include it in header
    saltBytes = crypto.getRandomValues(new Uint8Array(16));
  }

  // compute SHA-256 of payload (payload = encrypted bytes if encrypted)
  const sha256 = await this.computeSHA256(payloadBytes);

  // compute HMAC if requested (derive key from passphrase + saltBytes)
  let hmacBytes = null;
  if (hmacPresent) {
    if (!saltBytes) throw new Error('HMAC requested but no salt available');
    const hmacKey = await this.deriveHMACKey(integrityPassphrase, saltBytes);
    hmacBytes = await this.computeHMAC(hmacKey, payloadBytes); // Uint8Array(32)
  }

  // length bytes (little-endian)
  const lengthBytes = new Uint8Array(4);
  new DataView(lengthBytes.buffer).setUint32(0, payloadBytes.length, true);

  // Build header parts
  const headerParts = [magic, new Uint8Array([flagsByte]), lengthBytes];
  if (saltBytes) headerParts.push(saltBytes);
  if (isEncrypted) headerParts.push(iv); // iv is Uint8Array(12)
  headerParts.push(sha256);
  if (hmacBytes) headerParts.push(hmacBytes);

  // Combine header + payload
  let headerLen = 0;
  headerParts.forEach(p => headerLen += p.length);
  const fullData = new Uint8Array(headerLen + payloadBytes.length);
  let off = 0;
  for (const part of headerParts) {
    fullData.set(part, off);
    off += part.length;
  }
  fullData.set(payloadBytes, off);

  // Convert to bits (MSB-first per byte)
  const bits = [];
  for (let i = 0; i < fullData.length; i++) {
    const b = fullData[i];
    for (let k = 7; k >= 0; k--) bits.push((b >> k) & 1);
  }

  // Embed bits in R,G,B LSBs skipping alpha (3 bits per pixel)
  let bitIndex = 0;
  for (let i = 0; i < data.length && bitIndex < bits.length; i += 4) {
    if (bitIndex < bits.length) data[i]     = (data[i]     & 0xFE) | bits[bitIndex++]; // R
    if (bitIndex < bits.length) data[i + 1] = (data[i + 1] & 0xFE) | bits[bitIndex++]; // G
    if (bitIndex < bits.length) data[i + 2] = (data[i + 2] & 0xFE) | bits[bitIndex++]; // B
  }
}

    // Replace existing extractLSB(...) with this:
async extractLSB(imageData, integrityPassphrase = null) {
  const data = imageData.data;

  // helper: read N bits into bytes (msb-first)
  const readBytesFromBits = (bits, totalBytes) => {
    const out = new Uint8Array(totalBytes);
    for (let i = 0; i < totalBytes; i++) {
      let b = 0;
      for (let j = 0; j < 8; j++) {
        b = (b << 1) | (bits[i * 8 + j] || 0);
      }
      out[i] = b;
    }
    return out;
  };

  // read initial 10 bytes (magic 5 + flags 1 + length 4) -> 10 * 8 = 80 bits
  const initialBitsNeeded = 10 * 8;
  const collectedBits = [];
  for (let i = 0; i < data.length && collectedBits.length < initialBitsNeeded; i += 4) {
    collectedBits.push(data[i] & 1);
    collectedBits.push(data[i + 1] & 1);
    collectedBits.push(data[i + 2] & 1);
  }
  const initialBytes = readBytesFromBits(collectedBits, 10);
  const magic = new TextDecoder().decode(initialBytes.slice(0,5));
  if (magic === 'STEG1') {
    // legacy extraction — keep previous STEG1 behaviour.
    // Call the original extraction logic (if you kept a backup) or fallback to the older parser.
    // For quick compatibility we reconstruct the old 38-byte header then proceed (matching your previous code).
    const headerBits = [];
    for (let i = 0; i < data.length && headerBits.length < 304; i += 4) {
      headerBits.push(data[i] & 1);
      headerBits.push(data[i+1] & 1);
      headerBits.push(data[i+2] & 1);
    }
    const headerBytes = readBytesFromBits(headerBits, 38);
    const isEncrypted = headerBytes[5] === 1;
    const messageLength = new DataView(headerBytes.buffer, 6, 4).getUint32(0, true);
    let salt = null, iv = null;
    if (isEncrypted) {
      salt = headerBytes.slice(10,26);
      iv = headerBytes.slice(26,38);
    }
    const totalBits = (38 + messageLength) * 8;
    const allBits = [];
    for (let i = 0; i < data.length && allBits.length < totalBits; i += 4) {
      allBits.push(data[i] & 1);
      allBits.push(data[i+1] & 1);
      allBits.push(data[i+2] & 1);
    }
    const payloadBits = allBits.slice(304);
    const messageBytes = readBytesFromBits(payloadBits, messageLength);
    return { messageData: messageBytes, isEncrypted, salt, iv };
  }

  if (magic !== 'STEG2') {
    throw new Error('No STEG data found (unknown magic)');
  }

  // parse flags and length
  const flags = initialBytes[5];
  const isEncrypted = (flags & 1) !== 0;
  const hmacPresent = (flags & 2) !== 0;
  const payloadLength = new DataView(initialBytes.buffer, 6, 4).getUint32(0, true);

  // compute header total length
  let headerLen = 5 + 1 + 4; // 10
  if (isEncrypted || hmacPresent) headerLen += 16; // salt
  if (isEncrypted) headerLen += 12; // iv
  headerLen += 32; // sha256
  if (hmacPresent) headerLen += 32; // hmac

  // read full header bits
  const headerBitsNeeded = headerLen * 8;
  const headerBits = [];
  for (let i = 0; i < data.length && headerBits.length < headerBitsNeeded; i += 4) {
    headerBits.push(data[i] & 1);
    headerBits.push(data[i+1] & 1);
    headerBits.push(data[i+2] & 1);
  }
  const headerBytes = readBytesFromBits(headerBits, headerLen);

  // parse fields
  let off = 0;
  const magicBytes = headerBytes.slice(off, off+5); off += 5;
  const parsedFlags = headerBytes[off]; off += 1;
  const lengthBytes = headerBytes.slice(off, off+4); off += 4;
  const parsedPayloadLen = new DataView(lengthBytes.buffer).getUint32(0, true);

  let salt = null, iv = null;
  if (isEncrypted || hmacPresent) {
    salt = headerBytes.slice(off, off+16); off += 16;
  }
  if (isEncrypted) {
    iv = headerBytes.slice(off, off+12); off += 12;
  }
  const sha256Bytes = headerBytes.slice(off, off+32); off += 32;
  let hmacBytes = null;
  if (hmacPresent) {
    hmacBytes = headerBytes.slice(off, off+32); off += 32;
  }

  // now extract payload bits
  const totalBits = (headerLen + parsedPayloadLen) * 8;
  const allBits = [];
  for (let i = 0; i < data.length && allBits.length < totalBits; i += 4) {
    allBits.push(data[i] & 1);
    allBits.push(data[i+1] & 1);
    allBits.push(data[i+2] & 1);
  }
  const payloadBits = allBits.slice(headerLen * 8);
  const payloadBytes = readBytesFromBits(payloadBits, parsedPayloadLen);

  // verify SHA-256
  const computedHash = await this.computeSHA256(payloadBytes);
  let ok = true;
  for (let i = 0; i < 32; i++) if (computedHash[i] !== sha256Bytes[i]) { ok = false; break; }
  if (!ok) throw new Error('Integrity check failed: SHA-256 mismatch (payload corrupted or altered)');

  // if HMAC present, verify (requires integrityPassphrase)
  if (hmacPresent) {
    if (!integrityPassphrase) throw new Error('Integrity HMAC present: please enter the integrity passphrase to verify authenticity.');
    const hmacKey = await this.deriveHMACKey(integrityPassphrase, salt);
    const computedHmac = await this.computeHMAC(hmacKey, payloadBytes);
    let hOk = true;
    for (let i = 0; i < 32; i++) if (computedHmac[i] !== hmacBytes[i]) { hOk = false; break; }
    if (!hOk) throw new Error('HMAC verification failed: authenticity could not be verified.');
  }

  // success
  return { messageData: payloadBytes, isEncrypted, salt, iv };
}

    displayExtractedMessage(messageText) {
        const container = document.getElementById('extractedMessage');
        if (!container) return;
        
        const escapedText = this.escapeHtml(messageText);
        
        container.innerHTML = `
            <div class="extracted-text">${escapedText}</div>
            <div class="extract-actions">
                <button class="btn btn--outline btn--sm copy-btn" data-text="${escapedText}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2 2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy Text
                </button>
                <button class="btn btn--outline btn--sm download-btn" data-text="${escapedText}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download as .txt
                </button>
            </div>
        `;
        
        // Add event listeners to the new buttons
        container.querySelector('.copy-btn').addEventListener('click', (e) => {
            this.copyToClipboard(messageText);
        });
        
        container.querySelector('.download-btn').addEventListener('click', (e) => {
            this.downloadText(messageText);
        });
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Text copied to clipboard', 'success');
        }).catch(() => {
            this.showToast('Failed to copy text', 'error');
        });
    }

    downloadText(text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extracted_message.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showProgress(containerId, message) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const progressText = container.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = message;
        }
        container.classList.remove('hidden');
    }

    hideProgress(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.classList.add('hidden');
        }
    }

    showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = this.getToastIcon(type);
        
        toast.innerHTML = `
            ${icon}
            <span>${this.escapeHtml(message)}</span>
            <button class="toast-close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;
        
        // Add close button event listener
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
        
        container.appendChild(toast);
        
        // Auto remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }

    getToastIcon(type) {
        const icons = {
            success: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
            error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
        };
        return icons[type] || icons.info;
    }

    setupEventListeners() {
        // This method is called from constructor, additional listeners can be added here
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.steganoApp = new SteganoApp();
});