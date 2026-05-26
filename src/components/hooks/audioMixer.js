// utils/audioMixer.js
export class AudioMixer {
    constructor() {
        this.audioContext = null;
        this.destination = null;
        this.sources = new Map();
        this.mixedStream = null;
    }

    async initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.destination = this.audioContext.createMediaStreamDestination();
            this.mixedStream = this.destination.stream;
            return true;
        } catch (err) {
            console.error("Failed to initialize audio context:", err);
            return false;
        }
    }

    addSource(id, stream) {
        if (!this.audioContext || !stream) return false;

        try {
            // Get audio tracks from the stream
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length === 0) return false;

            // Create media stream source
            const source = this.audioContext.createMediaStreamSource(new MediaStream(audioTracks));
            source.connect(this.destination);

            this.sources.set(id, source);
            return true;
        } catch (err) {
            console.error("Failed to add audio source:", err);
            return false;
        }
    }

    removeSource(id) {
        const source = this.sources.get(id);
        if (source) {
            source.disconnect();
            this.sources.delete(id);
        }
    }

    getMixedStream(videoStream) {
        if (!this.mixedStream) return null;

        // Create final stream with mixed audio and video
        const mixedAudioTracks = this.mixedStream.getAudioTracks();
        const videoTracks = videoStream ? videoStream.getVideoTracks() : [];

        return new MediaStream([...mixedAudioTracks, ...videoTracks]);
    }

    stop() {
        this.sources.forEach((source) => source.disconnect());
        this.sources.clear();

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }

        this.destination = null;
        this.mixedStream = null;
    }
}
