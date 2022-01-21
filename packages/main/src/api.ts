import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { app } from "electron";
import { join } from "path";
import feathersApp from "./server";
import logger from "./server/logger";
import type {
  Progress,
  Message,
  SimulationProgressData,
  OptimizedSimulationProgressData,
} from "/shared/types";
import { optimizeSVG, createThumbnail } from "./optimizePlot";

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

const pythonFilenameToUrl = (filename: string) => {
  if (filename.indexOf("/static/") < 0) {
    return filename;
  }
  const parts = filename.split("/");
  while (parts[0] !== "static") {
    parts.shift();
  }
  parts.shift(); // Remove static
  return `//localhost:${port}/${parts.join("/")}`;
};

const getAbsolutePathFromPython = (filename: string) => {
  return join(pythonPath, filename);
};

export async function optimizePlotData(data: SimulationProgressData) {
  await optimizeSVG(data.filename);
  data.svgUrl = pythonFilenameToUrl(data.filename);

  const thumbnailPath = await createThumbnail(data.filename);
  data.thumbnailUrl = pythonFilenameToUrl(thumbnailPath);

  return data as OptimizedSimulationProgressData;
}

feathersApp.service("messages").on("created", async (message: Message) => {
  console.log("Api got message:", message);

  if (message.type === "test:optimizePlotData") {
    const data = {
      step: 3,
      plot: 9,
      title: "test!!",
      filename: "./static/sim_step_3_p9.svg",
    };
    data.filename = getAbsolutePathFromPython(data.filename);
    console.log("Optimize plot data:", data);
    await optimizePlotData(data);
    console.log("Optimized plot data:", data);
  }
});

// feathersApp
//   .service("pythonprogress")
//   .on("created", async (progress: Progress) => {
//     console.log("Api got python progress:", progress);
//     if (progress.type === "plot:progress") {
//       const data = progress.data as SimulationProgressData;
//       data.filename = getAbsolutePathFromPython(data.filename);
//       await optimizePlotData(data);
//     }
//     feathersApp.service("progress").create(progress);
//   });

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
