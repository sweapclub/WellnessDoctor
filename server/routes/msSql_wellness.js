var Connection = require('tedious').Connection;

var config = {
  userName: 'ekg',
  password: 'ekg@brh',
  server: 'srh-dbs01.bdms.co.th',
  database: 'dms2'
  // server: 'brh-dbs01.bdms.co.th'
}

var Connection = new Connection(config);

module.exports = Connection;
