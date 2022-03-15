import { makeObservable, observable, action, computed } from "mobx";
import type RootStore from "./RootStore";
import type {
  ProgressData,
  PolicyResult,
  PolicyProgressData,
} from "/shared/types";

export const policies = [
  { value: "area", name: "Area" },
  { value: "value", name: "Value" },
  { value: "species", name: "Species" },
  { value: "speciesStatic", name: "Species (static)" },
  { value: "random", name: "Random" },
  { value: "none", name: "None" },
] as const;

export type PolicyValue = typeof policies[number]["value"];

// rewardMode=0,  # "0: species loss; 1: sp value; 2: protected area"; 3: diversity loss (not yet tested)
export const rewardModes = [
  { value: 0, name: "species loss" },
  { value: 1, name: "species value" },
  { value: 2, name: "protected area" },
  // { value: 3, name: "diversity loss" },
] as const;

export type RewardValue = typeof rewardModes[number]["value"];

/**
 * Output
simulation	reward	protected_cells	budget_left	time_last_protect	avg_cost	extant_sp	extant_sp_value	extant_sp_pd	species_loss	value_loss	pd_loss
0	0.0	0	8.8	0	0	0.2	0.25023144867723884	0.39962853069605697	4.0	74.97685513227611	60.0371469303943
*/
export default class SimulationStore {
  // status
  isInitiating = false;
  // isInitiated = false;
  isRunning = false;

  // init params
  initiatedSystems: string[] = [];
  numSpecies = 5;
  gridSize = 20;
  cellCapacity = 25;

  // simulation params
  // file = "";
  numTimeSteps = 3;
  dispersalRate = 0.3;
  budget = 0.11;
  policy: PolicyValue = policies[0].value;
  rewardMode: RewardValue = rewardModes[0].value;

  results: PolicyResult[] = [];

  obsModeOptions: { [key: string]: number[] } = {
    area: [5],
    value: [4],
    species: [1, 2],
    speciesStatic: [1],
    random: [1],
    none: [1],
  };

  speciesObsMode = 1;

  constructor(private root: RootStore) {
    makeObservable(this, {
      isInitiating: observable,
      isInitiated: computed,
      isRunning: observable,
      initiatedSystems: observable,
      numSpecies: observable,
      gridSize: observable,
      cellCapacity: observable,
      numTimeSteps: observable,
      dispersalRate: observable,
      budget: observable,
      policy: observable,
      results: observable.ref,
      obsMode: computed,
      observePolicy: computed,
      policyParams: computed,
    });
  }

  get obsMode() {
    const options = this.obsModeOptions[this.policy];
    if (options.length === 1) {
      return options[0];
    }
    return this.speciesObsMode;
  }

  get observePolicy() {
    if (this.policy === "speciesStatic") {
      return 2;
    }
    return 1;
  }

  get policyParams() {
    return {
      policy: this.policy,
      budget: this.budget,
      dispersal_rate: this.dispersalRate,
      rnd_seed: 123,
      time_steps: this.numTimeSteps,
      n_nodes: [4, 0],
      obsMode: this.obsMode,
      rewardMode: 2, // TODO
      observePolicy: this.observePolicy,
      trainedModel: "./trained_models/area_d4_n4-0.log",
      // simDataDir: "./static/sim_data/pickles",
      outFile: "./static/policy.log",
    };
  }
  /**
   * sim_data/pickles/
   * init_cell_2560_c20_s5_d0.3_t0.25.pkl
   * init_cell_4582_c20_s5_d0.3_t0.25.pkl
   * init_cell_9036_c20_s5_d0.3_t0.25.pkl
   *
   * cell_file_pkl = "pickles/init_cell_%s_c%s_s%s%s.pkl" % (
        rseed,
        grid_size,
        n_species,
        out_tag,
    )
    out_tag += "_d%s_t%s" % (disp_rate, death_at_climate_boundary)
   */

  handleMessage = action((service: string, data: ProgressData) => {
    if (service !== "progress") return;

    if (data.type === "init" && data.status === "finished") {
      // const sim_file = data.data;
      console.log("Init finished:", data);
      this.initiatedSystems = data.data as string[];
    }

    if (data.type === "policy" && data.status === "progress") {
      const d = data as PolicyProgressData;
      this.results = [...this.results, d.data];
    }

    if (data.status === "finished") this.isRunning = false;
  });

  get isInitiated() {
    // f"sp{n_species}_gs{grid_size}_cc{cell_capacity}"
    const folderName = `sp${this.numSpecies}_gs${this.gridSize}_cc${this.cellCapacity}`;
    return this.initiatedSystems.includes(folderName);
  }

  setIsRunning = action((value: boolean) => {
    this.isRunning = value;
  });

  init = action(() => {
    const {
      numSpecies: n_species,
      gridSize: grid_size,
      cellCapacity: cell_capacity,
    } = this;

    this.root.send({
      type: "init",
      data: { n_species, grid_size, cell_capacity },
    });
    this.isInitiating = true;
  });

  run = action(() => {
    const {
      numSpecies: n_species,
      gridSize: grid_size,
      cellCapacity: cell_capacity,
    } = this;

    this.root.send({
      type: "simulation",
      data: {
        init: {
          n_species,
          grid_size,
          cell_capacity,
        },
        run: this.policyParams,
      },
    });

    this.isRunning = true;
  });

  setNumSpecies = action((value: number) => (this.numSpecies = value));

  setGridSize = action((value: number) => (this.gridSize = value));

  setCellCapacity = action((value: number) => (this.cellCapacity = value));

  setNumSteps = action((value: number) => (this.numTimeSteps = value));

  setDispersalRate = action((value: number) => (this.dispersalRate = value));

  setBudget = action((value: number) => {
    this.budget = value;
  });

  setPolicy = action((value: PolicyValue) => {
    this.policy = value;
  });
}
