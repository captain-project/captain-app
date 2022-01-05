//import { Server } from "socket.io";
import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { app } from "electron";
import { join } from "path";

// const io = new Server({
//   serveClient: false,
//   cors: {
//     // origin: "http://localhost:3000",
//     origin: "*", // For Live Share
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   //console.log(`Client connected: ${socket.id}`);

//   socket.on("message", (data) => {
//     //console.log(`Got message: ${JSON.stringify(data)}`);
//     //socket.send({ foo: "bar" });
//     //testPython();
//   });
// });

// io.listen(8080);

const cwd = join(app.getAppPath(), "python");

export class PythonServer {
  proc: ChildProcessWithoutNullStreams;

  constructor({ port = 8000 }: { port?: number } = {}) {
    this.proc = spawn("uvicorn", ["--port", port.toString(), "server:app"], {
      cwd,
    });

    this.proc.stdout.on("data", (data) => {
      console.log(`uvicorn stdout: ${data.toString()}`);
    });

    const stderrChunks: any = [];
    this.proc.stderr.on("data", (data) => {
      stderrChunks.push(data);
      console.error(`uvicorn error: ${Buffer.concat([data]).toString()}`);
    });
  }

  kill() {
    console.log("Killing python server...");
    this.proc.kill();
  }
}

const server = new PythonServer();

export default {
  dispose() {
    server.kill();
  },
};

console.log("..");
