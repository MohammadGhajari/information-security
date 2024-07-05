const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/userModel');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err);
  console.log('uncaughtExeption! Shutting down...');
  process.exit(1);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async (con) => {
    console.log('connected to database');
    await User.collection.createIndex({ username: 1 }, { unique: true });
  });

const port = process.env.PORT || 8002;
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    console.log('room', data);
    socket.join(data);
  });

  socket.on('send_message', (data) => {
    socket.to(data.uniqueId).emit('receive_message', data);
  });
});

server.listen(port, () => {
  console.log('SERVER IS RUNNING ON PORT ', port);
});

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('unhandledRejection! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
