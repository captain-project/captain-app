import { spawn, execFile, exec } from "child_process";
import type { ChildProcessWithoutNullStreams, ChildProcess } from "child_process";
import { app } from "electron";
import { join } from "path";
import feathersApp from "./server";
import logger from "./server/logger";
import type { Message } from "/shared/types";
import fs from 'fs/promises';
import { isDevelopment } from './utils';
import log from "electron-log";
import { type Application } from "./server/declarations";

log.info("env:", process.env);

log.info(".......................................");
const pythonPath = join(app.getAppPath(), "python");
log.info(`API created! Python path: '${pythonPath}'`);

async function getDebugDirs() {
  try {
    const pythonFiles = await fs.readdir(pythonPath);
    // const cwdFiles = await fs.readdir("."); // Root (/) in production
    const dirContent = {
      pythonPath,
      pythonFiles,
      // cwd: process.cwd(),
      // cwdFiles
    }
    // log.info(dirContent);
    return dirContent;
  } catch (error) {
    log.error("Error dirs:", error);
    return {
      pythonPath,
      // cwd: process.cwd(),
      error,
    };
  }
}

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

  const dirContent = await getDebugDirs();
  feathersApp.service("progress").create({
    type: "stdout",
    status: "progress",
    data: JSON.stringify(dirContent, null, 2),
  });
});

export class PythonClient {
  app: Application;
  proc?: ChildProcessWithoutNullStreams | ChildProcess;

  constructor(app: Application) {
    this.app = app;
  }

  async init({ native = false }: { native?: boolean }) {
    log.info(`Init ${native ? 'native' : 'dev'} python client...`);
    const dirContent = await getDebugDirs();
    log.info(`Dir content: \n${JSON.stringify(dirContent, null, 2)}`);

    const useExec = false;

    try {
      if (!native) {
        log.info(`Spawn python client.py...`);
        if (useExec) {
          this.proc = exec(`python ${join(pythonPath, "client.py")}`, { cwd: pythonPath }, (err, stdout, stderr) => {
            if (err) {
              log.error("Proc error:", err);
            }
            log.info("stdout:", stdout, "stderr:", stderr);
          });
        } else {
          this.proc = spawn("python", [join(pythonPath, "client.py")], {
            cwd: pythonPath,
          });
        }
        log.info(`Spawning done!`);
      } else {
        log.info(`Spawn native python client...`);
        if (useExec) {
          this.proc = execFile(join(pythonPath, "client"), { cwd: pythonPath }, (err, stdout, stderr) => {
            if (err) {
              log.error("Python client error:", err);
            }
            log.info("stdout:", stdout, "stderr:", stderr);
          });
        } else {
          this.proc = spawn(join(pythonPath, "client"), { cwd: pythonPath });
        }
      }
    }
    catch (err) {
      log.error("Error spawning captain process", err);
    }

    if (!this.proc) {
      return;
    }

    this.proc.stdout?.on("data", (data) => {
      // log.info(`python stdout: ${data.toString()}`);
      this.app
        .service("progress")
        .create({ type: "stdout", status: "progress", data: data.toString() });
    });

    const stderrChunks: any = [];
    this.proc.stderr?.on("data", (data) => {
      stderrChunks.push(data);
      log.error(`python error: ${Buffer.concat([data]).toString()}`);
      // this.app
      //   .service("progress")
      //   .create({ type: "python-stderr", data: data.toString() });
    });

    this.proc?.on('error', (err: Error) => {
      log.error(err);
    })

    // TODO: string -> NodeJS.Signals, but git hook error even if '"types": ["node"]' in tsconfig
    this.proc?.on('exit', (code: number | null, signal: string | null) => {
      log.info(`Exited with code ${code} and signal ${signal}`);
    })

    this.proc?.on('close', (code: number | null, signal: string | null) => {
      log.info(`Closed with code ${code} and signal ${signal}`);
    })
  }

  kill() {
    log.info("Killing python client...");
    this.proc?.kill();
  }
}

const pythonClient = new PythonClient(feathersApp);

pythonClient.init({ native: !isDevelopment })

export default {
  dispose() {
    pythonClient.kill();
  },
};
