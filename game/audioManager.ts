
export enum MusicTrack {
    MAIN_MENU = 'MAIN_MENU',
    BATTLE = 'BATTLE',
}

const MUSIC_FILES: Record<MusicTrack, string> = {
    [MusicTrack.MAIN_MENU]: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dde648d1p.mp3',
    [MusicTrack.BATTLE]: 'https://cdn.pixabay.com/audio/2023/10/11/audio_517d65a122.mp3',
};

class AudioManager {
    private currentMusic: HTMLAudioElement | null = null;
    private currentTrack: MusicTrack | null = null;
    private fadeInterval: ReturnType<typeof setInterval> | null = null;
    private targetVolume: number = 0.25; // Keep background music subtle

    private fade(element: HTMLAudioElement, start: number, end: number, duration: number, onComplete?: () => void) {
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
        }

        let currentVolume = start;
        const stepTime = 50; // ms
        const totalSteps = duration / stepTime;
        const step = (end - start) / totalSteps;

        this.fadeInterval = setInterval(() => {
            currentVolume += step;
            
            if ((step > 0 && currentVolume >= end) || (step < 0 && currentVolume <= end)) {
                element.volume = end;
                if (this.fadeInterval) clearInterval(this.fadeInterval);
                this.fadeInterval = null;
                if (onComplete) onComplete();
            } else {
                element.volume = currentVolume;
            }
        }, stepTime);
    }

    playMusic(track: MusicTrack) {
        if (this.currentTrack === track && this.currentMusic && !this.currentMusic.paused) {
            return; // Already playing this track
        }

        if (this.currentMusic && this.currentTrack !== track) {
            const oldMusic = this.currentMusic;
            this.fade(oldMusic, oldMusic.volume, 0, 1000, () => {
                oldMusic.pause();
                oldMusic.currentTime = 0;
            });
        }
        
        this.currentTrack = track;
        const audioSrc = MUSIC_FILES[track];
        
        // Reuse audio element if possible, otherwise create a new one
        if (this.currentMusic?.src !== audioSrc) {
             this.currentMusic = new Audio(audioSrc);
        } else if (!this.currentMusic) {
             this.currentMusic = new Audio(audioSrc);
        }

        this.currentMusic.loop = true;
        this.currentMusic.volume = 0;

        // Play and immediately fade in
        this.currentMusic.play().then(() => {
            if(this.currentMusic) {
                this.fade(this.currentMusic, 0, this.targetVolume, 1500);
            }
        }).catch(e => console.warn("Audio autoplay was blocked. User interaction is required to start music.", e));
    }
}

export const audioManager = new AudioManager();
