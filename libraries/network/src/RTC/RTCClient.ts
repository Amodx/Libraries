import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { DataChannel } from "./DataChannel";
import { RTCBase } from "./RTCBase";
import { RTCConfig } from "./RTCConfig";

export class RTCClient extends RTCBase {

  dataChannel: DataChannel;


  constructor(public id:string = crypto.randomUUID(), config?: RTCConfig) {
    super(config);
    this.baseObservers.dataChannel.subscribe(
      this,
      (channel) => (this.dataChannel = channel)
    );
  }

  async openConnection(
    offer: any,
    onICE: (candinate: RTCIceCandidate) => void
  ) {
    this.baseObservers.onICECandidate.subscribe(this, (event) => {
      if (!event.candidate) return;
      onICE(event.candidate);
    });
    await this.connection.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await this.connection.createAnswer();

    await this.connection.setLocalDescription(answer);
    return this.connection.localDescription!;
  }

  waitTillConnected() {
    return new Promise((resolve) => {
      const inte = new SafeInterval().setInterval(60).setOnRun(() => {
        if (this.dataChannel) {
          inte.stop();
          resolve(true);
        }
      });
      inte.start();
    });
  }
}
