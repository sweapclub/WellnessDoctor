var Connection = require('tedious').Connection;

var config = {
  userName: 'reports',
  password: 'reports',
  server: '10.121.13.41'
}

var Connection = new Connection(config);

module.exports = Connection;
