import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { app } from "electron";
import { join } from "path";
import feathersApp from "./server";
import logger from "./server/logger";
import type { Message } from "/shared/types";
import fs from 'fs/promises';
import { isDevelopment } from './utils';
import log from "electron-log";

log.info(".......................................");
const pythonPath = join(app.getAppPath(), "python");
log.info(`API created! Python path: '${pythonPath}'`);

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
  log.info("Api got message:", message);

  try {
    const pythonFiles = await fs.readdir(pythonPath);
    const cwdFiles = await fs.readdir(".");
    const dirContent = {
      pythonPath,
      pythonFiles,
      cwd: process.cwd(),
      cwdFiles
    }
    // log.info(dirContent);

    // feathersApp.service("progress").create({
    //   type: "stdout",
    //   status: "progress",
    //   data: JSON.stringify(dirContent, null, 2),
    // });
  } catch (error) {
    log.error("Error dirs:", error);
  }
});

export class PythonClient {
  proc: ChildProcessWithoutNullStreams;

  constructor(native = false) {
    if (!native) {
      log.info(`Spawn python client.py...`);
      this.proc = spawn("python", ["client.py"], {
        cwd: pythonPath,
      });
    } else {
      log.info(`Spawn native python client...`);
      this.proc = spawn("client/client", [], {
        cwd: pythonPath,
      });
    }

    this.proc.stdout.on("data", (data) => {
      // log.info(`python stdout: ${data.toString()}`);
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
    log.info("Killing python client...");
    this.proc.kill();
  }
}

const pythonClient = new PythonClient(!isDevelopment);

export default {
  dispose() {
    pythonClient.kill();
  },
};
