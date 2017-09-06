const connection = require('../msSql_bConnect');
const express = require('express');
const router = express.Router();
var Request = require('tedious').Request;

var CryptoJS = require("crypto-js");

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


// router.get('/', function (req, res) {
//   res.send('test !');
// })

function encryptLogin(pwd) {
  var rawStr = pwd;
  var wordArray = CryptoJS.enc.Utf8.parse(rawStr);
  wordArray = CryptoJS.MD5(wordArray);
  // CryptoJS.MD5(CryptoJS.enc.Utf16LE.parse(str))
  var base64 = CryptoJS.enc.Base64.stringify(wordArray);
  // console.log('encrypted:', base64);
  return base64;
}

router.post('/login', function (req, res) {
  if (!req.body) return res.sendStatus(400)
  const obj = req.body;

  const id = obj.id;
  const pwd = encryptLogin(obj.pwd);
  doConn()

  var jsonArray = [];
  var rowObject = {};

  request = new Request(`
    select c.forename + ' ' + c.surname as FullName,lin.UID
    from BRH_BConnect_RPT.dbo.login as lin left join BRH_BConnect_RPT.dbo.CareProvider c on lin.uid = c.uid
    inner join BRH_BConnect_RPT.dbo.CareproviderLocation cl on c.UID = cl.CareproviderUID
    inner join BRH_BConnect_RPT.dbo.Location l on cl.LocationUID = l.UID
    where lin.loginname = '${id}' and lin.password = '${pwd}' and
    l.UID = 9 and c.StatusFlag = 'A'
    order by c.UID
  `, function (err, rowCounts) {
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

  connection.execSql(request, function() {
    closeConn();
  });
});



module.exports = router;
