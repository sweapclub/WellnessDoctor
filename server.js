const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const apiBConnect = require('./server/routes/module/bConnect');
const apiWellness = require('./server/routes/module/wellness');

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/bConnect', apiBConnect);
app.use('/api/wellness', apiWellness);

app.get('/AssignWorkInterpreter', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
