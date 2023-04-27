# ClusterLoad - Node.js Load Balancer

ClusterLoad is a powerful and efficient load balancing tool for Node.js applications. It uses Node.js cluster module to distribute incoming traffic across multiple worker processes, providing improved performance, reliability and scalability for your applications.

## Features

- Automatic distribution of incoming requests across multiple worker processes
- Support for multiple CPU cores for efficient multi-threading

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/clusterload.git
   ```

2. Install the dependencies:
   ```
   cd clusterload
   npm install
   ```

### Usage

#### Single-Core Mode

To run the app in single-core mode, run the following command:
```
node app.js
```

#### Multi-Core Mode

To run the app in multi-core mode using Node cluster, run the following command:
```
node server.js
```

By default, the app will be running on port 5512. You can change the port by setting the `PORT` environment variable.

### Folder Structure

- `app.js`: File for single-core mode.
- `server.js`: File for multi-core mode using Node cluster.
- `public`: Folder containing a static website for testing.

### Code Examples

Sure, here's a brief explanation of the code:

`app.js`:

- First, the required packages are imported - `express` and `path`.
- An instance of the `express` application is created and assigned to the `app` variable.
- The `PORT` constant is set to the value of the `PORT` environment variable if it exists, otherwise it is set to `5511`.
- A static file middleware is set up to serve files from the `public` directory.
- A route is defined for the root URL `/`, which sends the `index.html` file as a response.
- A loop is executed that calculates a sum of numbers, just to simulate some processing work, and returns the result in the response object.
- Finally, the app is started and listens on the `PORT` constant.

#### `app.js`

```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5511;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');

  let result = 0;
  for (let i = 0; i < 10000; i++) {
    result += i;
  }

  return res.json({ processId: process.pid, result });
});

app.listen(PORT, () =>
  console.log(`Listening on port ${PORT} and PID: ${process.pid}`)
);
```

#### `server.js`

- First, the required packages are imported - `express`, `os`, and `cluster`.
- The number of CPU cores available on the system is retrieved and assigned to the `cpuNums` constant.
- The `PORT` constant is set to the value of the `PORT` environment variable if it exists, otherwise it is set to `5512`.
- A check is made to see if the current process is the primary process or a worker process. If it is the primary process, it creates a worker process for each available CPU core and sets up an event listener to replace any workers that exit.
- If the current process is a worker process, an instance of the `express` application is created and assigned to the `app` variable.
- A static file middleware is set up to serve files from the `public` directory.
- A route is defined for the root URL `/`, which sends the `index.html` file as a response.
- Finally, the app is started and listens on the `PORT` constant.

#### `server.js`

```javascript
const express = require('express');
const os = require('os');
const cluster = require('cluster');

const cpuNums = os.cpus().length;
const PORT = process.env.PORT || 5512;

if (cluster.isPrimary) {
  for (let i = 0; i < cpuNums; i++) {
    cluster.fork();
  }

  cluster.on('exit', () => {
    cluster.fork({ silent: true, env: process.env });
  });
} else {
  const app = express();

  app.use(express.static('public'));

  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  app.listen(PORT, () =>
    console.log(`Listening on port ${PORT} and PID: ${process.pid}`)
  );
}
```

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.