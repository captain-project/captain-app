import { makeObservable, observable, action } from "mobx";
import type RootStore from "./RootStore";
import type { Message } from "./RootStore";

export interface SimulationParams {
  numSpecies: number;
  gridSize: number;
  cellCapacity: number;
  numSteps: number;
  dispersalRate: number;
}

export default class SimulationStore implements SimulationParams {
  private root: RootStore;

  initiating = false;
  initiated = false;
  running = false;

  // init params
  numSpecies = 5;
  gridSize = 40;
  cellCapacity = 25;

  // simulation params
  file = "";
  numSteps = 1;
  dispersalRate = 0.3;

  constructor(root: RootStore) {
    this.root = root;

    makeObservable(this, {
      initiated: observable,
      initiating: observable,
      running: observable,
      numSpecies: observable,
      gridSize: observable,
      cellCapacity: observable,
      numSteps: observable,
      dispersalRate: observable,
    });
  }

  get params(): SimulationParams {
    const { numSpecies, gridSize, cellCapacity, numSteps, dispersalRate } =
      this;
    return { numSpecies, gridSize, cellCapacity, numSteps, dispersalRate };
  }

  handleMessage = action((message: Message) => {
    if (message.type === "sim:init") {
      this.initiating = false;
      this.initiated = true;
      this.file = message.data;
    } else if (message.type === "sim:run") {
      this.running = false;
    }
  });

  init = action(() => {
    const {
      numSpecies: n_species,
      gridSize: grid_size,
      cellCapacity: cell_capacity,
    } = this;

    this.root.send("sim:init", { n_species, grid_size, cell_capacity });
    this.initiating = true;
  });

  run = action(() => {
    const {
      file: sim_file,
      numSteps: num_steps,
      dispersalRate: dispersal_rate,
    } = this;

    this.root.results.create();
    this.root.send("sim:run", { sim_file, num_steps, dispersal_rate });
    this.running = true;
  });

  setNumSpecies = action((value: number) => (this.numSpecies = value));

  setGridSize = action((value: number) => (this.gridSize = value));

  setCellCapacity = action((value: number) => (this.cellCapacity = value));

  setNumSteps = action((value: number) => (this.numSteps = value));

  setDispersalRate = action((value: number) => (this.dispersalRate = value));
}
