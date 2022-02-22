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

/**
 * Output
simulation	reward	protected_cells	budget_left	time_last_protect	avg_cost	extant_sp	extant_sp_value	extant_sp_pd	species_loss	value_loss	pd_loss
0	0.0	0	8.8	0	0	0.2	0.25023144867723884	0.39962853069605697	4.0	74.97685513227611	60.0371469303943
*/
export type PolicyValue = typeof policies[number]["value"];
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
  numTimeSteps = 3;
  dispersalRate = 0.3;
  budget = 0.11;
  policy: PolicyValue = policies[0].value;

  results: PolicyResult[] = [];

  constructor(private root: RootStore) {
    makeObservable(this, {
      // initiated: observable,
      // initiating: observable,
      isRunning: observable,
      numSpecies: observable,
      gridSize: observable,
      cellCapacity: observable,
      numTimeSteps: observable,
      dispersalRate: observable,
      budget: observable,
      policy: observable,
      results: observable.ref,
      policyParams: computed,
    });
  }

  get policyParams() {
    return {
      policy: this.policy,
      budget: this.budget,
      dispersal_rate: this.dispersalRate,
      rnd_seed: 123,
      time_steps: this.numTimeSteps,
      n_nodes: [4, 0],
      obsMode: 5, // for area
      rewardMode: 2,
      observePolicy: 1,
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

    if (data.type === "policy" && data.status === "progress") {
      const d = data as PolicyProgressData;
      this.results = [...this.results, d.data];
    }

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
      numTimeSteps: num_steps,
      dispersalRate: dispersal_rate,
      budget,
      policy,
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
