// Messages are sent from ts client to ts server and python client
export interface Message {
  type: string;
  data?: object | string | number;
}

export type MessageHandler = (m: Message) => void;

export interface Progress {
  type: string;
  data?: object | string | number;
}

export interface SimulationProgressData {
  step: number;
  plot: number;
  filename: string;
  title: string;
  svgUrl?: string;
  thumbnailUrl?: string;
}

export type OptimizedSimulationProgressData = Required<SimulationProgressData>;
