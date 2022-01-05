import { makeObservable, observable, action } from "mobx";

export default class RootStore {
  socket: WebSocket | undefined = undefined;
  consoleOutput = "";
  testImgUrl = "";

  constructor() {
    this.initSocket();

    makeObservable(this, {
      send: action,
      consoleOutput: observable,
      testImgUrl: observable,
    });
  }

  private onOpen = () => {
    console.log("open");
    this.socket?.send(JSON.stringify({ type: "test", message: "Hello" }));
  };

  onMessage = action((e: MessageEvent) => {
    const result = JSON.parse(e.data);
    console.log("Got message", result);
    this.consoleOutput += `\n${e.data.toString()}`;
    if (result.type === "test-result") {
      console.log("Test result!");
      this.testImgUrl = result.data;
    }
  });

  private onError = (e: Event) => {
    console.warn("Got error", e);
  };

  private onClose = (e: CloseEvent) => {
    console.warn(`Closing socket. Reason: '${e.reason}', code: ${e.code}`);
    setTimeout(() => {
      this.initSocket();
    }, 1000);
  };

  private initSocket() {
    if (this.socket && this.socket.readyState <= 1) {
      return;
    }
    try {
      console.log("Create web socket...");
      const socket = new WebSocket("ws://localhost:8000/ws");

      socket.onmessage = this.onMessage;
      socket.onerror = this.onError;
      socket.onopen = this.onOpen;
      socket.onclose = this.onClose;
      this.socket = socket;
    } catch (err: any) {
      console.error(`Error creating web socket: ${err}`);
    }
  }

  test() {
    this.send("testpy");
  }

  send(type: string, data: object = {}) {
    console.log(`Send ${type}:`, data);
    this.socket?.send(JSON.stringify({ type, data }));
  }
}
