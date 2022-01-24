import cors from "cors";
import favicon from "serve-favicon";
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
import paths from "../paths";
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());
export type HookContext<T = any> = {
  app: Application;
} & FeathersHookContext<T>;

// Enable CORS and body parsing
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(paths.favicon));
// Host the public folder
app.use("/", express.static(paths.static));

// Set up Plugins and providers
// app.configure(express.rest());
// app.configure(socketio());
// Configure Socket.io real-time APIs
app.configure(
  socketio({
    serveClient: false,
    cors: {
      // origin: "http://localhost:3000",
      origin: "*", // For Live Share
      methods: ["GET", "POST"],
    },
  })
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
