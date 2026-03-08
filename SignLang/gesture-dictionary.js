/**
 * Indian Sign Language (ISL) Gesture Dictionary
 * Maps hand landmarks to ISL gestures and their meanings
 */

const ISL_GESTURES = {
    // Basic Numbers (0-9)
    'ZERO': {
        en: 'Zero',
        hi: 'शून्य',
        te: 'సున్న',
        description: 'Thumb and index finger forming circle',
        confidence_threshold: 0.6,
    },
    'ONE': {
        en: 'One',
        hi: 'एक',
        te: 'ఒకటి',
        description: 'Single extended index finger',
        confidence_threshold: 0.5,
    },
    'TWO': {
        en: 'Two',
        hi: 'दो',
        te: 'రెండు',
        description: 'Index and middle finger extended',
        confidence_threshold: 0.5,
    },
    'THREE': {
        en: 'Three',
        hi: 'तीन',
        te: 'మూడు',
        description: 'Index, middle and ring finger extended',
        confidence_threshold: 0.5,
    },
    'FOUR': {
        en: 'Four',
        hi: 'चार',
        te: 'నాలుగు',
        description: 'Four fingers extended',
        confidence_threshold: 0.5,
    },
    'FIVE': {
        en: 'Five',
        hi: 'पांच',
        te: 'ఐదు',
        description: 'All five fingers extended',
        // Make FIVE unlikely by default so it doesn't dominate heuristics
        confidence_threshold: 0.95,
    },
    'SIX': {
        en: 'Six',
        hi: 'छः',
        te: 'ఆరు',
        description: 'Thumb and five fingers in specific position',
        confidence_threshold: 0.6,
    },
    'SEVEN': {
        en: 'Seven',
        hi: 'सात',
        te: 'ఏడు',
        description: 'Seven sign with hand motion',
        confidence_threshold: 0.6,
    },
    'EIGHT': {
        en: 'Eight',
        hi: 'आठ',
        te: 'ఎight',
        description: 'Eight sign with hand motion',
        confidence_threshold: 0.6,
    },
    'NINE': {
        en: 'Nine',
        hi: 'नौ',
        te: 'తొమ్మిది',
        description: 'Nine sign with hand motion',
        confidence_threshold: 0.6,
    },

    // Basic Actions
    'HELLO': {
        en: 'Hello',
        hi: 'नमस्ते',
        te: 'హలో',
        description: 'Open palm facing outward, fingers spread',
        confidence_threshold: 0.55,
    },
    'BAD': {
        en: 'Bad',
        hi: 'बुरा',
        te: 'చెడు',
        description: 'Thumb pointing downward (thumbs down)',
        confidence_threshold: 0.65,
    },
    'THANK_YOU': {
        en: 'Thank You',
        hi: 'धन्यवाद',
        te: 'ధన్యవాదాలు',
        description: 'Hand touching chin and moving outward',
        confidence_threshold: 0.6,
    },
    'YES': {
        en: 'Yes',
        hi: 'हाँ',
        te: 'అవును',
        description: 'Fist moving up and down',
        confidence_threshold: 0.55,
    },
    'NO': {
        en: 'No',
        hi: 'नहीं',
        te: 'లేదు',
        description: 'Hands moving side to side',
        confidence_threshold: 0.55,
    },
    'PLEASE': {
        en: 'Please',
        hi: 'कृपया',
        te: 'దయచేసి',
        description: 'Hand on chest with circular motion',
        confidence_threshold: 0.85,
    },

    // Common Words
    'WATER': {
        en: 'Water',
        hi: 'पानी',
        confidence_threshold: 0.85,
        description: 'Fingers touching together simulating water flow',
        confidence_threshold: 0.6,
    },
    'FOOD': {
        en: 'Food',
        hi: 'खाना',
        te: 'ఆహారం',
        description: 'Fingers to mouth motion',
        confidence_threshold: 0.6,
    },
    'HELP': {
        en: 'Help',
        hi: 'मदद',
        te: 'సహాయం',
        description: 'Open hands in front of body',
        confidence_threshold: 0.6,
    },
    'FRIEND': {
        en: 'Friend',
        hi: 'मित्र',
        te: 'స్నేహితుడు',
        description: 'Hooked index fingers interlocking',
        confidence_threshold: 0.65,
    },
    'FAMILY': {
        en: 'Family',
        hi: 'परिवार',
        te: 'కుటుంబం',
        description: 'Hands making circular motion around face',
        confidence_threshold: 0.6,
    },
    'HAPPY': {
        en: 'Happy',
        hi: 'खुश',
        te: 'సంతోషం',
        description: 'Both hands moving upward with open fingers',
        confidence_threshold: 0.6,
    },
    'SAD': {
        en: 'Sad',
        hi: 'उदास',
        te: 'విచారం',
        description: 'Both hands moving downward with closed fingers',
        confidence_threshold: 0.6,
    },

    // Pointing & Direction
    'POINT_UP': {
        en: 'Up',
        hi: 'ऊपर',
        te: 'పైకి',
        description: 'Index finger pointing upward',
        confidence_threshold: 0.55,
    },
    'POINT_DOWN': {
        en: 'Down',
        hi: 'नीचे',
        te: 'క్రిందికి',
        description: 'Index finger pointing downward',
        confidence_threshold: 0.55,
    },
    'POINT_LEFT': {
        en: 'Left',
        hi: 'बायां',
        te: 'ఎడమ',
        description: 'Index finger pointing left',
        confidence_threshold: 0.55,
    },
    'POINT_RIGHT': {
        en: 'Right',
        hi: 'दायां',
        te: 'కుడి',
        description: 'Index finger pointing right',
        confidence_threshold: 0.55,
    },

    // Time-related
    'NOW': {
        en: 'Now',
        hi: 'अभी',
        te: 'ఇప్పుడు',
        description: 'Both hands down with quick motion',
        confidence_threshold: 0.6,
    },
    'MORNING': {
        en: 'Morning',
        hi: 'सुबह',
        te: 'ఉదయం',
        description: 'Hand showing sunrise position',
        confidence_threshold: 0.6,
    },
    'NIGHT': {
        en: 'Night',
        hi: 'रात',
        te: 'రాత్రి',
        description: 'Hand showing overhead position (moon)',
        confidence_threshold: 0.6,
    },

    // Emotions & States
    'ANGRY': {
        en: 'Angry',
        hi: 'गुस्सा',
        te: 'కోపం',
        description: 'Hands in fist with sharp movements',
        confidence_threshold: 0.65,
    },
    'TIRED': {
        en: 'Tired',
        hi: 'थका',
        te: 'అలసిపోయిన',
        description: 'Hands falling down with slow motion',
        confidence_threshold: 0.6,
    },
    'COLD': {
        en: 'Cold',
        hi: 'ठंड',
        te: 'చలి',
        description: 'Hands shivering motion',
        confidence_threshold: 0.6,
    },
    'HOT': {
        en: 'Hot',
        hi: 'गर्म',
        te: 'ఉష్ణ',
        description: 'Hand in front of face with outward motion',
        confidence_threshold: 0.6,
    },

    // Body Parts
    'HEAD': {
        en: 'Head',
        hi: 'सिर',
        te: 'తల',
        description: 'Finger pointing to head',
        confidence_threshold: 0.55,
    },
    'HAND': {
        en: 'Hand',
        hi: 'हाथ',
        te: 'చేయి',
        description: 'Showing palm of hand',
        confidence_threshold: 0.5,
    },
    'FOOT': {
        en: 'Foot',
        hi: 'पैर',
        te: 'పాదం',
        description: 'Finger pointing to foot area',
        confidence_threshold: 0.55,
    },

    // Palm Orientation Based
    'PALM_UP': {
        en: 'Palm Up',
        hi: 'हथेली ऊपर',
        te: 'అరచేయి పైకి',
        description: 'Open palm facing upward',
        confidence_threshold: 0.5,
    },
    'PALM_DOWN': {
        en: 'Palm Down',
        hi: 'हथेली नीचे',
        te: 'అరచేయి క్రిందికి',
        description: 'Open palm facing downward',
        confidence_threshold: 0.5,
    },
    'GOOD': {
        en: 'Good',
        hi: 'अच्छा',
        te: 'సరే',
        description: 'Thumbs up (thumb extended, other fingers folded)',
        confidence_threshold: 0.5,
    },
    'OK': {
        en: 'OK',
        hi: 'ठीक है',
        te: 'సరే',
        description: 'Thumb and index finger forming a circle (OK sign)',
        confidence_threshold: 0.5,
    },
};

/**
 * Gesture Recognition Engine
 * Analyzes hand landmarks and matches to known gestures
 */
class GestureRecognizer {
    constructor() {
        this.gestures = ISL_GESTURES;
        this.lastRecognizedGesture = null;
        this.confidenceScores = {};
    }

    /**
     * Main gesture recognition function
     * Analyzes hand landmarks and returns matched gesture
     */
    recognize(landmarks) {
        if (!landmarks || landmarks.length < 21) {
            return null;
        }

        const gestureScores = this._analyzeGesture(landmarks);
        
        if (Object.keys(gestureScores).length === 0) {
            return null;
        }

        // Find best matching gesture
        const [gestureName, score] = Object.entries(gestureScores)
            .sort(([, a], [, b]) => b - a)[0];

        this.confidenceScores = gestureScores;
        this.lastRecognizedGesture = gestureName;

        return {
            gesture: gestureName,
            confidence: score,
            metadata: this.gestures[gestureName] || {},
        };
    }

    /**
     * Analyze hand landmarks to calculate gesture scores
     */
    _analyzeGesture(landmarks) {
        const scores = {};
        const extensions = HandGeometryAnalyzer.getFingerExtensions(landmarks);
        const orientation = HandGeometryAnalyzer.getHandOrientation(landmarks);

        // Number recognition
        const numExtended = Object.values(extensions).filter(e => e).length;

        if (numExtended === 0) {
            scores['ZERO'] = 0.7;
        } else if (numExtended === 1 && extensions.index) {
            scores['ONE'] = 0.75;
            scores['POINT_UP'] = this._detectPointingDirection(landmarks) === 'up' ? 0.75 : 0.3;
        } else if (numExtended === 2 && extensions.index && extensions.middle) {
            scores['TWO'] = 0.75;
        } else if (numExtended === 3 && extensions.index && extensions.middle && extensions.ring) {
            scores['THREE'] = 0.75;
        } else if (numExtended === 4 && !extensions.thumb) {
            scores['FOUR'] = 0.7;
        } else if (numExtended === 5) {
            // When all five fingers are extended, do NOT strongly favor the 'FIVE' label.
            // This reduces bias where open palm is often interpreted as 'FIVE'.
            // Prefer palm orientation (up/down) instead, leaving 'FIVE' as a very low-scoring candidate.
            scores['PALM_UP'] = orientation.palmUp ? 0.55 : 0.2;
            scores['PALM_DOWN'] = !orientation.palmUp ? 0.55 : 0.2;
            scores['FIVE'] = 0.2; // below threshold so it won't usually be selected
        }

        // Direction detection
        scores['POINT_UP'] = this._detectPointingDirection(landmarks) === 'up' ? 0.7 : scores['POINT_UP'] || 0.2;
        scores['POINT_DOWN'] = this._detectPointingDirection(landmarks) === 'down' ? 0.7 : scores['POINT_DOWN'] || 0.2;
        scores['POINT_LEFT'] = this._detectPointingDirection(landmarks) === 'left' ? 0.7 : 0.2;
        scores['POINT_RIGHT'] = this._detectPointingDirection(landmarks) === 'right' ? 0.7 : 0.2;

        // Motion-based gestures
        // HELLO should be an open-palm wave away from the face (not near chin)
        const wrist = landmarks[0];
        const handCenterX_quick = (landmarks[4].x + landmarks[8].x + landmarks[12].x) / 3;
        const nearFace = wrist.y < 0.38 && handCenterX_quick > 0.2 && handCenterX_quick < 0.8;
        scores['HELLO'] = (this._detectWaving(landmarks) && !nearFace) ? 0.7 : 0.12;
        scores['YES'] = this._detectHeadNod(landmarks) ? 0.75 : 0.1;
        scores['NO'] = this._detectHeadShake(landmarks) ? 0.75 : 0.1;

        // Palm orientation bias: prefer palm orientation only moderately unless other heuristics match
        if (orientation.palmUp) {
            scores['PALM_UP'] = Math.max(scores['PALM_UP'] || 0, 0.45);
        } else {
            scores['PALM_DOWN'] = Math.max(scores['PALM_DOWN'] || 0, 0.45);
        }

        // Additional heuristics for common gestures
        try {
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
            const wrist = landmarks[0];
            const middleTip = landmarks[12];

            // OK sign: thumb and index finger touching / close together
            const dx = thumbTip.x - indexTip.x;
            const dy = thumbTip.y - indexTip.y;
            const distThumbIndex = Math.sqrt(dx * dx + dy * dy);
            scores['OK'] = distThumbIndex < 0.06 ? 0.8 : (distThumbIndex < 0.12 ? 0.4 : 0.15);

            // Good (thumbs up): thumb extended; other fingers folded; thumb pointing upwards
            const ext = extensions;
            const otherExtended = (ext.index ? 1 : 0) + (ext.middle ? 1 : 0) + (ext.ring ? 1 : 0) + (ext.pinky ? 1 : 0);
            const thumbUp = thumbTip.y < wrist.y; // smaller y = higher in image
            if (ext.thumb && otherExtended === 0 && thumbUp) {
                scores['GOOD'] = 0.9;
            } else if (ext.thumb && otherExtended <= 1) {
                scores['GOOD'] = 0.6;
            } else {
                scores['GOOD'] = Math.max(scores['GOOD'] || 0, 0.1);
            }

            // Bad (thumbs down): thumb extended; other fingers folded; thumb pointing downwards
            const thumbDown = thumbTip.y > wrist.y; // larger y = lower in image
            if (ext.thumb && otherExtended === 0 && thumbDown) {
                scores['BAD'] = 0.9;
            } else if (ext.thumb && otherExtended <= 1 && thumbDown) {
                scores['BAD'] = 0.6;
            } else {
                scores['BAD'] = Math.max(scores['BAD'] || 0, 0.1);
            }

            // Thank you: require hand near upper-center region (approx. chin/face)
            const palmY = wrist.y;
            const handCenterX = (thumbTip.x + indexTip.x + middleTip.x) / 3;
            const avgFingertipY = (thumbTip.y + indexTip.y + middleTip.y) / 3;
            // Conditions: high in frame (small y), near center, fingers roughly close to face
            if (palmY < 0.32 && handCenterX > 0.22 && handCenterX < 0.78 && avgFingertipY < 0.45) {
                scores['THANK_YOU'] = Math.max(scores['THANK_YOU'] || 0, 0.75);
            } else if (palmY < 0.38 && handCenterX > 0.2 && handCenterX < 0.8) {
                scores['THANK_YOU'] = Math.max(scores['THANK_YOU'] || 0, 0.45);
            } else {
                scores['THANK_YOU'] = Math.max(scores['THANK_YOU'] || 0, 0.12);
            }
        } catch (e) {
            // ignore heuristic errors
        }

        // Filter by confidence threshold and remove low scores
        return Object.entries(scores)
            .filter(([name, score]) => score >= (this.gestures[name]?.confidence_threshold || 0.5))
            .reduce((acc, [name, score]) => ({ ...acc, [name]: score }), {});
    }

    /**
     * Detect pointing direction
     */
    _detectPointingDirection(landmarks) {
        if (!landmarks || landmarks.length < 21) return null;

        const indexTip = landmarks[8];
        const palm = landmarks[0];

        const dy = palm.y - indexTip.y;
        const dx = indexTip.x - palm.x;

        if (Math.abs(dy) > Math.abs(dx)) {
            return dy > 0 ? 'down' : 'up';
        } else {
            return dx > 0 ? 'right' : 'left';
        }
    }

    /**
     * Detect if hand is waving
     */
    _detectWaving(landmarks) {
        if (!landmarks || landmarks.length < 21) return false;
        
        // Simple heuristic: if hand is open and fingers extended
        const extensions = HandGeometryAnalyzer.getFingerExtensions(landmarks);
        const extendedCount = Object.values(extensions).filter(e => e).length;
        // Prefer waving when hand is not near the face (wrist lower in frame)
        try {
            const wrist = landmarks[0];
            if (wrist.y < 0.38) return false; // near face -> not a general wave
        } catch (e) {}
        return extendedCount >= 4;
    }

    /**
     * Detect head nod motion (up and down)
     */
    _detectHeadNod(landmarks) {
        // This would need temporal data to properly detect motion
        // For now, use hand position heuristic
        return landmarks[0].y > 0.5; // Hand below center
    }

    /**
     * Detect head shake motion (side to side)
     */
    _detectHeadShake(landmarks) {
        // This would need temporal data
        return landmarks[0].x < 0.3 || landmarks[0].x > 0.7; // Hand at sides
    }

    /**
     * Get all available gestures
     */
    getAvailableGestures() {
        return Object.keys(this.gestures);
    }

    /**
     * Get gesture details
     */
    getGestureDetails(gestureName) {
        return this.gestures[gestureName] || null;
    }

    /**
     * Get last recognized gesture
     */
    getLastGesture() {
        return this.lastRecognizedGesture;
    }

    /**
     * Get confidence scores for all gestures
     */
    getConfidenceScores() {
        return this.confidenceScores;
    }

    /**
     * Reset recognizer state
     */
    reset() {
        this.lastRecognizedGesture = null;
        this.confidenceScores = {};
    }
}

/**
 * Gesture to Speech Translator
 * Converts recognized gestures to text in multiple languages
 */
class GestureToSpeechTranslator {
    constructor() {
        this.translationHistory = [];
        this.maxHistory = 50;
    }

    /**
     * Translate gesture to text
     */
    translate(gestureName, targetLanguage = 'en') {
        if (!gestureName || !ISL_GESTURES[gestureName]) {
            return null;
        }

        const gesture = ISL_GESTURES[gestureName];
        const languageMap = {
            'en-US': gesture.en,
            'hi-IN': gesture.hi,
            'te-IN': gesture.te,
        };

        const translation = languageMap[targetLanguage] || gesture.en;

        // Add to history
        this.translationHistory.push({
            gesture: gestureName,
            language: targetLanguage,
            translation: translation,
            timestamp: Date.now(),
        });

        if (this.translationHistory.length > this.maxHistory) {
            this.translationHistory.shift();
        }

        return translation;
    }

    /**
     * Get translation history
     */
    getHistory(count = 10) {
        return this.translationHistory.slice(-count);
    }

    /**
     * Build sentence from gesture sequence
     */
    buildSentence(gestures, targetLanguage = 'en') {
        return gestures
            .map(g => this.translate(g, targetLanguage))
            .filter(t => t !== null)
            .join(' ');
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.translationHistory = [];
    }

    /**
     * Get full history as text
     */
    getFullHistory() {
        return this.translationHistory
            .map(h => h.translation)
            .join(' ');
    }
}
