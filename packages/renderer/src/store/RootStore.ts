import { makeObservable, observable, action, computed } from "mobx";
import ResultStore from "./ResultStore";
import Socket from "./Socket";
import type { Message, MessageHandler } from "./Socket";

export default class RootStore {
  tabIndex = 0;
  socket: Socket;
  results: ResultStore[] = [new ResultStore(this, "Result 1")];
  send: MessageHandler;

  constructor() {
    this.socket = new Socket(
      (message: Message) => this.activeResult?.handleMessage(message) // todo
    );

    this.send = this.socket.send;

    makeObservable(this, {
      tabIndex: observable,
      results: observable,
      activeResult: computed,
    });
  }

  setTabIndex = action((value: number) => (this.tabIndex = value));

  create = action((name?: string) => {
    if (!name) {
      name = "Result " + (this.results.length + 1);
    }
    this.tabIndex = this.results.push(new ResultStore(this, name)) - 1;
  });

  remove = action((index: number) => {
    this.results.splice(index, 1);

    if (this.results.length === 0) {
      this.create();
    }
  });

  get activeResult(): ResultStore {
    return this.results[this.tabIndex];
  }
}
