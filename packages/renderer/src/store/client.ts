import io from "socket.io-client";
// import { feathers } from "@feathersjs/feathers";
// import socketio from "@feathersjs/socketio-client";

// TODO: Use @feathersjs modules https://dove.feathersjs.com/api/client.html#others and remove script in index.html
const socket = io("http://localhost:3030");

// @ts-ignore
declare const feathers;
// @ts-ignore
const client = feathers();
// @ts-ignore
client.configure(feathers.socketio(socket));
// client.configure(socketio(socket));

export default client;
