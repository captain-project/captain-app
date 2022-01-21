import { makeObservable, observable, action, computed } from "mobx";
import type RootStore from "./RootStore";
import type { Message } from "./Socket";
import SimulationStore from "./SimulationStore";
import { range } from "../utils";
import type { OptimizedSimulationProgressData } from "/shared/types";

export type Figure = {
  title: string;
  url: string;
  thumbnailUrl: string;
  step: number;
  plot: number;
  key: string;
  isLoaded: boolean;
};

export type Step = {
  step: number;
  figures: Figure[];
};

export default class ResultStore {
  finished = false;
  currentStep = 0;
  currentPlot = 0;
  figures: Step[] = [];
  simulation: SimulationStore;
  consoleOutput = "";

  constructor(private root: RootStore, public name: string) {
    this.simulation = new SimulationStore(root);
    this.initFigures();

    makeObservable(this, {
      finished: observable,
      currentStep: observable,
      currentPlot: observable,
      consoleOutput: observable,
      figures: observable, //.array,
      progress: computed,
    });
  }

  get progress() {
    const totFigures = this.numSteps * this.numFigures;

    return (
      (100 *
        this.figures.reduce(
          (tot, { figures }) =>
            tot +
            figures.reduce((tot, { isLoaded }) => tot + Number(isLoaded), 0),
          0
        )) /
      totFigures
    );
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

    for (const step of range(this.numSteps)) {
      this.figures.push({
        step,
        figures: [...range(this.numFigures)].map((plot) => ({
          title: getFigTitle(plot),
          url: "",
          thumbnailUrl: "",
          step,
          plot,
          key: `${step}-${plot}`,
          isLoaded: false,
        })),
      });
    }
  }

  handleMessage = action((message: Message) => {
    console.log("Result progress:", message);
    this.consoleOutput += JSON.stringify(message) + "\n";

    // if (message.type === "plot:progress") {
    //   this.handleProgressData(message.data);
    // } else if (message.type === "plot:finished") {
    //   this.finished = true;
    // } else if (message.type.startsWith("sim")) {
    //   this.simulation.handleMessage(message);
    // }
  });

  handleProgressData = action((data: OptimizedSimulationProgressData) => {
    const { step, plot, title, svgUrl, thumbnailUrl } = data;
    this.currentStep = step;
    this.currentPlot = plot;

    try {
      const figure = this.figures[step].figures[plot];
      figure.url = svgUrl;
      figure.thumbnailUrl = thumbnailUrl;
      figure.isLoaded = true;
      figure.title = title;
    } catch (e) {
      console.error("Error handle progress data:", e);
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
