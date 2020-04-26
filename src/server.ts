import app from './app';
// import socket from './socket';

/**
 * Start Express server.
 */
const run = () => {
  // const server =
  app.listen(app.get('port'), () => {
    console.log(
      '  App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env')
    );
    console.log('  Press CTRL-C to stop\n');
  });

  // const io = socket.init(server);

  // io.on('connect', (socket: any) => {
  //   console.log('Connected client');
  // });
};

export default run;
