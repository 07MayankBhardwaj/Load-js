const express = require('express');
const app= express();
const PORT = process.env.PORT || 5511;

    app.use(express.static('public'));

    app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

    let result =0;
    for (let i=0;i<10000;i++){
        result+=i;
    }
    return res.json({processId:process.pid,result});
});

app.listen(PORT,() =>
    console.log(`Listening on port ${PORT} and PID: ${process.pid}`)
);

