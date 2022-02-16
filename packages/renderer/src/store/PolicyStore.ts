import { makeObservable, observable, action, computed } from "mobx";
import type RootStore from "./RootStore";
import type {
  ProgressData,
  PolicyProgressData,
  PolicyResult,
} from "/shared/types";

export const policies = [
  { value: "area", name: "Area" },
  { value: "value", name: "Value" },
  { value: "species", name: "Species" },
  { value: "speciesStatic", name: "Species (static)" },
  { value: "random", name: "Random" },
] as const;

export type PolicyValue = typeof policies[number]["value"];
/**
 * Output
simulation	reward	protected_cells	budget_left	time_last_protect	avg_cost	extant_sp	extant_sp_value	extant_sp_pd	species_loss	value_loss	pd_loss
0	0.0	0	8.8	0	0	0.2	0.25023144867723884	0.39962853069605697	4.0	74.97685513227611	60.0371469303943
*/

export default class PolicyStore {
  constructor(private root: RootStore) {
    makeObservable(this, {
      isRunning: observable,
      isFinished: observable,
      budget: observable,
      policy: observable,
      policyParams: computed,
      results: observable.ref,
      resultsRandom: observable.ref,
    });
  }

  handleMessage = action((service: string, data: ProgressData) => {
    if (
      service !== "progress" ||
      (data.type !== "policy" && data.type !== "random-policy")
    )
      return;

    this.handlePolicyProgress(data);
  });

  handlePolicyProgress = action((data: ProgressData) => {
    console.log("Policy progress:", data);
    if (data.status === "finished") {
      this.isRunning = false;
      this.isFinished = true;
      console.log(
        "results:",
        this.results,
        "resultsRandom:",
        this.resultsRandom
      );
      return;
    }

    if (data.status === "progress") {
      const d = data as PolicyProgressData;
      if (data.type === "random-policy") {
        this.resultsRandom = [...this.results, d.data];
      } else {
        this.results = [...this.results, d.data];
      }
    }
  });

  isRunning = false;
  setIsRunning = action((value: boolean) => {
    this.isRunning = value;
  });

  isFinished = false;
  setIsFinished = action((value: boolean) => {
    this.isFinished = value;
  });

  results: PolicyResult[] = [];
  resultsRandom: PolicyResult[] = [];

  outFile = "./static/policy.log";
  outFileRandom = "./static/policy_random.log";

  budget = 0.11;
  setBudget = action((value: number) => {
    this.budget = value;
  });

  policy: PolicyValue = policies[0].value;
  setPolicy = action((value: PolicyValue) => {
    this.policy = value;
  });

  get policyParams() {
    return {
      rnd_seed: 123,
      simulations: 3,
      steps: 20,
      n_nodes: [4, 0],
      budget: this.budget,
      obsMode: 5, // for area
      rewardMode: 2,
      observePolicy: 1,
      trainedModel: "./trained_models/area_d4_n4-0.log",
      simDataDir: "./static/sim_data/pickles",
      outFile: this.outFile,
      outFileRandom: this.outFileRandom,
    };
  }

  run = action(() => {
    this.isRunning = true;
    this.root.send({
      type: "policy",
      data: this.policyParams,
    });
  });
}
