import Sound from './Sound.js';
import ChannelsManager from './ChannelsManager.js';
import Recorder from './Recorder.js';

class UIManager {
    constructor() {
        this.channelsManager = new ChannelsManager();
        this.recorder = new Recorder();
        this.metronomeInterval = null;
        this.keyToSoundMap = {
            'a': 'boom',
            's': 'clap',
            'd': 'hihat',
            'f': 'kick',
            'g': 'openhat',
            'h': 'ride',
            'j': 'snare',
            'k': 'tink',
            'l': 'tom'
        };
        this.setupUI();
        this.setupEventListeners();
    }

    setupUI() {
        this.channelSelect = document.getElementById('channel-select');
        this.channelList = document.getElementById('channel-list');
        this.addChannelButton = document.getElementById('add-channel');
        this.playAllButton = document.getElementById('play-all');
        this.removeChannelButton = document.getElementById('remove-channel');
        this.recordButton = document.getElementById('record');
        this.stopButton = document.getElementById('stop');
        this.metronomeButton = document.getElementById('toggle-metronome');
        this.bpmInput = document.getElementById('bpm');
        this.instrumentButtons = document.querySelectorAll('#instrument-buttons button');
    }

    setupEventListeners() {
        this.addChannelButton.addEventListener('click', () => this.addChannel());
        this.playAllButton.addEventListener('click', () => this.playAllChannels());
        this.removeChannelButton.addEventListener('click', () => this.removeChannel());
        this.recordButton.addEventListener('click', () => this.startRecording());
        this.stopButton.addEventListener('click', () => this.stopRecording());
        this.metronomeButton.addEventListener('click', () => this.toggleMetronome());
        this.instrumentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sound = new Sound(button.getAttribute('data-sound'));
                sound.play();
                this.recorder.record(sound);
                this.updateChannelList();
            });
        });

        document.addEventListener('keydown', (event) => {
            const soundName = this.keyToSoundMap[event.key.toLowerCase()];
            if (soundName) {
                const sound = new Sound(soundName);
                sound.play();
                this.recorder.record(sound);
                this.updateChannelList();
            }
        });
    }

    addChannel() {
        const newChannel = this.channelsManager.addChannel();
        this.updateChannelSelect();
        this.updateChannelList();
    }

    removeChannel() {
        const selectedIndex = this.channelSelect.selectedIndex;
        if (selectedIndex >= 0) {
            this.channelsManager.removeChannel(selectedIndex);
            this.updateChannelSelect();
            this.updateChannelList();
        }
    }

    startRecording() {
        const selectedIndex = this.channelSelect.selectedIndex;
        if (selectedIndex >= 0) {
            const selectedChannel = this.channelsManager.getChannel(selectedIndex);
            this.recorder.start(selectedChannel);
            this.updateChannelList();
        }
    }

    stopRecording() {
        this.recorder.stop();
        this.updateChannelList();
    }

    deleteCurrentChannel() {
        const selectedIndex = this.channelSelect.selectedIndex;
        if (selectedIndex >= 0) {
            const selectedChannel = this.channelsManager.getChannel(selectedIndex);
            selectedChannel.clear();
            this.updateChannelList();
        }
    }

    toggleMetronome() {
        if (this.metronomeInterval) {
            clearInterval(this.metronomeInterval);
            this.metronomeInterval = null;
            this.metronomeButton.textContent = 'OFF Metronome';
        } else {
            const bpm = parseInt(this.bpmInput.value, 10);
            const interval = 60000 / bpm;
            this.metronomeInterval = setInterval(() => {
                const sound = new Sound('kick');
                sound.play();
            }, interval);
            this.metronomeButton.textContent = 'ON Metronome';
        }
    }

    updateChannelList() {
        this.channelList.innerHTML = '';
        this.channelsManager.channels.forEach((channel, index) => {
            const div = document.createElement('div');
            const status = this.recorder.isRecording && this.recorder.currentChannel === channel 
                           ? 'recording' 
                           : channel.getStatus();
            div.className = 'channel';
            div.innerHTML = `
                <button onclick="uiManager.playChannel(${index})">Play</button>
                <button onclick="uiManager.deleteChannel(${index})">Delete</button>
                Channel ${index + 1} status: ${status}
            `;
            this.channelList.appendChild(div);
        });
    }

    updateChannelSelect() {
        this.channelSelect.innerHTML = '';
        this.channelsManager.channels.forEach((channel, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.text = `Channel ${index + 1}`;
            this.channelSelect.appendChild(option);
        });
    }

    playChannel(index) {
        const channel = this.channelsManager.getChannel(index);
        if (channel) {
            channel.play();
            this.updateChannelList();
            setTimeout(() => this.updateChannelList(), channel.getDuration());
        }
    }

    playAllChannels() {
        this.channelsManager.playAll();
        this.updateChannelList();
        const maxDuration = Math.max(...this.channelsManager.channels.map(channel => channel.getDuration()));
        setTimeout(() => this.updateChannelList(), maxDuration);
    }

    deleteChannel(index) {
        this.channelsManager.removeChannel(index);
        this.updateChannelSelect();
        this.updateChannelList();
    }
}

const uiManager = new UIManager();
window.uiManager = uiManager;

export default UIManager;
