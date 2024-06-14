class Channel {
  constructor() {
      this.records = [];
      this.isPlaying = false;
      this.playStartTime = null;
  }

  addRecord(record) {
      this.records.push(record);
  }

  play() {
      this.isPlaying = true;
      this.playStartTime = Date.now();
      this.records.forEach(record => {
          setTimeout(() => {
              record.sound.play();
              if (this.isPlaying && Date.now() - this.playStartTime >= this.getDuration()) {
                  this.isPlaying = false;
              }
          }, record.time);
      });
  }

  clear() {
      this.records = [];
  }

  getDuration() {
      if (this.records.length === 0) return 0;
      return this.records[this.records.length - 1].time;
  }

  getStatus() {
      if (this.records.length === 0) {
          return 'empty';
      }
      if (this.isPlaying) {
          return `playing`;
      }
      return `${(this.getDuration() / 1000).toFixed(1)}sek. recorded`;
  }
}

export default Channel;
