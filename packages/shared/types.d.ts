// Messages are sent from ts client to ts server and python client
export interface Message {
  type: string;
  data?: object | string | number;
}

export type MessageHandler = (m: Message) => void;

export interface ProgressData {
  type: string;
  data?: object | string | number;
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
