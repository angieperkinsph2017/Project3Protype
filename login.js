$(document).ready(function () {
    $("#user-login").click(getMatches);

    $("#clear").click(clearResults);
});

function getMatches(){
    console.log("getMatches!");
    var username=$('#username').val();
    var password=$('#password').val();
    if(username.length<1 || password.length<1)
    var userinfo=username+" "password,
    return;
    console.log(username+" "+password);
    openSQL();

}

processResults(results) {
  console.log(results);
  if(results==true)
  {
    $(location).attr("href","http://jimskon.com/class/softdev/stutz2/ArtApp/art.html")
  }
}


var express = require('express');
var app = express();
var fs = require("fs");
var mysql = require('mysql');
pp.get('/', function(req, res)){
  res.sendfile(
})
function openSQL() {
  var con mysql.creatConnection({
    host:"localhost",
    user:"stutz2",
    password:"S219536",
    database:"stutz2"
  });
  con.connect(function(err) {
    if(err) throw err;
  });
  return con;
}

var con = openSQL();

app.get('/list', function (req, res) {
  query="SELECT * FROM Userinfo"
  con.query(query, function(err,result, fields){
    if(err) throw err;
    console.log(result)
    res.end(JSON.stringify(result));
  })
})
