import { APIManager } from "./API/APIManager.js";
import { AudioChannelManager } from "./Channels/AudioChannelManager.js";
import { ConstantsManager } from "./Constants/ConstantsManager.js";
import { EffectsManager } from "./Effects/EffectsManager.js";
import { MusicManager } from "./Music/MusicManager.js";
import { SFXMAnager } from "./SFX/SFXManager.js";
import { SoundSpaceManager } from "./SoundSpace/SoundSpaceManager.js";

export class Audio {
  static api = APIManager;
  static music = MusicManager;
  static sfx = SFXMAnager;
  static space = SoundSpaceManager;
  static effects = EffectsManager;
  static constants = ConstantsManager;
  static channels = AudioChannelManager;
  static _initalized = false;

  static async init() {
    Audio.api.init();
    this._initalized = true;
  }

  static async create() {
    await Audio.sfx.createSFXNodes();
  }
}
