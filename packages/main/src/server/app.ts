import cors from "cors";
const express = require("@feathersjs/express");
const feathers = require("@feathersjs/feathers");
import socketio from "@feathersjs/socketio";
// import type {FeathersSocket} from "@feathersjs/socketio";
import type { Application } from "./declarations";
import logger from "./logger";
import middleware from "./middleware";
import services from "./services";
import appHooks from "./app.hooks";
import channels from "./channels";
import type { HookContext as FeathersHookContext } from "@feathersjs/feathers";
import type { Server, Socket } from "socket.io";
import { staticDir } from "../paths";
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
export type HookContext<T = any> = {
  app: Application;
} & FeathersHookContext<T>;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Host the public folder
app.use("/", express.static(staticDir));

// Set up Plugins and providers
// app.configure(express.rest());
// app.configure(socketio());
// Configure Socket.io real-time APIs
app.configure(
  socketio(
    {
      serveClient: false,
      cors: {
        // origin: "http://localhost:3000",
        origin: "*", // For Live Share
        methods: ["GET", "POST"],
      },
    },
    (io: Server) => {
      io.on("connection", function (socket: Socket) {
        // Forward progress events from python to feathers progress service
        // socket.onAny((eventName: string, ...args: any[]) => {
        //   console.log(`!!!! '${eventName}':`, args);
        // });
      });
    }
  )
);

// Configure other middleware (see `middleware/index.ts`)
app.configure(middleware);
// Set up our services (see `services/index.ts`)
app.configure(services);
// Set up event channels (see channels.ts)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
// app.use(express.errorHandler({ logger } as any));
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

export default app;
