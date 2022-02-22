import type {
  Id,
  NullableId,
  Params,
  ServiceMethods,
} from "@feathersjs/feathers";
import type { Application } from "../../declarations";
import type { ProgressData, SimulationProgressData } from "/shared/types";
import { optimizePlotData } from "../../../optimizePlot";
import { getNumFiguresTotal } from "../../../utils/figures";

interface Data extends ProgressData {}

interface ServiceOptions {}

interface SimulationState {
  init: {
    n_species: number;
    grid_size: number;
    cell_capacity: number;
  };
  run: {
    time_steps: number;
    dispersal_rate: number;
  };
  totalNumFigures: number;
  currentNumFigures: number;
}

export class Progress implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  state: Map<number, SimulationState> = new Map();

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async setup(app: Application, path: string): Promise<void> {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async find(params?: Params): Promise<Data[]> {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: Params): Promise<Data> {
    return {
      type: "test",
      status: "progress",
      data: { id },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    // Optimize svg and add thumbnails
    console.log(`progress:create '${data.type}:${data.status}'`);

    if (data.type !== "plot") {
      return data;
    }

    if (data.status === "start") {
      const simData = data.data as Pick<SimulationState, "init" | "run">;
      const {
        init: { n_species: numSpecies },
        run: { time_steps: numTimeSteps },
      } = simData;
      const totalNumFigures = getNumFiguresTotal({ numSpecies, numTimeSteps });
      this.state.set(0, {
        ...simData,
        totalNumFigures,
        currentNumFigures: 0,
      });
      console.log(
        `Init progress service: numSpecies: ${numSpecies}, numTimeSteps: ${numTimeSteps}, totalNumFigures: ${totalNumFigures}`
      );
    }

    if (data.status === "progress") {
      console.log("Plot progress data:", data.data);
      const _data = (data.data = await optimizePlotData(
        data.data as SimulationProgressData
      ));
      const state = this.state.get(0);
      if (state) {
        ++state.currentNumFigures;
        console.log(
          `Figure ${state.currentNumFigures} / ${state.totalNumFigures}`
        );
        _data.progressCount = state.currentNumFigures;
        _data.progressTotal = state.totalNumFigures;
      }
    }

    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    return {
      type: "test",
      status: "progress",
      data: { id },
    };
  }
}
