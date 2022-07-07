require('dotenv').config({path: './database/.env'})
const http = require('http');

const express = require('express');
const app = express();




const port = 3003;

const server = http.createServer(app);

const io = require('./socket/app')(server)

require('./api/app')(app, io);


server.listen(port, () => {
  console.log("Server listen : "+ port)
});
