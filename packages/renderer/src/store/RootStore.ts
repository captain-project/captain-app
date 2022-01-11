import { makeObservable, observable, action } from "mobx";
import SimulationStore from "./SimulationStore";
import ResultsStore from "./ResultsStore";

export interface Message {
  type: string;
  data: any;
}

export default class RootStore {
  simulation = new SimulationStore(this);
  results = new ResultsStore(this);

  socket: WebSocket | undefined = undefined;
  consoleOutput = "";
  numInitSocketRetries = 0;

  constructor() {
    this.initSocket();

    makeObservable(this, {
      send: action,
      consoleOutput: observable,
    });
  }

  onMessage = action((e: MessageEvent) => {
    const result = JSON.parse(e.data) as Message;
    console.log("Got message", result);
    this.consoleOutput += `\n${e.data.toString()}`;

    this.simulation.handleMessage(result);
    this.results.handleMessage(result);
  });

  private onOpen = () => console.log("Socket open");

  private onError = (e: Event) => console.warn("Got error", e);

  private onClose = (e: CloseEvent) => {
    console.warn(`Closing socket. Reason: '${e.reason}', code: ${e.code}`);
    const maxRetries = 10;

    if (this.numInitSocketRetries < maxRetries) {
      setTimeout(() => {
        ++this.numInitSocketRetries;
        this.initSocket();
      }, 1000);
    }
  };

  private initSocket() {
    if (this.socket && this.socket.readyState <= 1) {
      return;
    }

    try {
      console.log("Creating web socket...");
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

  send(type: string, data: object = {}) {
    console.log(`Send ${type}:`, data);
    this.socket?.send(JSON.stringify({ type, data }));
  }
}
