// import dotenv and call config function to load environment
require("dotenv").config();

//instantiate express module
const express = require("express");

// call cors
const cors = require("cors");

// Get routes to the variabel
const router = require("./src/routes");

//use express in app variable
const app = express();

//define the server port
const port = 5000;

// import socket.io
const http = require("http");
const { Server } = require("socket.io");

// add after app initialization
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // define client origin if both client and server have different origin
  },
});
require("./src/socket")(io);

app.use(express.json());

// add cors
app.use(cors());

// Add endpoint grouping and router
app.use("/api/v1/", router);

// add route folder uploads
app.use("/uploads", express.static("uploads"));

//when this nodejs app executed, it will listen to defined port
// change app to server
server.listen(port, () => console.log(`Listening on port ${port}!`));
