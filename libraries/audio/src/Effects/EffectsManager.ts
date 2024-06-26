import { Audio } from "../Audio.js";
import { BuiltInReverbList, EffectData } from "../Meta/EffectTypes.js";

export const EffectsManager = {
  builtInReverbBuffers: <Record<string, AudioBuffer>>{},
  customReverbBuffers: <Record<string, AudioBuffer>>{},
  async preloadReverbBuffers(
    builtInReverbs: BuiltInReverbList[],
    customReverbs?: string[]
  ) {
    for (const rid of builtInReverbs) {
      const path = Audio.constants.getBuiltInReverbPath(rid);
      const buffer = await Audio.api.loadAudioBuffer(path);
      this.builtInReverbBuffers[rid] = buffer;
    }
    if (customReverbs) {
      for (const rid of customReverbs) {
        const path = Audio.constants.getCustomReverbPath(rid);
        const buffer = await Audio.api.loadAudioBuffer(path);
        this.customReverbBuffers[rid] = buffer;
      }
    }
  },

  _getReverbBuffer(effectsData: EffectData) {
    if (effectsData.reverb) {
      if (!effectsData.reverb.builtIn && !effectsData.reverb.custom) {
        throw new Error(`Must supply a reverb id.`);
      }
      if (effectsData.reverb.builtIn) {
        const buffer = this.builtInReverbBuffers[effectsData.reverb.builtIn];
        if (!buffer) {
          throw new Error(
            `Built-In Reverb: ${effectsData.reverb.builtIn} is not loaded.`
          );
        }
        return buffer;
      }
      if (effectsData.reverb.custom) {
        const buffer = this.customReverbBuffers[effectsData.reverb.custom];
        if (!buffer) {
          throw new Error(
            `Custon Reverb: ${effectsData.reverb.custom} is not loaded.`
          );
        }
        return buffer;
      }
    }
  },

  getEffectsNode(effectsData: EffectData, source: AudioNode, master: GainNode,nodes : AudioNode[]) {
    if (effectsData.reverb) {
      const buffer = this._getReverbBuffer(effectsData);
      if (buffer) {
        const reverb = Audio.api.createConvolver(buffer);
        const reverbGain = Audio.api.createGain();
        source.connect(reverb);
        reverb.connect(reverbGain);
        reverbGain.gain.value = effectsData.reverb.level;
        reverbGain.connect(master);
        nodes.push(reverb,reverbGain);
      }
    }
  },
};
