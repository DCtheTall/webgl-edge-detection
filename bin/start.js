const app = require('../app');
const { createServer } = require('http');
const debug = require('debug');

const PORT = process.env.PORT || 4000;

const server = createServer(app);

/**
   * onListen callback for server
   * @returns {undefined}
   */
function onListen() {
  console.log(`Listening on port ${PORT}`);
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}

/**
 * onError callback
 * @param {Error} err the error
 * @returns {undefined}
 */
function onError(err) {
  if (err.syscall !== 'listen') throw err;

  const bind = typeof port === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

  switch (err.code) {
    case 'EACCESS':
      console.log(`${bind} requires elevated privilege`);
      break;
    case 'EADDRINUSE':
      console.log(`${bind} is already in use`);
      break;
    default:
      throw err;
  }
}

server.on('listening', onListen);
server.on('error', onError);

server.listen(PORT);
