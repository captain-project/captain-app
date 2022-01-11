import { makeObservable, observable, action, computed } from "mobx";
import type RootStore from "./RootStore";
import type { Message } from "./RootStore";
import ResultStore from "./ResultStore";

export default class ResultsStore {
  root: RootStore;

  results: ResultStore[] = [];
  activeIndex = -1;

  constructor(root: RootStore) {
    this.root = root;

    makeObservable(this, {
      results: observable,
      activeIndex: observable,
      activeResult: computed,
    });
  }

  get activeResult(): ResultStore | undefined {
    return this.activeIndex < 0 ? undefined : this.results[this.activeIndex];
  }

  create = action(() => {
    this.activeIndex =
      this.results.push(
        new ResultStore(this.root, this.root.simulation.params)
      ) - 1;
  });

  remove = action((index: number) => this.results.splice(index, 1));

  handleMessage = action((message: Message) =>
    this.activeResult?.handleMessage(message)
  );
}
