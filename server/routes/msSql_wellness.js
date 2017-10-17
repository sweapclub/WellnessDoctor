var Connection = require('tedious').Connection;

var config = {
  userName: 'ekg',
  password: 'ekg@brh',
  server: 'SETTING BY UR SELF !',
  database: 'dms2'
}

var Connection = new Connection(config);

module.exports = Connection;
