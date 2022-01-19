// import feathers from "@feathersjs/feathers";
// import "@feathersjs/transport-commons";
// import express from "@feathersjs/express";
// import socketio from "@feathersjs/socketio";
const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
import { join } from "path";
import { app as electron } from "electron";
import type { Message, Progress } from "/shared/types";

const staticDir = join(electron.getAppPath(), "python", "static");

// A messages service that allows to create new
// and return all existing messages
class MessageService {
  messages: Message[] = [];

  async find() {
    // Just return all our messages
    return this.messages;
  }

  async create(data: Message) {
    this.messages.push(data);
    return data;
  }
}

class ProgressService {
  async create(data: Progress) {
    return data;
  }
}

class PythonProgressService {
  async create(data: Progress) {
    return data;
  }
}

// Creates an ExpressJS compatible Feathers application
const app = express(feathers());

// Express middleware to parse HTTP JSON bodies
app.use(express.json());
// Express middleware to parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Express middleware to to host static files from the current folder
app.use(express.static(staticDir));
// Add REST API support
app.configure(express.rest());
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
    (io) => {
      io.on("connection", function (socket) {
        // Forward progress events from python to feathers progress service
        socket.on("pythonprogress", function (data) {
          app.service("pythonprogress").create(data);
        });
      });
    }
  )
);
// Register our messages service
app.use("/messages", new MessageService());
app.use("/progress", new ProgressService());
app.use("/pythonprogress", new PythonProgressService());
// Express middleware with a nicer error handler
app.use(express.errorHandler());

// Add any new real-time connection to the `everybody` channel
// app.on("connection", (connection) => app.channel("everybody").join(connection));
app.on("connection", (connection: { headers: { "user-agent": string } }) => {
  console.log(
    "Feathers got connection from user agent:",
    connection.headers["user-agent"]
  );
  app.channel("everybody").join(connection);
});
// Publish all events to the `everybody` channel
app.publish(() => app.channel("everybody"));

// Start the server
app.listen(3030).then(() => {
  console.log("Feathers server listening on localhost:3030");
});

// For good measure let's create a message
// So our API doesn't look so empty
app.service("messages").create({
  text: "Hello world from the server",
});

export default app;
