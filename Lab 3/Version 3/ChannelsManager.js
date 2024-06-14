import Channel from './Channel.js';

class ChannelsManager {
    constructor() {
        this.channels = [];
    }

    addChannel() {
        const newChannel = new Channel();
        this.channels.push(newChannel);
        return newChannel;
    }

    removeChannel(index) {
        this.channels.splice(index, 1);
    }

    getChannel(index) {
        return this.channels[index];
    }

    playAll() {
        this.channels.forEach(channel => channel.play());
    }

    clearAll() {
        this.channels.forEach(channel => channel.clear());
    }
}

export default ChannelsManager;
