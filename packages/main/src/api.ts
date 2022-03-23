import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { app } from "electron";
import { join } from "path";
import feathersApp from "./server";
import logger from "./server/logger";
import type { Message } from "/shared/types";

console.log(".......................................");
const pythonPath = join(app.getAppPath(), "python");
console.log(`API created! Python path: '${pythonPath}'`);

process.on("unhandledRejection", (reason, p) => {
  logger.error("Unhandled Rejection at: Promise ", p, reason);
});

const port = 3030;
feathersApp.set("port", port);
feathersApp.listen(port).then((server) => {
  server.on("listening", () => {
    logger.info(
      "Feathers application started on http://%s:%d",
      feathersApp.get("host"),
      port
    );
  });
});

feathersApp.service("messages").on("created", async (message: Message) => {
  console.log("Api got message:", message);
});

export class PythonClient {
  proc: ChildProcessWithoutNullStreams;

  constructor() {
    this.proc = spawn("python", ["client.py"], {
      cwd: pythonPath,
    });

    this.proc.stdout.on("data", (data) => {
      // console.log(`python stdout: ${data.toString()}`);
      feathersApp
        .service("progress")
        .create({ type: "stdout", status: "progress", data: data.toString() });
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
