/**
 * Lightweight KNN classifier for flattened landmark vectors.
 * Stores samples in memory and supports save/load to localStorage.
 */
class KNNClassifierSimple {
    constructor() {
        // samples: { label: [ [featureVector], ... ] }
        this.samples = {};
    }

    addSample(label, features) {
        if (!this.samples[label]) this.samples[label] = [];
        this.samples[label].push(features.slice());
    }

    clearSamples() {
        this.samples = {};
    }

    getSampleCount() {
        return Object.values(this.samples).reduce((s, arr) => s + arr.length, 0);
    }

    hasSamples() {
        return this.getSampleCount() > 0;
    }

    saveToLocalStorage(key = 'isl_knn_samples') {
        try {
            const raw = JSON.stringify(this.samples);
            localStorage.setItem(key, raw);
            return true;
        } catch (e) {
            console.error('Failed to save samples', e);
            return false;
        }
    }

    loadFromLocalStorage(key = 'isl_knn_samples') {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return false;
            this.samples = JSON.parse(raw) || {};
            return true;
        } catch (e) {
            console.error('Failed to load samples', e);
            return false;
        }
    }

    // Euclidean distance
    static _distance(a, b) {
        let s = 0;
        for (let i = 0; i < a.length; i++) {
            const d = a[i] - b[i];
            s += d * d;
        }
        return Math.sqrt(s);
    }

    predict(features, k = 3) {
        const entries = [];
        for (const [label, vectors] of Object.entries(this.samples)) {
            for (const v of vectors) entries.push({ label, dist: KNNClassifierSimple._distance(features, v) });
        }

        if (entries.length === 0) return null;

        entries.sort((a, b) => a.dist - b.dist);
        const top = entries.slice(0, Math.max(1, Math.min(k, entries.length)));

        // Vote
        const votes = {};
        for (const t of top) {
            votes[t.label] = (votes[t.label] || 0) + 1;
        }
        const sortedVotes = Object.entries(votes).sort((a, b) => b[1] - a[1]);
        const label = sortedVotes[0][0];

        // Confidence as fraction of votes + distance decay
        const voteScore = sortedVotes[0][1] / top.length;
        const avgDist = top.reduce((s, x) => s + x.dist, 0) / top.length;
        const confidence = Math.max(0, Math.min(1, voteScore * (1 - Math.min(1, avgDist))));

        return { label, confidence };
    }
}

// Expose as global
window.KNNClassifierSimple = KNNClassifierSimple;
