//
//
var express = require('express');
var app = express();
var fs = require("fs");
var mysql = require('mysql');
//
var port = 9019
app.use(express.static('public'));
//
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/public/" + "art.html");
})

function openSQL() {
  var con = mysql.createConnection ({
    host:"localhost",
    user: "stutz2",
    password: "S219536",
    database:"TeamB",
  });
  con.connect(function(err) {
    if(err) throw err;
  });
  return con;
}
var con = openSQL();

app.get('/list', function (req,res) {
  console.log("Query:"+JSON.stringify(req.query));
  search=req.query.search;
  if(req.query.password==undefined){
    query = "SELECT Username, Biography FROM Userinfo WHERE Username ='"+search+"'";//sends back all results  from user row
    con.query(query, function(err, result, search) {
      if(err) throw err;
      console.log(result)
      res.end( JSON.stringify(result));
    })
  } else {
    password=req.query.password;
    query = "SELECT Username, Biography FROM Userinfo WHERE Username ='"+search+"'AND Password = '"+password+"'";//sends back all results  from user row
    con.query(query, function(err, result, search, password) {
      if(err) throw err;
      console.log(result)
      res.end(JSON.stringify(result));
    })
  }
})

app.get('/find', function (req, res) {
    // find art
    console.log("Query:"+JSON.stringify(req.query));
    if (req.query.field === undefined || req.query.search === undefined) {
    	console.log("Missing query value!");
    	res.end('[]');
    } else {
    	field=req.query.field;
    	search=req.query.search;
      //sqlTable=req.query.sqlTable; //added to make usable for user and art
    	console.log(field+":"+search);
  //if we're passing the SQl table as an argument, it needs to go here, otherwise we need 2 seperate functions
	query = "SELECT * FROM art WHERE "+field + "  like '%"+req.query.search+"%' LIMIT 50";
	console.log(query);
	con.query(query, function(err,result,fields) {
	    if (err) throw err;
	    console.log(result)
	    res.end( JSON.stringify(result));
	})
    }
})
app.get('/addfav', function (req, res) {
  if(req.query.Username == undefined || req.query.artpiece == undefined) {
    console.log(req.query.Username);
    console.log("Bad add fav request"+JSON.stringify(req.query));
    res.end("['fail']");
  } else {

    console.log(req.query.Username);
    query = "Insert INTO favorite(Username, artpiece) VALUES('"+req.query.Username+"','"+req.query.artpiece.replace("'","''")+"')"; //we need the last part to avoid parsing errors when we have an art piece with '.
    console.log(query);
    con.query(query, function(err, result){
      if(err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    })
  }
})

app.get('/getfav', function (req,res) {
  if(missingField(req.query)) {
    console.log("Bad add fav request"+JSON.stringify(req.query));
    res.end("['fail']");
  } else {
    query = "SELECT artpiece FROM favorite WHERE username = '"+req.query.Username+"'";
    console.log(query);
    con.query(query, function(err, results) {
      if(err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
    })

  }
})
app.get('/sendcom', function(req, res){
  console.log(req.query);
  if(req.query.artpiece === undefined) {
    console.log("Bad get request:"+JSON.stringify(req.query));
    res.end("['fail']");
  } else {
    query = "Insert INTO comments(Username, Comment, artpiece) VALUES('"+req.query.Username+"','"+req.query.Comment+"','"+req.query.artpiece+"')";
    console.log(query);
    con.query(query, function(err,result,fields) {
        if (err) throw err;
        console.log(result)
        res.end( JSON.stringify(result));
    })
  }

})
app.get('/getcom', function(req, res) {
  console.log(req.query);
  if(req.query.artpiece === undefined) {
    console.log("Bad get request:"+JSON.stringify(req.query));
    res.end("['fail']");
  } else {
    query = "SELECT Comment, Username FROM comments WHERE artpiece ='"+req.query.artpiece+"'";
    console.log(query);
    con.query(query, function(err,result){
      if(err) throw err;
      res.end(JSON.stringify(result));
    })
  }
})

app.get('/addrec', function (req, res) {
    if (missingField(req.query)) {
        console.log("Bad add request:"+JSON.stringify(req.query));
        res.end("['fail']");
    } else {
    console.log('Hello');
	query = "Insert INTO Userinfo(Username, Password, Biography)  VALUES('"+req.query.Username+"','"+req.query.Password+"','"+req.query.Biography+"')";
 	console.log(query);
	con.query(query, function(err,result,fields) {
	    if (err) throw err;
	    console.log(result)
	    res.end( JSON.stringify(result));
	})
       }
})

app.get('/editBio', function (req, res) {
    //if (missingField(req.query)) {
    //   console.log("Bad edit request:"+JSON.stringify(req.query));
    //   res.end("['fail']");
    //} else {
    console.log('sup');
	query = "UPDATE Userinfo SET Biography = '"+req.query.newBio+"' WHERE Username = '"+req.query.Username+"'";
 	console.log(query);
	con.query(query, function(err,result,fields) {
	    if (err) throw err;
	    console.log(result)
	    res.end( JSON.stringify(result));
	})
  //  }
})

app.get('/getfavs', function (req, res){
     if (req.query.Username == undefined){
       console.log("Bad request:" + JSON.stringify(req.query));
       res.end("['fail']");
    }else {
      query = "Select artpiece from favorite where username = '" + req.query.Username+"'";
      con.query(query, function(err,result,fields) {
        if (err) throw err;
        console.log(result);
        res.end(JSON.stringify(result));
      })
     }
 })

app.get('/checkrec', function(req,res){
     if (req.query.Username == undefined){
       res.end("['fail']");
    }else {
      query = "Select ID from Userinfo Where Username= '" +req.query.Username+"'";
      con.query(query, function(err, result, fields){
       if (err) throw err;
       res.end(JSON.stringify(result));
     })
    }
})

function missingField(p) {
    return (p.Username === undefined || p.Password === undefined || p.Biography === undefined);
}

var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
