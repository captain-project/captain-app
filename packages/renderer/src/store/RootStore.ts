import { makeObservable, observable, action, computed } from "mobx";
import ResultStore from "./ResultStore";
import type { Message, MessageHandler } from "./Socket";
import app from "./client";

export default class RootStore {
  tabIndex = 0;
  results: ResultStore[] = [new ResultStore(this, "Result 1")];
  send: MessageHandler;

  constructor() {
    this.send = (data: Message) => {
      app.service("messages").create(data);
    };

    makeObservable(this, {
      tabIndex: observable,
      results: observable,
      activeResult: computed,
    });

    app.service("progress").on("created", (progress: any) => {
      console.log("Progress:", progress);
      this.activeResult?.handleMessage(progress);
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
