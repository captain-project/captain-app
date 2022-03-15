// Messages are sent from ts client to ts server and python client
export interface Message {
  type: string;
  data?: object | string | number;
}

export type MessageHandler = (m: Message) => void;

export type PolicyResult = {
  simulation: number;
  reward: number;
  protected_cells: number;
  budget_left: number;
  time_last_protect: number;
  avg_cost: number;
  extant_sp: number;
  extant_sp_value: number;
  extant_sp_pd: number;
  species_loss: number;
  value_loss: number;
  pd_loss: number;
};
export interface ProgressData {
  type:
    | "init"
    | "plot"
    | "simulation"
    | "policy"
    | "random-policy"
    | "test"
    | "stdout";
  status: "start" | "progress" | "finished";
  data?: object | string | string[] | number;
}

export interface PolicyProgressData extends ProgressData {
  type: "policy";
  status: "progress";
  data: PolicyResult;
}
export interface SimulationInput {
  init: {
    n_species: number;
    grid_size: number;
    cell_capacity: number;
  };
  run: {
    num_steps: number;
    dispersal_rate: number;
  };
}

export interface SimulationProgressData {
  step: number;
  plot: number;
  filename: string;
  title: string;
  svgUrl?: string;
  thumbnailUrl?: string;
}

export interface OptimizedSimulationProgressData
  extends Required<SimulationProgressData> {
  progressCount?: number;
  progressTotal?: number;
}

export type SimProgressData = Required<OptimizedSimulationProgressData>;
