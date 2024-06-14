class Recorder {
  constructor() {
      this.isRecording = false;
      this.startTime = null;
      this.currentChannel = null;
  }

  start(channel) {
      this.isRecording = true;
      this.startTime = Date.now();
      this.currentChannel = channel;
  }

  stop() {
      this.isRecording = false;
      this.startTime = null;
      this.currentChannel = null;
  }

  record(sound) {
      if (this.isRecording && this.currentChannel) {
          const time = Date.now() - this.startTime;
          this.currentChannel.addRecord({ sound, time });
      }
  }

  getStatus() {
      if (this.isRecording && this.currentChannel) {
          return 'recording';
      }
      return '';
  }
}

export default Recorder;
