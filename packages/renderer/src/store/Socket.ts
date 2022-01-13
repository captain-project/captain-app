export interface Message {
  type: string;
  data: any;
}

export type MessageHandler = (m: Message) => void;

export default class Socket {
  private socket: WebSocket | undefined = undefined;
  private numInitSocketRetries = 0;

  constructor(private handleMessage: MessageHandler) {
    this.initSocket();
  }

  private onMessage = (e: MessageEvent) =>
    this.handleMessage(JSON.parse(e.data) as Message);

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

  send = ({ type, data }: Message) => {
    console.log(`Send ${type}:`, data);
    this.socket?.send(JSON.stringify({ type, data }));
  };
}
