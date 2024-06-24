import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { DataChannel } from "./DataChannel";
import { RTCConfig } from "./RTCConfig";
import { Observable } from "@amodx/core/Observers";

export abstract class RTCBase {
  _stable = false;
  get isStable(){
    return this._stable;
  }
  connection: RTCPeerConnection;

  baseObservers = {
    closed: new Observable<void>(),
    stable: new Observable<void>(),
    dataChannel: new Observable<DataChannel>(),
    onICECandidate: new Observable<RTCPeerConnectionIceEvent>(),
    onICEError: new Observable<RTCPeerConnectionIceErrorEvent>(),
    onICEGatheringStart: new Observable<void>(),
    onICEGatheringCompleted: new Observable<void>(),
    negationNeeded: new Observable<void>(),
  };
  constructor(public config = new RTCConfig()) {
    this.connection = new RTCPeerConnection(this.config.getConfig());
    this.connection.onsignalingstatechange = (event) => {
      switch (this.connection.signalingState) {
        case "closed":
          this.baseObservers.closed.notify();
          break;
        case "stable":
          this._stable = true;
          this.baseObservers.stable.notify();
          break;
      }
    };
    this.connection.ondatachannel = (event) => {
      this.baseObservers.dataChannel.notify(new DataChannel(event.channel));
    };
    this.connection.onicecandidate = (event) => {
      this.baseObservers.onICECandidate.notify(event);
    };
    this.connection.onicegatheringstatechange = (event) => {
      switch (this.connection.iceGatheringState) {
        case "complete":
          this.baseObservers.onICEGatheringStart.notify();
          break;
        case "gathering":
          this.baseObservers.onICEGatheringCompleted.notify();
          break;
      }
    };
    this.connection.onicecandidateerror = (evnet) => {
      this.baseObservers.onICEError.notify(
        evnet as RTCPeerConnectionIceErrorEvent
      );
    };
    this.connection.onnegotiationneeded = (evnet) => {
      this.baseObservers.negationNeeded.notify();
    };
    this.connection.ontrack;
  }

  waitTillStable() {
    return new Promise((resolve) => {
      const inte = new SafeInterval().setInterval(100).setOnRun(() => {
        if (this._stable) {
          resolve(true);
          inte.stop();
          return;
        }
      });
      inte.start();
    });
  }
  close() {
    this.connection.close();
  }
}
