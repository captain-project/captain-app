import { makeObservable, observable, action, computed } from "mobx";
import type RootStore from "./RootStore";
import SimulationStore from "./SimulationStore";
import { range } from "../utils";
import type {
  OptimizedSimulationProgressData,
  SimProgressData,
} from "/shared/types";
import { FIG_TITLES, getFigTitle } from "../utils/figures";

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
  currentStep = 0;
  currentPlot = 0;
  progressCount = 0;
  progressTotal = 0;
  figures: Step[] = [];
  simulation: SimulationStore;
  consoleOutput = "";

  constructor(private root: RootStore, public name: string) {
    this.simulation = new SimulationStore(root);
    this.progressTotal = this.numFigures;
    this.initFigures();

    makeObservable(this, {
      currentStep: observable,
      currentPlot: observable,
      progressCount: observable,
      consoleOutput: observable,
      figures: observable, //.array,
      progress: computed,
      finished: computed,
    });
  }

  get progress() {
    return (100 * this.progressCount) / this.progressTotal;
    // const totFigures = this.numSteps * this.numFigures;

    // return (
    //   (100 *
    //     this.figures.reduce(
    //       (tot, { figures }) =>
    //         tot +
    //         figures.reduce((tot, { isLoaded }) => tot + Number(isLoaded), 0),
    //       0
    //     )) /
    //   totFigures
    // );
  }

  get finished() {
    return this.progressCount === this.progressTotal;
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

  handleMessage = action(
    (service: string, data: { type: string; data?: any }) => {
      this.consoleOutput += JSON.stringify(data) + "\n";

      if (service === "progress") {
        if (data.type === "plot:progress") {
          this.handleProgressData(data.data);
        } else if (data.type === "plot:finished") {
          // this.finished = true;
        } else if (data.type.startsWith("sim")) {
          this.simulation.handleMessage(data);
        }
      }
    }
  );

  handleProgressData = action((data: SimProgressData) => {
    const {
      step,
      plot,
      title,
      svgUrl,
      thumbnailUrl,
      progressCount,
      progressTotal,
    } = data;
    this.currentStep = step;
    this.currentPlot = plot;
    this.progressCount = progressCount;
    this.progressTotal = progressTotal;

    try {
      const figure = this.figures[step].figures[plot];
      figure.url = svgUrl;
      figure.thumbnailUrl = thumbnailUrl;
      figure.isLoaded = true;
      figure.title = title;
    } catch (e) {
      console.error("Error handle progress data:", e);
    }

    if (this.finished) {
      this.root.activeResult.simulation.setIsRunning(false);
    }
  });
}
