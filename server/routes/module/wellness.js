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

router.get(/patient\/(.*)\/(.*)\/(.*)/, function (req, res) {

  doConn();

  var param = req.params;
  var jsonArray = [];
  var rowObject = {};

  request = new Request(`Select top 100 rowguid As PatientGUID ,HN, Name + ' ' + LastName as FullName,Age,DOE,Sex
    , case when patientGUID is null
    then CAST(0 AS BIT)
    else CAST(1 AS BIT)
    end as statusFlg
    from Patient LEFT JOIN tblEKG as EKG on Patient.rowguid = EKG.patientGUID
    Where HN like '%${param[0]}%' And
    DOE Between '${param[1]}' and '${param[2]}'
    order by DOE,Name
`, function (err, rowCounts) {
      if (err) throw err;
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

  connection.execSql(request, function () {
    closeConn();
  });
});

router.get('/ekgComment/:doctor', (req, res) => {
  var jsonArray = [];
  var rowObject = {};

  const doctor = req.params.doctor;

  doConn();

  request = new Request(`
    select RowID, ListName, ListType, DoctorOwner
    from  tblListItems
    where ListType = 'EKG' and DoctorOwner = '${doctor}'
    order by ListName
  `, (err, rowCounts) => {
      if (err) throw err;
    });

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

  connection.execSql(request, function () {
    closeConn();
  });

})

router.post('/addEKGComment', (req, res) => {
  if (!req.body) return res.sendStatus(400)
  const obj = req.body;

  doConn();

  request = new Request(`
  insert into tblListItems (ListName, ListType, DoctorOwner)
  values ('${obj.ListName}','EKG','${obj.DoctorOwner}')
  `, (err, rowCounts) => {
      if (err) throw err;
    });

  request.on('doneProc', function (rowCount, more) {
    res.send();
  });

  connection.execSql(request, function () {
    closeConn();
  });

});

router.post('/deleteEKGComment', (req, res) => {
  if (!req.body) return res.sendStatus(400)
  const obj = req.body;

  doConn();

  request = new Request(`
    Delete from tblListItems
    where RowID = '${obj.RowID}'
      and ListType = 'EKG'
      and DoctorOwner = '${obj.DoctorOwner}'
  `, (err, rowCounts) => {
      if (err) throw err;
    });

  request.on('doneProc', function (rowCount, more) {

    res.send();
  });

  connection.execSql(request, function () {
    closeConn();
  });

});

router.get('/historyResult/:patientGUID', (req, res) => {
  var jsonArray = [];
  var rowObject = {};

  const patientGUID = req.params.patientGUID;

  doConn();

  request = new Request(`
    select HEEKG,HEEKGInfoTH
    from tblEKG
    where patientGUID = '${patientGUID}'
  `, (err, rowCounts) => {
      if (err) throw err;
    });

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

  connection.execSql(request, function () {
    closeConn();
  });
});

router.post('/saveResult', (req, res) => {

  if (!req.body) return res.sendStatus(400)
  const obj = req.body;

  doConn();

  request = new Request(`
    DECLARE @rc INTEGER

    select @rc = count(*)
    from tblEKG
    where patientGUID = '${obj.patientGUID}'

    IF (@rc = 0)
    begin
      insert into tblEKG( patientGUID,HEEKG,HEEKGInfoTH )
      values ('${obj.patientGUID}','${obj.HEEKG}','${obj.HEEKGInfoTH}')
    end
    else
    begin
      update tblEKG
      set HEEKG = '${obj.HEEKG}',
        HEEKGInfoTH = '${obj.HEEKGInfoTH}'
      where patientGUID = '${obj.patientGUID}'
    end
  `, (err, rowCounts) => {
      if (err) throw err;
    });

  request.on('doneProc', function (rowCount, more) {
    res.send();
  });

  connection.execSql(request, function () {
    closeConn();
  });

});

module.exports = router;
