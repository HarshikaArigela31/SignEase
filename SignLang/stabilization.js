/**
 * Adaptive Stabilization Module
 * Smooths hand landmark detection and prevents false positives
 * using Kalman filtering and temporal consistency checks
 */

class HandStabilizer {
    constructor(smoothingFactor = 0.6, confidenceThreshold = 0.5) {
        this.smoothingFactor = smoothingFactor;
        this.confidenceThreshold = confidenceThreshold;
        this.prevLandmarks = null;
        this.prevConfidence = 0;
        this.frameBuffer = [];
        this.bufferSize = 5;
        this.stableGestureCounter = 0;
        this.stabilityThreshold = 3;
        this.lastStableGesture = null;
        this.lastGestureTime = 0;
        this.gestureMinDuration = 500; // ms
    }

    /**
     * Apply Kalman-like smoothing to hand landmarks
     */
    smoothLandmarks(landmarks, confidence) {
        if (!landmarks || landmarks.length === 0) {
            return null;
        }

        // Filter by confidence
        if (confidence < this.confidenceThreshold) {
            return null;
        }

        if (this.prevLandmarks === null) {
            this.prevLandmarks = JSON.parse(JSON.stringify(landmarks));
            this.prevConfidence = confidence;
            return landmarks;
        }

        // Apply exponential smoothing to each landmark
        const smoothedLandmarks = landmarks.map((landmark, idx) => {
            const prevLandmark = this.prevLandmarks[idx];
            return {
                x: prevLandmark.x * (1 - this.smoothingFactor) + landmark.x * this.smoothingFactor,
                y: prevLandmark.y * (1 - this.smoothingFactor) + landmark.y * this.smoothingFactor,
                z: prevLandmark.z * (1 - this.smoothingFactor) + landmark.z * this.smoothingFactor,
            };
        });

        // Smooth confidence score
        const smoothedConfidence = 
            this.prevConfidence * (1 - this.smoothingFactor) + 
            confidence * this.smoothingFactor;

        this.prevLandmarks = JSON.parse(JSON.stringify(smoothedLandmarks));
        this.prevConfidence = smoothedConfidence;

        return { landmarks: smoothedLandmarks, confidence: smoothedConfidence };
    }

    /**
     * Detect sudden jumps in hand position (detect instability)
     */
    isStable(landmarks) {
        if (!this.prevLandmarks || !landmarks) {
            return true;
        }

        const threshold = 0.15; // Maximum allowed change per frame
        let maxDistance = 0;

        for (let i = 0; i < Math.min(landmarks.length, this.prevLandmarks.length); i++) {
            const curr = landmarks[i];
            const prev = this.prevLandmarks[i];
            
            const distance = Math.sqrt(
                Math.pow(curr.x - prev.x, 2) +
                Math.pow(curr.y - prev.y, 2) +
                Math.pow(curr.z - prev.z, 2)
            );

            maxDistance = Math.max(maxDistance, distance);
        }

        return maxDistance < threshold;
    }

    /**
     * Temporal filtering - ensures gesture is held for minimum duration
     */
    validateGesture(gestureName, confidence) {
        const now = Date.now();

        // If same gesture continues
        if (gestureName === this.lastStableGesture) {
            this.stableGestureCounter++;
            this.lastGestureTime = now;
        } else {
            // Gesture changed
            this.lastStableGesture = gestureName;
            this.stableGestureCounter = 1;
            this.lastGestureTime = now;
        }

        // Return gesture only if held for sufficient frames
        return this.stableGestureCounter >= this.stabilityThreshold;
    }

    /**
     * Buffer frames for consistency checking
     */
    addToBuffer(landmarks, confidence) {
        this.frameBuffer.push({ landmarks, confidence });
        if (this.frameBuffer.length > this.bufferSize) {
            this.frameBuffer.shift();
        }
    }

    /**
     * Check if gesture is consistent across buffered frames
     */
    isConsistent(gestureName) {
        if (this.frameBuffer.length < this.stabilityThreshold) {
            return false;
        }

        // Check if last few frames have similar characteristics
        const recentFrames = this.frameBuffer.slice(-this.stabilityThreshold);
        const avgConfidence = recentFrames.reduce((sum, f) => sum + f.confidence, 0) / recentFrames.length;

        return avgConfidence > this.confidenceThreshold;
    }

    /**
     * Reset stabilizer state
     */
    reset() {
        this.prevLandmarks = null;
        this.prevConfidence = 0;
        this.frameBuffer = [];
        this.stableGestureCounter = 0;
        this.lastStableGesture = null;
        this.lastGestureTime = 0;
    }

    /**
     * Get smoothing metrics for debugging
     */
    getMetrics() {
        return {
            smoothingFactor: this.smoothingFactor,
            confidenceThreshold: this.confidenceThreshold,
            bufferSize: this.frameBuffer.length,
            stableGestureCounter: this.stableGestureCounter,
            lastStableGesture: this.lastStableGesture,
        };
    }
}

/**
 * Gesture Temporal Analyzer
 * Analyzes motion patterns across time to prevent false detections
 */
class GestureTemporalAnalyzer {
    constructor() {
        this.gestureHistory = {};
        this.maxHistorySize = 10;
    }

    /**
     * Record gesture detection with timestamp
     */
    recordGesture(gestureName, confidence) {
        const now = Date.now();
        
        if (!this.gestureHistory[gestureName]) {
            this.gestureHistory[gestureName] = [];
        }

        this.gestureHistory[gestureName].push({
            time: now,
            confidence: confidence,
        });

        // Trim history
        if (this.gestureHistory[gestureName].length > this.maxHistorySize) {
            this.gestureHistory[gestureName].shift();
        }
    }

    /**
     * Get gesture frequency in recent window
     */
    getRecentFrequency(gestureName, windowMs = 1000) {
        if (!this.gestureHistory[gestureName]) {
            return 0;
        }

        const now = Date.now();
        const recentDetections = this.gestureHistory[gestureName].filter(
            entry => now - entry.time < windowMs
        );

        return recentDetections.length;
    }

    /**
     * Get average confidence for gesture
     */
    getAverageConfidence(gestureName, windowSize = 5) {
        if (!this.gestureHistory[gestureName]) {
            return 0;
        }

        const recent = this.gestureHistory[gestureName].slice(-windowSize);
        const avg = recent.reduce((sum, entry) => sum + entry.confidence, 0) / recent.length;
        
        return avg;
    }

    /**
     * Detect gesture change patterns (useful for sequence recognition)
     */
    getGestureSequence(windowMs = 2000) {
        const now = Date.now();
        const sequence = [];

        for (const [gestureName, history] of Object.entries(this.gestureHistory)) {
            const recent = history.filter(entry => now - entry.time < windowMs);
            if (recent.length > 0) {
                sequence.push({
                    gesture: gestureName,
                    count: recent.length,
                    avgConfidence: recent.reduce((sum, e) => sum + e.confidence, 0) / recent.length,
                    firstTime: recent[0].time,
                    lastTime: recent[recent.length - 1].time,
                });
            }
        }

        return sequence.sort((a, b) => a.firstTime - b.firstTime);
    }

    /**
     * Clear history
     */
    reset() {
        this.gestureHistory = {};
    }
}

/**
 * Hand Geometry Analyzer
 * Analyzes hand geometry to improve robustness against scale/perspective changes
 */
class HandGeometryAnalyzer {
    /**
     * Calculate hand scale (based on palm size)
     */
    static getHandScale(landmarks) {
        if (!landmarks || landmarks.length < 21) {
            return 1;
        }

        // Use distance between wrist and middle finger tip as reference
        const wrist = landmarks[0];
        const middleTip = landmarks[12];

        const distance = Math.sqrt(
            Math.pow(middleTip.x - wrist.x, 2) +
            Math.pow(middleTip.y - wrist.y, 2)
        );

        return distance;
    }

    /**
     * Get normalized hand landmarks (scale-invariant)
     */
    static getNormalizedLandmarks(landmarks) {
        const scale = this.getHandScale(landmarks);
        if (scale === 0) return landmarks;

        return landmarks.map(landmark => ({
            x: landmark.x / scale,
            y: landmark.y / scale,
            z: landmark.z / scale,
        }));
    }

    /**
     * Calculate hand orientation
     */
    static getHandOrientation(landmarks) {
        if (!landmarks || landmarks.length < 21) {
            return { palmUp: false, palmRight: false };
        }

        // Get palm normal direction (simplified)
        const wrist = landmarks[0];
        const middleBase = landmarks[9];
        const ringBase = landmarks[13];

        // Calculate vectors
        const v1 = {
            x: middleBase.x - wrist.x,
            y: middleBase.y - wrist.y,
        };
        const v2 = {
            x: ringBase.x - wrist.x,
            y: ringBase.y - wrist.y,
        };

        // Cross product (z-component)
        const palmZ = v1.x * v2.y - v1.y * v2.x;

        return {
            palmUp: v1.y < 0, // Palm facing up
            palmRight: palmZ > 0, // Palm facing right
        };
    }

    /**
     * Calculate finger extension states
     */
    static getFingerExtensions(landmarks) {
        if (!landmarks || landmarks.length < 21) {
            return {};
        }

        const fingers = {
            thumb: { tip: 4, pip: 2, mcp: 1 },
            index: { tip: 8, pip: 6, mcp: 5 },
            middle: { tip: 12, pip: 10, mcp: 9 },
            ring: { tip: 16, pip: 14, mcp: 13 },
            pinky: { tip: 20, pip: 18, mcp: 17 },
        };

        const extensions = {};

        for (const [fingerName, indices] of Object.entries(fingers)) {
            const tip = landmarks[indices.tip];
            const pip = landmarks[indices.pip];
            const mcp = landmarks[indices.mcp];

            // Extended if tip is further from mcp than pip is
            const tipDistance = Math.sqrt(
                Math.pow(tip.y - mcp.y, 2) + Math.pow(tip.x - mcp.x, 2)
            );
            const pipDistance = Math.sqrt(
                Math.pow(pip.y - mcp.y, 2) + Math.pow(pip.x - mcp.x, 2)
            );

            extensions[fingerName] = tipDistance > pipDistance * 1.2;
        }

        return extensions;
    }
}
