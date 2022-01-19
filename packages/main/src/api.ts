import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { app } from "electron";
import { join } from "path";
import feathersApp from "./server";
import type { Progress, Message } from "./server";

console.log("API created!");

feathersApp.service("messages").on("created", (message: Message) => {
  console.log("Api got message:", message);
});

feathersApp.service("pythonprogress").on("created", (progress: Progress) => {
  console.log("Api got python progress:", progress);
  // optimize svg with svgo and create raster thumbnail
  // progress.data.svg = ...
  // progress.data.thumbnail = ...
  feathersApp.service("progress").create(progress);
});

const pythonPath = join(app.getAppPath(), "python");
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
