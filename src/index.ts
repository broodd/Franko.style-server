import server from './server';

server();

// if (cluster.isMaster) {
//   const cpuLength = require('os').cpus().length;

//   logger.debug(`App running on ${cpuLength} processes`);
//   for (let i = 0; i < cpuLength; i += 1) {
//     cluster.fork();
//   }

//   cluster.on('exit', () => {
//     // Replace the dead worker,
//     cluster.fork();
//   });
// } else {
//   server();
// }
