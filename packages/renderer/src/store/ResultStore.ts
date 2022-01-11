import { makeObservable, observable, action } from "mobx";
import type { Message } from "./RootStore";
import type RootStore from "./RootStore";
import type { SimulationParams } from "./SimulationStore";
import { range } from "../utils";

const FIG_TITLES = [
  "Species richness",
  "Mean population density",
  "Total population size",
  "Phylogenetic diversity",
  "Disturbance",
  "Selective disturbance",
  "Mean annual temperature",
  "Economic loss",
  "Cost of protecting",
  "Variables through time",
];

function getFigTitle(index: number) {
  if (index < FIG_TITLES.length) {
    return FIG_TITLES[index];
  }
  return `Sp. ${index - FIG_TITLES.length}`;
}

type Figure = {
  title: string;
  url: string;
};

type Step = {
  step: number;
  figures: Figure[];
};

export default class ResultStore {
  private root: RootStore;

  params: SimulationParams;

  finished = false;
  currentStep = 0;
  figures: Step[] = [];

  constructor(root: RootStore, params: SimulationParams) {
    this.root = root;
    this.params = params;
    this.initFigures();

    makeObservable(this, {
      finished: observable,
      currentStep: observable,
      figures: observable, //.array,
    });
  }

  get numFigures() {
    return FIG_TITLES.length + this.params.numSpecies;
  }

  initFigures() {
    console.log(
      `Init ${this.numFigures} figures per step for ${this.params.numSteps} steps...`
    );
    const initFiguresInStep = () =>
      [...range(this.numFigures)].map((i) => ({
        title: getFigTitle(i),
        url: "",
      }));

    for (const i of range(this.params.numSteps)) {
      this.figures.push({
        step: i,
        figures: initFiguresInStep(),
      });
    }
  }

  handleMessage = action((message: Message) => {
    if (message.type === "plot:progress") {
      this.currentStep = message.data.count;
    } else if (message.type === "plot:finished") {
      this.finished = true;
    }
  });
}
