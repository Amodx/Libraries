import { SafeInterval } from "@amodx/core/Intervals/SafeInterval";
import { Observable } from "@amodx/core/Observers";
export class DataChannel<DataType extends any = ArrayBuffer> {
  opened = false;

  observers = {
    opened: new Observable<Event>(),
    closed: new Observable<Event>(),
    closing: new Observable<Event>(),
    error: new Observable<Event>(),
    message: new Observable<MessageEvent<DataType>>(),
    bufferAmoutnLow: new Observable<Event>(),
  };

  constructor(
    public channel: RTCDataChannel,
    binaryType: BinaryType | undefined = "arraybuffer"
  ) {

    if (binaryType) this.channel.binaryType = binaryType;
    this.channel.negotiated;
    this.channel.onmessage = (event) => this.observers.message.notify(event);

    this.channel.onclose = (event) => {
      this.opened = false;
      this.observers.closed.notify(event);
    };

    this.channel.onerror = (error) => this.observers.error.notify(error);

    this.channel.onopen = (event) => {
      this.opened = true;
      this.observers.opened.notify(event);
    };
    this.channel.onbufferedamountlow = (event) => {
      this.observers.bufferAmoutnLow.notify(event);
    };
  }

  sendMessage(data: any) {
    if (!this.opened || this.channel.readyState !== "open")
      return console.warn("Trying to send data to closed data channel");
    this.channel.send(data);
  }

  waitTillOpen() {
    return new Promise((resolve) => {
      const inte = new SafeInterval().setOnRun(() => {
        if (this.opened) {
          inte.stop();

          return resolve(true);
        }
      });
      inte.start();
    });
  }
}
