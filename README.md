# SignEase
# 🤟 Indian Sign Language Recognition System

A browser-based real-time gesture recognition system that translates Indian Sign Language (ISL) into English, Hindi, and Telugu with automatic text-to-speech output.

## Features ✨

- **Real-time Hand Detection**: Uses MediaPipe Hands for precise hand landmark tracking
- **Adaptive Stabilization**: Smooths noisy detections for reliable gesture recognition
- **Multilingual Speech**: Supports English, Hindi (हिंदी), and Telugu (తెలుగు)
- **Training Mode**: Record and save custom gesture samples for improved accuracy
- **KNN Classifier**: Lightweight on-device machine learning that learns from your environment
- **Works Offline**: Runs entirely in your browser—no server needed
- **Robust Recognition**: Handles challenging conditions like poor lighting, varied backgrounds, and different hand distances

## How to Use 🎯

### Quick Start (1 minute)

1. **Open `index.html` in a modern web browser** (Chrome, Edge, Firefox recommended)
2. **Allow camera access** when prompted
3. **Click "▶️ Start Camera"**
4. **Hold a gesture** in front of the webcam (e.g., raise all 5 fingers for "Five")
5. **See the recognized gesture** displayed on the camera overlay and in the output panel

### Training for Better Accuracy (Recommended)

The app works out-of-the-box with built-in heuristics, but training it with your own hand samples dramatically improves accuracy. Here's how:

#### Step 1️⃣: Pick a Gesture
- Under "🎓 Train For Better Recognition"
- Open the dropdown menu labeled "Pick a Gesture"
- Select a gesture you want to teach the app (e.g., "FIVE", "HELLO", "YES")

#### Step 2️⃣: Record Multiple Samples
1. **Hold the gesture steady** in front of the camera until the landmarks are stable (green dots visible)
2. **Click "📸 Record This Gesture Now"**
3. **Repeat 8-15 times**, slightly moving your hand each time:
   - Move your hand left/right
   - Move it up/down
   - Rotate your hand slightly
   - Change distance from camera
4. **Watch the "Samples Recorded" counter** increase
5. **Repeat for other gestures** (3-5 gestures is a good start)

#### Step 3️⃣: Save Your Training Data
- Click **"💾 Save"** to store your samples in browser memory (persists across sessions)
- Click **"📂 Load Previous"** to load previously saved samples
- The app will now use your custom samples for recognition!

#### Step 4️⃣: Test Recognition
- Perform the trained gestures in front of the camera
- The app will recognize your specific hand patterns
- Check the live overlay on the camera feed for instant feedback

## Gesture Reference 📚

Try these gestures first (they're easiest to train):

| Gesture | How to Do It |
|---------|-----------|
| **ZERO** | Form a circle with thumb & index finger |
| **ONE** | Extend only index finger |
| **TWO** | Extend index & middle fingers |
| **THREE** | Extend index, middle, ring fingers |
| **FOUR** | Extend 4 fingers (not thumb) |
| **FIVE** | Spread all 5 fingers wide |
| **POINT_UP** | Point index finger straight up |
| **POINT_DOWN** | Point index finger straight down |
| **PALM_UP** | Open palm facing upward |
| **PALM_DOWN** | Open palm facing downward |
| **YES** | Fist moving up and down |
| **NO** | Hands moving side to side |
| **HELLO** | Open hand waving motion |

## Settings ⚙️

- **🗣️ Language for Speech**: Choose English, Hindi, or Telugu for text-to-speech output
- **🎯 Detection Sensitivity**: Adjust slider to make recognition stricter (higher %) or more lenient (lower %)
- **👀 Show Hand Landmarks**: Toggle to see the green hand joint markers (helpful for training)
- **✨ Adaptive Stabilization**: Keep enabled for smooth, reliable recognition

## Troubleshooting 🔧

### "No gesture recognized"
1. Ensure **good lighting** (face the camera with light in front)
2. Keep your **entire hand visible** in the camera frame
3. **Hold the gesture steady** for 2-3 seconds
4. **Record training samples** for the specific gesture (see Training section above)

### Low confidence scores
- Your hand may be too far from or too close to the camera
- Try **different hand positions** while training (small rotations, movements)
- Record **more samples** (15-20 is better than 8-10)
- Increase **detection sensitivity** slightly (move slider to 60% instead of 50%)

### Recognizes wrong gesture
- The app may be confusing two similar gestures
- Record more diverse samples (different distances, lighting, hand angles)
- Clear old samples and start fresh: click **"🗑️ Clear All Data"**

### Camera not working
- Check browser permissions (allow camera access for this website)
- Try a different browser (Chrome/Edge work best with MediaPipe)
- Ensure no other app is using your webcam

## How It Works 🧠

1. **MediaPipe Hands** detects 21 hand landmarks (finger joints, palm, wrist)
2. **Adaptive Stabilization** smooths noisy detections using exponential filtering
3. **Hand Geometry Analysis** normalizes for scale and orientation
4. **KNN Classifier** (if you've recorded samples) matches your hand pose to saved patterns
5. **Gesture Dictionary** maps recognized poses to English, Hindi, Telugu translations
6. **Web Speech API** speaks the translation in your chosen language

## Browser Compatibility 🌐

- ✅ Chrome/Chromium (recommended)
- ✅ Microsoft Edge
- ✅ Firefox
- ⚠️ Safari (limited support for hand detection)
- ❌ Internet Explorer (not supported)

**Best performance**: Latest Chrome or Edge on a desktop/laptop with a decent webcam.

## Files 📁

- `index.html` - Main UI and structure
- `style.css` - Styling and layout
- `app.js` - Camera setup, gesture recognition flow, TTS integration
- `gesture-dictionary.js` - ISL gesture definitions and recognition logic
- `stabilization.js` - Hand landmark smoothing and temporal filtering
- `model.js` - Simple KNN classifier for custom training
- `README.md` - This file

## Tips for Best Results 💡

1. **Train in your environment**: Record samples with your typical lighting, background, and webcam
2. **Use simple gestures first**: Numbers (0-5) and pointing are easier than complex hand shapes
3. **Record diverse angles**: Capture slight rotations, distances, and movements
4. **Test immediately**: After recording, try the gesture to see if it's recognized
5. **Keep samples**: The app stores training data in browser localStorage—it persists even after closing
6. **Start simple, expand later**: Train 3-5 gestures well, then add more

## Technical Details 🛠️

- **Hand Landmarks**: 21 2D/3D coordinates per hand (MediaPipe format)
- **Feature Vector**: Normalized X, Y, Z of all 21 landmarks = 63 features
- **Distance Metric**: Euclidean distance in feature space
- **KNN k-value**: 3 (compares to 3 nearest training samples)
- **Confidence Threshold**: 0.6 (KNN must be ≥60% confident to use its prediction)
- **Smoothing Factor**: 0.6 exponential decay (balances responsiveness vs. stability)
- **Storage**: Browser localStorage (up to ~10MB, usually sufficient for 100+ gesture samples)

## Future Enhancements 🚀

- [ ] Gesture sequences (multi-hand, temporal patterns)
- [ ] More ISL vocabulary (~500+ common signs)
- [ ] TensorFlow.js-based deep model for even better accuracy
- [ ] Hand shape and motion capture for richer gesture recognition
- [ ] Offline mode (service worker)
- [ ] Export/import training data as JSON
- [ ] Mobile app version
- [ ] Real-time video recording with translated captions

## Credits 🙌

- **MediaPipe Hands** - Google AI hand detection
- **Web Speech API** - Browser native text-to-speech
- **IndexedDB / localStorage** - Persistent client-side storage

## License 📄

Open source for educational and accessibility purposes. Feel free to fork, modify, and distribute.

---

**Built with ❤️ for accessibility and inclusion**

Questions or suggestions? Feel free to create an issue or contribute!
