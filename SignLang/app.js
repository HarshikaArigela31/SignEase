// Main app logic: MediaPipe Hands integration, gesture recognition, and TTS

const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const fpsEl = document.getElementById('fps');
const confidenceEl = document.getElementById('confidence');
const statusEl = document.getElementById('status');
const thresholdInput = document.getElementById('confidence-threshold');
const thresholdValue = document.getElementById('threshold-value');
const showLandmarksCheckbox = document.getElementById('show-landmarks');
const stabilizationCheckbox = document.getElementById('stabilization-enabled');
const languageSelect = document.getElementById('language-select');
const gestureDisplay = document.querySelector('.gesture-text');
const gestureConfidence = document.querySelector('.gesture-confidence');
const textOutput = document.getElementById('text-output');
const speakBtn = document.getElementById('speak-btn');
const stopSpeakBtn = document.getElementById('stop-speak-btn');
const audioStatus = document.getElementById('audio-status');
const gestureOverlay = document.getElementById('gesture-overlay');
const gestureOverlayConf = document.getElementById('gesture-overlay-conf');

let camera = null;
let hands = null;
let lastFrameTime = performance.now();
let lastFpsUpdate = performance.now();
let frames = 0;

// Debug panel to show extensions/orientation and scores
let debugPanel = document.getElementById('debugPanel');
if (!debugPanel) {
    debugPanel = document.createElement('pre');
    debugPanel.id = 'debugPanel';
    debugPanel.style.position = 'fixed';
    debugPanel.style.right = '8px';
    debugPanel.style.bottom = '8px';
    debugPanel.style.zIndex = 9999;
    debugPanel.style.background = 'rgba(0,0,0,0.6)';
    debugPanel.style.color = '#fff';
    debugPanel.style.padding = '8px';
    debugPanel.style.borderRadius = '6px';
    debugPanel.style.maxWidth = '300px';
    debugPanel.style.maxHeight = '200px';
    debugPanel.style.overflow = 'auto';
    debugPanel.style.fontSize = '12px';
    document.body.appendChild(debugPanel);
}

// KNN classifier for user-collected samples
const knn = new KNNClassifierSimple();
const gestureSelect = document.getElementById('gesture-select');
const recordSampleBtn = document.getElementById('record-sample-btn');
const saveSamplesBtn = document.getElementById('save-samples-btn');
const loadSamplesBtn = document.getElementById('load-samples-btn');
const clearSamplesBtn = document.getElementById('clear-samples-btn');
const sampleCountEl = document.getElementById('sample-count');

// Core engines
const stabilizer = new HandStabilizer(0.6, parseFloat(thresholdInput.value));
const recognizer = new GestureRecognizer();
const translator = new GestureToSpeechTranslator();
const temporalAnalyzer = new GestureTemporalAnalyzer();

// Speech
let currentUtterance = null;

function logStatus(text, state = 'ready') {
    statusEl.textContent = text;
    statusEl.className = 'stat-value ' + (state === 'loading' ? 'status-loading' : state === 'error' ? 'status-error' : 'status-ready');
}

function setCanvasSize() {
    const rect = videoElement.getBoundingClientRect();
    canvasElement.width = rect.width || 640;
    canvasElement.height = rect.height || 480;
}

// Utility to pick voice for a BCP47 language tag
function pickVoiceForLang(lang) {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;
    // Try exact match first
    let v = voices.find(v => v.lang === lang);
    if (v) return v;
    // Try prefix match (e.g., 'hi' for 'hi-IN')
    const prefix = lang.split('-')[0];
    v = voices.find(v => v.lang && v.lang.startsWith(prefix));
    return v || voices[0];
}

function speakText(text, lang) {
    if (!text) return;
    stopSpeaking();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    const voice = pickVoiceForLang(lang);
    if (voice) utter.voice = voice;
    utter.rate = 1;
    utter.pitch = 1;
    utter.onstart = () => {
        audioStatus.textContent = 'Speaking';
        speakBtn.disabled = true;
        stopSpeakBtn.disabled = false;
    };
    utter.onend = () => {
        audioStatus.textContent = 'Ready';
        speakBtn.disabled = false;
        stopSpeakBtn.disabled = true;
    };
    currentUtterance = utter;
    window.speechSynthesis.speak(utter);
}

function stopSpeaking() {
    if (currentUtterance) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
        audioStatus.textContent = 'Ready';
        speakBtn.disabled = false;
        stopSpeakBtn.disabled = true;
    }
}

// Update threshold UI
thresholdInput.addEventListener('input', () => {
    thresholdValue.textContent = Math.round(parseFloat(thresholdInput.value) * 100) + '%';
    stabilizer.confidenceThreshold = parseFloat(thresholdInput.value);
});

// Buttons
startBtn.addEventListener('click', async () => {
    startBtn.disabled = true;
    logStatus('Starting camera...', 'loading');
    await startCamera();
    stopBtn.disabled = false;
    logStatus('Camera started', 'ready');
});

stopBtn.addEventListener('click', () => {
    stopCamera();
    startBtn.disabled = false;
    stopBtn.disabled = true;
    logStatus('Camera stopped', 'ready');
});

const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        textOutput.innerHTML = '<p>No gesture recognized yet</p>';
        gestureDisplay.textContent = 'Waiting for gesture...';
        gestureConfidence.textContent = 'Confidence: 0%';
        recognizer.reset();
        stabilizer.reset();
        translator.clearHistory();
    });
}

speakBtn.addEventListener('click', () => {
    const lang = languageSelect.value;
    const text = textOutput.textContent.trim();
    if (text) speakText(text, lang);
});

// Toggle drawing
let videoStream = null;
let currentCamera = 'user';
let isCameraActive = false;
let isMirrored = false;

    function setupCamera() {
        const constraints = {
            video: {
                facingMode: currentCamera
            }
        };
        // Initialize MediaPipe Hands if needed
        if (!hands) {
            hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });
            hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.6,
                minTrackingConfidence: 0.5
            });
            hands.onResults(onResults);
        }

        try {
            // Use MediaPipe Camera helper which handles getUserMedia and frame loop
            camera = new Camera(videoElement, {
                onFrame: async () => {
                    await hands.send({ image: videoElement });
                },
                facingMode: currentCamera,
                width: 1280,
                height: 720
            });
            camera.start();
            // mirror drawing handled in drawCamera; set stream reference
            videoStream = videoElement.srcObject;
            isCameraActive = true;
            logStatus('Camera started', 'ready');
            // Start preview drawing
            drawCamera(videoElement);
        } catch (err) {
            logStatus('Camera error: ' + (err.message || err), 'error');
        }
    }

    function drawCamera(video) {
        function render() {
            if (!isCameraActive || !videoStream) return;
            if (canvasElement.width !== video.videoWidth || canvasElement.height !== video.videoHeight) {
                canvasElement.width = video.videoWidth;
                canvasElement.height = video.videoHeight;
            }
            // FPS counting
            frames++;
            const now = performance.now();
            if (now - lastFpsUpdate >= 500) {
                const fps = Math.round((frames * 1000) / (now - lastFpsUpdate));
                if (fpsEl) fpsEl.textContent = fps;
                frames = 0;
                lastFpsUpdate = now;
            }
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.save();
            if (isMirrored) {
                canvasCtx.translate(canvasElement.width, 0);
                canvasCtx.scale(-1, 1);
            }
            canvasCtx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.restore();
            requestAnimationFrame(render);
        }
        render();
    }

    // MediaPipe results handler
    function onResults(results) {
        // FPS counted per results frame
        frames++;
        const now = performance.now();
        if (now - lastFpsUpdate >= 500) {
            const fps = Math.round((frames * 1000) / (now - lastFpsUpdate));
            if (fpsEl) fpsEl.textContent = fps;
            frames = 0;
            lastFpsUpdate = now;
        }

        console.debug('onResults hands:', results.multiHandLandmarks ? results.multiHandLandmarks.length : 0);
        // draw image to canvas
        if (results.image) {
            // ensure canvas size
            if (canvasElement.width !== results.image.width || canvasElement.height !== results.image.height) {
                canvasElement.width = results.image.width;
                canvasElement.height = results.image.height;
            }
            canvasCtx.save();
            if (isMirrored) {
                canvasCtx.translate(canvasElement.width, 0);
                canvasCtx.scale(-1, 1);
            }
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.restore();
        }

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                const landmarks = results.multiHandLandmarks[i];
                const score = (results.multiHandedness && results.multiHandedness[i] && results.multiHandedness[i].score) ? results.multiHandedness[i].score : 1.0;
                try {
                    // Optionally draw landmarks for visual feedback
                    if (showLandmarksCheckbox && showLandmarksCheckbox.checked && typeof drawConnectors === 'function' && typeof drawLandmarks === 'function') {
                        // scaled landmarks for canvas size
                        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
                        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 });
                    }
                    handleLandmarks(landmarks, score);
                } catch (e) {
                    console.warn('handleLandmarks error', e);
                }
            }
        } else {
            // No hands detected in this frame: clear temporal buffers and show status
            try {
                recognizer.reset();
            } catch (e) {}
            try { stabilizer.reset && stabilizer.reset(); } catch (e) {}
            // Update UI to indicate no hand
            if (gestureDisplay) gestureDisplay.textContent = 'No hand detected';
            if (gestureConfidence) gestureConfidence.textContent = 'Confidence: 0%';
            if (confidenceEl) confidenceEl.textContent = '0%';
            if (statusEl) statusEl.textContent = 'No hand detected';
            if (gestureOverlay) gestureOverlay.textContent = '';
            if (gestureOverlayConf) gestureOverlayConf.textContent = '';
            // Clear overlay
            try { drawScoreOverlay({}); } catch (e) {}
        }

        // After processing landmarks, draw score overlay if recognizer has scores
        try {
            const scores = recognizer.getConfidenceScores();
            drawScoreOverlay(scores);
        } catch (e) {}
    }

    // Start camera wrapper used by UI (returns when camera is active)
    function startCamera() {
        return new Promise((resolve, reject) => {
            try {
                setupCamera();
                const timeout = setTimeout(() => {
                    if (!isCameraActive) {
                        // Give up after 5s
                        clearInterval(checkInterval);
                        reject(new Error('Camera start timeout'));
                    }
                }, 5000);
                const checkInterval = setInterval(() => {
                    if (isCameraActive) {
                        clearTimeout(timeout);
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            } catch (e) {
                reject(e);
            }
        });
    }

    function stopCamera() {
        // Stop MediaPipe camera helper first
        try {
            if (camera && typeof camera.stop === 'function') {
                camera.stop();
            }
        } catch (e) {
            console.warn('camera.stop() error', e);
        }
        camera = null;

        if (videoStream) {
            try { videoStream.getTracks().forEach(t => t.stop()); } catch (e) { /* ignore */ }
            videoStream = null;
        }

        // Clear video element and canvas
        try { videoElement.srcObject = null; } catch (e) {}
        isCameraActive = false;
        frames = 0;
        lastFpsUpdate = performance.now();
        if (fpsEl) fpsEl.textContent = '0';
        if (confidenceEl) confidenceEl.textContent = '0%';
        try { canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); } catch (e) {}
        logStatus('Camera stopped', 'ready');
    }

    // Mirror toggle (checkbox id="mirrorToggle")
    const mirrorToggle = document.getElementById('mirrorToggle');
    if (mirrorToggle) {
        mirrorToggle.addEventListener('change', (e) => {
            isMirrored = !!e.target.checked;
        });
    }

    // tab navigation handled further down by '.tab-btn' click listeners

    // (removed orphaned results-processing block)

function handleLandmarks(landmarks, score) {
    // Convert landmark objects to plain arrays of {x,y,z}
    const lm = landmarks.map(p => ({ x: p.x, y: p.y, z: p.z }));

    let smoothed = null;
    if (stabilizationCheckbox.checked) {
        smoothed = stabilizer.smoothLandmarks(lm, score);
        if (!smoothed) {
            // Not stable or below threshold
            return;
        }
        // smoothLandmarks may return object or landmarks array
        if (Array.isArray(smoothed)) {
            smoothed = { landmarks: smoothed, confidence: score };
        }
    } else {
        smoothed = { landmarks: lm, confidence: score };
    }

    // Normalized landmarks to be scale-invariant for recognition
    const normalized = HandGeometryAnalyzer.getNormalizedLandmarks(smoothed.landmarks);

    // Debug: show finger extensions and orientation
    try {
        const extensionsDbg = HandGeometryAnalyzer.getFingerExtensions(smoothed.landmarks);
        const orientationDbg = HandGeometryAnalyzer.getHandOrientation(smoothed.landmarks);
        debugPanel.textContent = JSON.stringify({ extensions: extensionsDbg, orientation: orientationDbg }, null, 2);
    } catch (e) {
        console.warn('debug calc failed', e);
    }

    // First try KNN classifier if we have user samples
    let knnResult = null;
    if (knn && knn.hasSamples()) {
        const features = flattenLandmarks(normalized);
        const pred = knn.predict(features, 3);
        if (pred) {
            knnResult = { gesture: pred.label, confidence: pred.confidence };
            console.debug('[KNN]', pred.label, 'conf:', pred.confidence.toFixed(3));
        }
    }

    // Recognize gesture (heuristic)
    const heuristicResult = recognizer.recognize(normalized);

    if (heuristicResult) {
        console.debug('[HEURISTIC]', heuristicResult.gesture, 'conf:', heuristicResult.confidence.toFixed(3), 'scores:', recognizer.getConfidenceScores());
        try {
            const scores = recognizer.getConfidenceScores();
            debugPanel.textContent = debugPanel.textContent + '\n' + JSON.stringify({ heuristic: { gesture: heuristicResult.gesture, confidence: heuristicResult.confidence }, scores }, null, 2);
        } catch(e) { }
    } else {
        console.debug('[HEURISTIC] none');
        try { debugPanel.textContent = debugPanel.textContent + '\nheuristic: none\n' + JSON.stringify(recognizer.getConfidenceScores(), null, 2); } catch(e) {}
    }

    // Decide which result to trust:
    // If user has trained samples (KNN mode), prefer KNN even if confidence is moderate.
    // If no user samples, fall back to heuristics (default recognizer).
    let result = null;
    if (knnResult) {
        // KNN has trained samples: trust KNN with lower threshold (0.5 instead of 0.6)
        if (knnResult.confidence >= 0.5) {
            result = { gesture: knnResult.gesture, confidence: knnResult.confidence, metadata: ISL_GESTURES[knnResult.gesture] || {}, source: 'KNN' };
            console.debug('[CHOSEN] KNN:', knnResult.gesture);
        } else if (heuristicResult) {
            // KNN too weak; fall back to heuristic
            result = { ...heuristicResult, source: 'HEURISTIC' };
            console.debug('[CHOSEN] HEURISTIC (KNN below threshold):', heuristicResult.gesture);
        }
    } else {
        // No user samples; use heuristic only
        result = heuristicResult ? { ...heuristicResult, source: 'HEURISTIC' } : null;
        if (result) console.debug('[CHOSEN] HEURISTIC (no KNN samples):', result.gesture);
    }

    if (!result) return;

    // Add to stabilizer buffer and temporal analyzer
    stabilizer.addToBuffer(normalized, smoothed.confidence);
    temporalAnalyzer.recordGesture(result.gesture, result.confidence);

    // Validate temporal consistency
    const isValidated = stabilizer.validateGesture(result.gesture, result.confidence) && stabilizer.isConsistent(result.gesture);

    if (isValidated) {
        // Map to text
        const lang = languageSelect.value;
        const translation = translator.translate(result.gesture, lang);

        // Update UI
        gestureDisplay.textContent = (ISL_GESTURES[result.gesture]?.en) ? ISL_GESTURES[result.gesture].en : result.gesture;
        gestureConfidence.textContent = 'Confidence: ' + Math.round(result.confidence * 100) + '%';
        if (confidenceEl) confidenceEl.textContent = Math.round(result.confidence * 100) + '%';
        console.debug('Recognized', result.gesture, 'conf', result.confidence.toFixed(2));

        // Update camera overlay too
        if (gestureOverlay) {
            gestureOverlay.textContent = (ISL_GESTURES[result.gesture]?.en) ? ISL_GESTURES[result.gesture].en : result.gesture;
        }
        if (gestureOverlayConf) {
            gestureOverlayConf.textContent = 'Confidence: ' + Math.round(result.confidence * 100) + '%';
        }

        textOutput.innerHTML = `<p>${translation}</p>`;
        speakBtn.disabled = false;

        // Automatically speak the translation
        speakText(translation, lang);
    }
}

// Draw top-3 score overlay on canvas
function drawScoreOverlay(scores) {
    if (!canvasCtx || !canvasElement) return;
    // Clear a small region
    const x = 10, y = 10, w = 220, h = 90;
    canvasCtx.save();
    canvasCtx.clearRect(x, y, w, h);
    canvasCtx.fillStyle = 'rgba(0,0,0,0.45)';
    canvasCtx.fillRect(x, y, w, h);
    canvasCtx.fillStyle = '#fff';
    canvasCtx.font = '14px Arial';
    canvasCtx.fillText('Top candidates:', x + 8, y + 22);
    if (!scores || Object.keys(scores).length === 0) {
        canvasCtx.fillText('- none -', x + 8, y + 44);
        canvasCtx.restore();
        return;
    }
    const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]).slice(0, 3);
    for (let i = 0; i < entries.length; i++) {
        const [name, sc] = entries[i];
        const label = `${i + 1}. ${name} ${Math.round(sc * 100)}%`;
        canvasCtx.fillText(label, x + 8, y + 44 + i * 18);
    }
    canvasCtx.restore();
}

// Auto-record quick calibration: capture N samples spaced by interval ms
document.getElementById('auto-record-btn')?.addEventListener('click', () => {
    const gesture = document.getElementById('quick-gesture-select').value;
    const count = parseInt(document.getElementById('auto-record-count').value || '8', 10);
    autoRecordSamples(gesture, count, 400);
});

async function autoRecordSamples(label, count = 8, interval = 400) {
    const status = document.getElementById('auto-record-status');
    if (!status) return;
    status.textContent = `Recording ${count} samples for ${label}...`;
    let recorded = 0;
    for (let i = 0; i < count; i++) {
        await new Promise(resolve => setTimeout(resolve, interval));
        const prev = stabilizer.prevLandmarks;
        if (!prev) {
            status.textContent = `No stable hand detected yet (${recorded}/${count})`;
            continue;
        }
        const normalized = HandGeometryAnalyzer.getNormalizedLandmarks(prev);
        const features = flattenLandmarks(normalized);
        knn.addSample(label, features);
        recorded++;
        status.textContent = `Recorded ${recorded}/${count} samples for ${label}`;
    }
    updateSampleCount();
    status.textContent = `Done. Recorded ${recorded}/${count} samples for ${label}.`;
}

// Initialize voices (some browsers load voices asynchronously)
function initVoices() {
    // Warm-up call to load voices list
    window.speechSynthesis.getVoices();
    if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
            // no-op but ensures voices are available later
        };
    }
}

initVoices();
logStatus('Ready', 'ready');

// Resize canvas when window changes
window.addEventListener('resize', () => setCanvasSize());

// Stop speaking when leaving page
window.addEventListener('beforeunload', () => stopSpeaking());

// Populate gesture select with available gestures from dictionary
function populateGestureSelect() {
    const gestures = recognizer.getAvailableGestures();
    gestureSelect.innerHTML = '';
    gestures.forEach(g => {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = ISL_GESTURES[g]?.en || g;
        gestureSelect.appendChild(opt);
    });
}

populateGestureSelect();

function updateSampleCount() {
    sampleCountEl.textContent = knn.getSampleCount();
}

// Helper to flatten normalized landmarks into feature vector
function flattenLandmarks(normLandmarks) {
    const f = [];
    for (const p of normLandmarks) {
        f.push(p.x, p.y, p.z || 0);
    }
    return f;
}

recordSampleBtn.addEventListener('click', () => {
    // try to get last landmarks from stabilizer.prevLandmarks
    const prev = stabilizer.prevLandmarks;
    if (!prev) {
        alert('No stable hand detected to record. Hold your gesture still and try again.');
        return;
    }
    const normalized = HandGeometryAnalyzer.getNormalizedLandmarks(prev);
    const features = flattenLandmarks(normalized);
    const label = gestureSelect.value;
    knn.addSample(label, features);
    updateSampleCount();
});

saveSamplesBtn.addEventListener('click', () => {
    const ok = knn.saveToLocalStorage();
    alert(ok ? 'Samples saved to localStorage.' : 'Failed to save samples.');
});

loadSamplesBtn.addEventListener('click', () => {
    const ok = knn.loadFromLocalStorage();
    if (ok) updateSampleCount();
    alert(ok ? 'Samples loaded from localStorage.' : 'No saved samples found.');
});

clearSamplesBtn.addEventListener('click', () => {
    if (!confirm('Clear all recorded samples?')) return;
    knn.clearSamples();
    updateSampleCount();
});

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        // Add active class to clicked button and corresponding pane
        btn.classList.add('active');
        const pane = document.getElementById(`${tabName}-tab`);
        if (pane) pane.classList.add('active');
    });
});

// Camera Selection
const cameraSelect = document.getElementById('cameraSelect');
let currentCameraFacingMode = 'user'; // user = front, environment = back

cameraSelect.addEventListener('change', async () => {
    const facingMode = cameraSelect.value === 'back' ? 'environment' : 'user';
    currentCameraFacingMode = facingMode;
    
    // Stop current camera
    if (camera) {
        camera.stop();
    }
    
    // Restart with new camera
    if (hands) {
        await startCamera();
    }
});

// Enum available cameras on startup
async function enumerateCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        
        // Hide camera select if only 1 camera available
        if (cameras.length <= 1) {
            cameraSelect.style.display = 'none';
        }
    } catch (e) {
        console.warn('Cannot enumerate cameras:', e);
    }
}

// Call on page load
enumerateCameras();
