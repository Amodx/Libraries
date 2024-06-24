import { DataChannel } from "./DataChannel";
import { RTCBase } from "./RTCBase";
import { RTCConfig } from "./RTCConfig";

export class RTCHost extends RTCBase {
  dataChannel: DataChannel;

  constructor(public id: string = crypto.randomUUID(), config?: RTCConfig) {
    super(config);
  }

  async openConnection(
    onICE: (candinate: RTCIceCandidate) => void,
    options?: RTCDataChannelInit
  ) {
    this.dataChannel = new DataChannel(
      this.connection.createDataChannel("main", options)
    );
    this.baseObservers.onICECandidate.subscribe(this, (event) => {
      if (!event.candidate) return;
      onICE(event.candidate);
    });

    const offer = await this.connection.createOffer();
    await this.connection.setLocalDescription(new RTCSessionDescription(offer));

    return offer;
  }

  async setRemoteConnection(answer: any) {
    await this.connection.setRemoteDescription(answer);
  }
}
