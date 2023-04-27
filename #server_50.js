const express = require('express');
const os = require('os');
const cluster = require('cluster');

const cpuNums = os.cpus().length;
const PORT = process.env.PORT || 5512;

const CPU_LIMIT = 80; // percent
const CPU_CHECK_INTERVAL = 5000; // milliseconds

let server;
let cpuUsageInterval;

if (cluster.isPrimary) {
  for (let i = 0; i < cpuNums; i++) {
    cluster.fork();
  }

  cluster.on('exit', () => {
    cluster.fork({ silent: true, env: process.env });
  });

  // Start monitoring CPU usage
  cpuUsageInterval = setInterval(() => {
    const cpuUsage = os.loadavg()[0] / os.cpus().length * 100;
    console.log(`CPU usage: ${cpuUsage.toFixed(2)}%`);

    if (cpuUsage > CPU_LIMIT) {
      console.log(`CPU usage exceeded limit of ${CPU_LIMIT}%. Stopping server...`);
      server.close(() => {
        console.log('Server stopped.');
        clearInterval(cpuUsageInterval);
        process.exit(1);
      });
    }
  }, CPU_CHECK_INTERVAL);
} else {
  const app = express();

  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  server = app.listen(PORT, () =>
    console.log(`Listening on port ${PORT} and PID: ${process.pid}`)
  );
}
