import { makeObservable, observable, action } from "mobx";
import type RootStore from "./RootStore";
import type { ProgressData } from "/shared/types";

export default class SimulationStore {
  // initiating = false;
  // initiated = false;
  isRunning = false;

  // init params
  numSpecies = 5;
  gridSize = 20;
  cellCapacity = 25;

  // simulation params
  // file = "";
  numSteps = 3;
  dispersalRate = 0.3;

  constructor(private root: RootStore) {
    makeObservable(this, {
      // initiated: observable,
      // initiating: observable,
      isRunning: observable,
      numSpecies: observable,
      gridSize: observable,
      cellCapacity: observable,
      numSteps: observable,
      dispersalRate: observable,
    });
  }

  handleMessage = action((service: string, data: ProgressData) => {
    if (service !== "progress" || data.type !== "simulation") return;

    if (data.status === "finished") this.isRunning = false;
  });

  setIsRunning = action((value: boolean) => {
    this.isRunning = value;
  });

  // init = action(() => {
  //   const {
  //     numSpecies: n_species,
  //     gridSize: grid_size,
  //     cellCapacity: cell_capacity,
  //   } = this;

  //   this.root.send({
  //     type: "sim:init",
  //     data: { n_species, grid_size, cell_capacity },
  //   });
  //   this.initiating = true;
  // });

  run = action(() => {
    const {
      numSpecies: n_species,
      gridSize: grid_size,
      cellCapacity: cell_capacity,
      // file: sim_file,
      numSteps: num_steps,
      dispersalRate: dispersal_rate,
    } = this;

    this.root.send({
      type: "simulation",
      data: {
        init: {
          n_species,
          grid_size,
          cell_capacity,
        },
        run: {
          // sim_file,
          num_steps,
          dispersal_rate,
        },
      },
    });
    this.isRunning = true;
  });

  setNumSpecies = action((value: number) => (this.numSpecies = value));

  setGridSize = action((value: number) => (this.gridSize = value));

  setCellCapacity = action((value: number) => (this.cellCapacity = value));

  setNumSteps = action((value: number) => (this.numSteps = value));

  setDispersalRate = action((value: number) => (this.dispersalRate = value));
}
