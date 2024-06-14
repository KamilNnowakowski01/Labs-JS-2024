import { EnumSrcSounds } from './EnumSounds.js';

class Sound {
    constructor(name) {
        this.name = name;
        this.audio = new Audio(EnumSrcSounds[name]);
    }

    play() {
        this.audio.currentTime = 0;
        this.audio.play();
    }
}

export default Sound;
