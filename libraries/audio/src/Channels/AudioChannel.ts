import type { AudioChannelData } from "../Meta/AudioChannelsTypes";
import { Audio } from "../Audio.js";
import { APIManager } from "../API/APIManager";

export class AudioChannel {
  static getNodeLevel(defaultLevel: number, channelLevel: number) {
    let level = defaultLevel * Audio.channels.masterLevel * channelLevel;
    return level;
  }
  _nodes = new Map<GainNode, number>();

  _level: number;
  get level() {
    return this._level;
  }
  set level(level: number) {
    this._level = level;
    this._update();
  }
  constructor(public data: AudioChannelData) {
    this._level = data.defaultLevel;
  }

  _update() {
    for (const [gain, defaultLevel] of this._nodes) {
      gain.gain.value = AudioChannel.getNodeLevel(defaultLevel, this.level);
    }
  }

  add(gain: GainNode, defaultLevel: number) {
    this._nodes.set(gain, defaultLevel);
    gain.addEventListener("disconnect", () => {
      this._nodes.delete(gain);
    });

    const time = APIManager.context.currentTime;
    gain.gain.exponentialRampToValueAtTime(
      AudioChannel.getNodeLevel(defaultLevel, this.level),
      time + 0.1
    );
    Audio.api.connectToMain(gain);
  }
}
