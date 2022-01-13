import { makeObservable, observable, action } from "mobx";
import type RootStore from "./RootStore";
import type { Message } from "./Socket";
import SimulationStore from "./SimulationStore";
import { range } from "../utils";

type Figure = {
  title: string;
  url: string;
};

type Step = {
  step: number;
  figures: Figure[];
};

export default class ResultStore {
  finished = false;
  currentStep = 0;
  currentFigureCount = 0;
  figures: Step[] = [];
  simulation: SimulationStore;
  consoleOutput = "";

  constructor(private root: RootStore, public name: string) {
    this.simulation = new SimulationStore(root);
    this.initFigures();

    makeObservable(this, {
      finished: observable,
      currentStep: observable,
      currentFigureCount: observable,
      consoleOutput: observable,
      figures: observable, //.array,
    });
  }

  get numFigures() {
    return FIG_TITLES.length + this.simulation.numSpecies;
  }

  get numSteps() {
    return this.simulation.numSteps;
  }

  initFigures() {
    console.log(
      `Init ${this.numFigures} figures per step for ${this.numSteps} steps...`
    );
    const initFiguresInStep = () =>
      [...range(this.numFigures)].map((i) => ({
        title: getFigTitle(i),
        url: "",
      }));

    for (const i of range(this.numSteps)) {
      this.figures.push({
        step: i,
        figures: initFiguresInStep(),
      });
    }
  }

  handleMessage = action((message: Message) => {
    console.log("Result progress:", message);
    this.consoleOutput += JSON.stringify(message) + "\n";

    if (message.type === "plot:progress") {
      this.currentStep = message.data.step;
      this.currentFigureCount = message.data.count;
    } else if (message.type === "plot:finished") {
      this.finished = true;
    } else if (message.type.startsWith("sim")) {
      this.simulation.handleMessage(message);
    }
  });
}

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
