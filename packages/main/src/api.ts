import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { app } from "electron";
import { join } from "path";
import feathersApp from "./server";
import type { Progress, Message, SimulationProgressData } from "/shared/types";
import { optimizePlotData } from "./optimizePlot";

const pythonPath = join(app.getAppPath(), "python");
console.log("API created!");

const fixFilename = (data: SimulationProgressData) => {
  const { filename } = data;
  const name = filename.split("/").pop() as string;
  const filePath = join(pythonPath, "static", name);
  data.filename = filePath;
  return data;
};

feathersApp.service("messages").on("created", async (message: Message) => {
  console.log("Api got message:", message);

  if (message.type === "test:optimizePlotData") {
    const data = {
      step: 3,
      plot: 9,
      filename: "./static/sim_step_3_p9.svg",
    };
    fixFilename(data);
    console.log("Optimize plot data:", data);

    await optimizePlotData(data);
  }
});

feathersApp
  .service("pythonprogress")
  .on("created", async (progress: Progress) => {
    console.log("Api got python progress:", progress);
    if (progress.type === "plot:progress") {
      const data = progress.data as SimulationProgressData;
      fixFilename(data);
      await optimizePlotData(data);
    }
    feathersApp.service("progress").create(progress);
  });

export class PythonClient {
  proc: ChildProcessWithoutNullStreams;

  constructor() {
    this.proc = spawn("python", ["client.py"], {
      cwd: pythonPath,
    });

    this.proc.stdout.on("data", (data) => {
      console.log(`python stdout: ${data.toString()}`);
      // feathersApp
      //   .service("progress")
      //   .create({ type: "python-stdout", data: data.toString() });
    });

    const stderrChunks: any = [];
    this.proc.stderr.on("data", (data) => {
      stderrChunks.push(data);
      console.error(`python error: ${Buffer.concat([data]).toString()}`);
      // feathersApp
      //   .service("progress")
      //   .create({ type: "python-stderr", data: data.toString() });
    });
  }

  kill() {
    console.log("Killing python client...");
    this.proc.kill();
  }
}

const pythonClient = new PythonClient();

export default {
  dispose() {
    pythonClient.kill();
  },
};

console.log("...");
