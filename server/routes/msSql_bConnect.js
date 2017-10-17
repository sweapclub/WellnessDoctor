var Connection = require('tedious').Connection;

var config = {
  userName: 'reports',
  password: 'reports',
  server: 'SETTING BY UR SELF !'
}

var Connection = new Connection(config);

module.exports = Connection;
