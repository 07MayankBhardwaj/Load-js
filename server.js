const express = require('express');
const os = require('os');
const cluster = require('cluster');

const cpuNums = os.cpus().length;
const PORT = process.env.PORT || 5512;

if(cluster.isPrimary){
    for(let i=0;i<cpuNums;i++){
        cluster.fork();
    }

    cluster.on('exit',()=>{
        cluster.fork({silent:true, env: process.env});
    })
} else {
    const app = express();

    app.use(express.static('public'));

    app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    });

    app.listen(PORT,() =>
        console.log(`Listening on port ${PORT} and PID: ${process.pid}`)
    );
}
