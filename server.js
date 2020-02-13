// database password: ka2qAJ3MS99XIbwe

const https = require('https');
const debug = require("debug")("node-angular");
const app = require('./backend/app');
const fs = require('fs');
//const http = require('http');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if(isNaN(port)){
    //named pipe
    return val;
  }

  if(port >= 0){
    //port number
    return port;
  }

  return false;
};

const onError = error => { //error handler fucntion for later in the code
  if(error.syscall !== 'listen'){
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch(error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privlages");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
  console.log("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "443");
app.set("port", port);

  const server = https.createServer({
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt')
}, app);
//const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
