const connection = require('../msSql_wellness');
const express = require('express');
const router = express.Router();
var Request = require('tedious').Request;

function doConn() {
  connection.on('connect', function (err) {
    if (err) {
      console.log(err);
    } else {
      executeStatement();
    }
  });
}

function closeConn() {
  connection.close();
}


// router.get('/patient/:hn/:dStart/:dEnd', function (req, res) {
router.get(/patient\/(.*)\/(.*)\/(.*)/, function (req, res) {

  doConn();

  var param = req.params;
  var jsonArray = [];
  var rowObject = {};

  if (param[1] == '' || param[2] == '') {
    // console.log('No HN !');
  }

  request = new Request(`Select rowguid As PatientGUID ,HN, Name + ' ' + LastName as FullName,Age,DOE,Sex
      from Patient
      Where HN like '%${param[0]}%' And
      DOE Between '${param[1]}' and '${param[2]}'
      order by DOE,Name`, function (err, rowCounts) {
      if (err) {
        console.log(err);
      }

    })

  request.on('row', function (columns) {
    rowObject = {};
    columns.forEach(function (column) {
      var tempColName = column.metadata.colName;
      var tempColData = column.value;
      rowObject[tempColName] = tempColData;
    })
    jsonArray.push(rowObject);
  });

  request.on('doneProc', function (rowCount, more) {
    res.send(jsonArray);
  });

  connection.execSql(request,function () {
    closeConn();
  });

});

module.exports = router;
