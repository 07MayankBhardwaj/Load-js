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

## Single core testing :
1.![image](https://user-images.githubusercontent.com/127011697/234972525-b7f8fdd5-6b93-4140-a1c2-fafd66c9b519.png)
2.![image](https://user-images.githubusercontent.com/127011697/234972612-dd682d70-3064-472e-9fab-4f424361a08b.png)
3.![image](https://user-images.githubusercontent.com/127011697/234972682-07a5bf3c-4ce5-4368-9cd5-3ed649210f18.png)
4.![image](https://user-images.githubusercontent.com/127011697/234972785-c6bfb01e-7d07-4d25-b26d-143d53a91525.png)

## Multi-Core testing:
1.![image](https://user-images.githubusercontent.com/127011697/234972978-4f634b67-5ddb-43c9-9617-fcc031220940.png)
2.![image](https://user-images.githubusercontent.com/127011697/234973118-9644376a-bb67-4468-a2bb-f50e7ba0a075.png)
3.![image](https://user-images.githubusercontent.com/127011697/234973218-4bd0c5f7-e27a-4e78-9a2e-4d1f56c969cd.png)
4.![image](https://user-images.githubusercontent.com/127011697/234973317-56c5b2a9-b2db-46ed-b4f3-f579ec44f6be.png)







