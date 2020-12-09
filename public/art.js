const port='9019'
const Url ='http://jimskon.com:'+port
var operation;
var textboxID;//
var search;
var password
var artrecord = [];//stores each artwork locally
var artpiecerecord = [] //stores URL of artwork locally
var artname = []; //array to store the name of pieces.
var rows;
var userinfoSelf = [];
var sqlTable ="art.sql";
var isSelf = true; //for searching users, tells if it is self user or not;

$(document).ready(function () {
    $(".modal").show();
    $("#footer").hide();
    $("#modal-login-error-text").hide();//couldn't get it to be able to be hidden and then appear using hidden attribute on html so I moved it here
    $(".signup-modal").hide();
    $(".user-profile").hide();
    $(".search-option").hide();
    $(".btn-createaccount").click(createAccount);
    $("#passwordrepeat").keyup(function(e){
      if($("#addpassword").val()!=$("#passwordrepeat").val()){
        $(this).closest("input").addClass('highlight');
      } else {
        $(this).closest("input").removeClass('highlight');
      }
    });

    console.log("ready");
    operation = "Artist";//default
    $("#user-search").click(getList);
    $(".btn-login").click(getList);
    $(".mainpage").click(function(e) {
      $("#results").html("");
      $("#art-search-input").val("");
      $(".search-option").show();
      $(".user-profile").hide();
    });



  $(".dropdown-menu li a").click(function(){
    $(this).parents(".btn-group").find('.selection').text($(this).text());
    operation=$(this).text().split(" ").pop();  // Get last word
    console.log(operation)
  });
  $("#art-search").click(getMatches);
  $(".art-search-input").keyup(function(e){
    getMatches();
  });
 $(".list-add-button").click(function(){
    console.log("list-add-button clicked");
    var elmid=$(this).attr("data-id");
    console.log(elmid);
    console.log(artpiecerecord[elmid]);
    addfavorite(artpiecerecord[elmid]);
  });

  $(".profilebtn").click(function(){
    console.log("Profile Show");
    $(".user-profile").show();
    $("#editbutton").show();
    $("#user-username").text(userinfoSelf[0]);
    $("#user-biography").text(userinfoSelf[1]);
    getFavorites(userinfoSelf[0]);
    $(".search-option").hide();
    $(".modal").hide();
    $(".signup-modal").hide();
 });

  $(".logoutbtn").click(function(){
    $(".modal").show();
    $("#footer").hide();
    $("#modal-login-error-text").hide();
    $(".signup-modal").hide();
    $(".user-profile").hide();
    $(".search-option").hide();
    $("#username-login").val("");
    $("#password-login").val("");
    userinfoSelf.splice(0, userinfoSelf.length); //clear the array
    isSelf=true;
  });

});

function getMatches() {
    sqlTable="art.sql";
    search = $("#art-search-input").val();//sets search value
    $('#art-search-input').empty();
  $.ajax({
    url: Url+'/find?field='+operation+'&search='+search,
    type:"GET",
    success: processResults,
    error:displayError
  })
}
function errorText() {
  $("#modal-login-text").hide();
  $("#modal-login-error-text").show();
}
 function getList(){

   sqlTable="Userinfo.sql";
   if($("#user-search-input").is(':visible')) {
   search=$("#user-search-input").val();
   $("#user-search-input").val(""); //clear user search box after the search
   console.log("notself"+search);
   isSelf=false;
   $.ajax({
     url: Url+'/list?search='+search,
     type:"GET",
     success: processResults,
     error:displayError
   })

 } else {
   search=$("#username-login").val();
   password=$("#password-login").val();
   $(".modal").hide();
   $.ajax({
     url: Url+'/list?search='+search+'&password='+password,
     type:"GET",
     success: processResults,
     error:displayError
   })
  }
}
 function createAccount() { //when user wants to sign up, this will appear. still need to add where it checks if username is taken already
   $(".signup-modal").show();
   $(".modal").hide();

   $(".signup").click(addEntry);


 }

 function addEntry(){
   $('#id01 input[type="password"]').blur(function(){
    if(!$(this).val()){
        $(this).addClass("error");
    } else{
        $(this).removeClass("error");
    }
  });
   sqlTable="Userinfo.sql";

   console.log(sqlTable);
   console.log($('#addusername').val()+$('#addpassword').val()+$('#addbiography').val())
   if($("#addusername").val().length<5) {
     console.log("Username must be at least 5 characters");
     $("#errorMessage").html("Username Must Be at Least 5 Characters");
     return;
   }

//ajax call to check if username is already in use.
   $.ajax({
	url: Url+'/checkrec?Username='+$('#addusername').val(),
	type: "GET",
	success: checkUsername,
	error: displayError
     })
 }
function processAdd() {
  console.log("Success: added to sql table");
  if(sqlTable="Userinfo.sql") {
    $(".signup-modal").hide();
    $(".search-option").show(); //user is now logged in and is able to search other users.
  } else {
    console.log("added to favorites");
  }
}
function addfavorite(newfavorite, name) {
  sqlTable="favorite.sql";
  $.ajax({
    url: Url+'/addfav?Username='+userinfoSelf[0]+'&artpiece='+newfavorite+'&Title='+name,
    type:"GET",
    success: processAdd,
    error: displayError,
  })
}
//outputs pictures after search
function processResults(results) {
  console.log(sqlTable);
  console.log("Self = " +isSelf);
  if(results=="" && isSelf==true) {
    $("#modal-login-error-text").show();
    console.log("username could not be found");
    return;
  }
  if(results=="" && isSelf==false) {
   errorText();
  }
  else if(sqlTable=="Userinfo.sql") {
    var userinfo = results.split('","');
    for (var i=0; i<userinfo.length; i++) {
      if(i == 0) {
        userinfo[i] = userinfo[i].replace('[{"','');
      } else if (i == userinfo.length-1) {
        userinfo[i] = userinfo[i].replace('"}]','');
      }
      userinfo[i]=userinfo[i].split('":"').pop();//removes column title from text
      for(var j=0; j<userinfo[i].length; j++) {
        userinfo[i][j]=userinfo[i][j].replace('""','');
      }
      console.log(userinfo[i]);
    }
    if(isSelf==true) {
      if(results=="[]") {
        $("#modal-login-error-text").show();
        console.log($("#modal-login-error-text").text());
        console.log("error: not same password");
        return;
      } else {
        getFavorites(userinfo[0]);
        $(".modal").hide();
        $(".user-profile").show();
        $("#user-username").text(userinfo[0]);
        $("#user-biography").text(userinfo[1]);
        $("#bioEdit").hide();
       $("#changeBio").hide();
       $("#cancelChange").hide();
       $("#editbutton").click(function(){
        $("#bioEdit").show();
        $("#changeBio").show();
        $("#cancelChange").show();

        $("#bioEdit").val(userinfoSelf[1]);
        $("#changeBio").click(function (){
          newBio=$("#bioEdit").val();
        $.ajax({
             url: Url+'/editBio?Username='+userinfoSelf[0]+'&newBio='+newBio,
             type:"GET",
             success: processResults(results),
             error: displayError,
           })
           $("#user-biography").text(newBio);
           $("#bioEdit").hide();
           $("#changeBio").hide();
           $("#cancelChange").hide();
         });
         $("#cancelChange").click(function(){
           $("#bioEdit").hide();
           $("#changeBio").hide();
           $("#cancelChange").hide();
         })
       });
        for(var i=0; i<userinfo.length; i++) {
          console.log(userinfo.length);
          userinfoSelf[i]=userinfo[i];
        }
        //$("#self-profile").show(); //features on user-profile only accessable if user page is self--Not in html yet

      }
      isSelf=false;
    } else {
      $(".search-option").hide();
      $(".user-profile").show();
      $("#editbutton").hide(); //we don't want a user to edit another user's bio.
      $("#user-username").text(userinfo[0]);
      $("#user-biography").text(userinfo[1]);
      getFavorites(userinfo[0]);
    }
  }
  else if (sqlTable=="art.sql"){
  $('#results').html("");//clears past search results
  $('.search-option').show();
  rows=JSON.parse(results);

 var result = '<div class = artResults>';
 if (rows.length < 1) {
   result += "<h3>Nothing Found</h3>";
   console.log("Nothing Found");
 } else {
    result += '<h3>Results</h3>';
    var i=0;
    rows.forEach(function(row){
      artrecord[i] = `<div class = "artResult" id="${i}"><img src=${row.URL} class = URL>` + '<p class=Title>Title: ' + row.Title + '</p><p class = Year>Year: ' + row.Year + '</p><p class = Artist>Artist: ' + row.Artist + '</p><p class = Born>Artist Born-Died: ' + row.BornDied + '</p><p class = Technique>Technique: ' + row.Technique + '</p><p class = Location>Location: ' + row.Location + '</p><p class = Form>Form: ' + row.Form + '</p><p class = Type>Type: ' + row.Type + '</p><p class = School>School: ' + row.School + '</p><p class = Timeframe>Timeframe: ' + row.Timeframe + '</p></div>' ;
      console.log(artrecord[i]);
      artpiecerecord[i]=row.URL;
      artname[i]=row.Title;
     result += artrecord[i] + '<button class ="list-add-button" data-id="'+ i + '">Add to favorites</button><button class="expand-comments-btn" data-id="' + i + '">See Comments</button><span class="chatinput"><input id="ta-'+i+'" class="form-control" rows="1" cols="60" placehold="message"></textarea><br/><input type="button" value="send" id="send-btn-'+i+'"></p> </span> <div class="scrollabletextbox" id="com-'+i+'">Comments:</div>';
    $("#ta-"+i).hide();
     result += "<hr>";
     i++;
     //need to add in artrecord for choosing favorites
    })
    result += '</div>';
    $(result).appendTo('#results');
    $("#form-control").hide();
    $(".chatinput").hide();
    $(".scrollabletextbox").hide();
    $(".list-add-button").click(function(){
     console.log("favorite button clicked");
     var elmid = $(this).attr("data-id");
     console.log(elmid);
     addfavorite(artpiecerecord[elmid], artname[elmid]);
    });
    $(".expand-comments-btn").click(function() {

      console.log("expand comments list clicked");
      textboxID=0;
      var elmid=$(this).attr("data-id");
      textboxID=elmid;
      console.log(elmid);
      getcomments(artpiecerecord[elmid]);
    });

}
}
}
//shows error
function displayError(error) {
    console.log('Error ${error}');
    $("#errorMessage").html("Username Already Taken");
}
function getcomments (commentpiece) {
  console.log("get comments");
  //console.log(commentpiece);
  $.ajax({
   url: Url+'/getcom?artpiece='+commentpiece,
   type: "GET",
   success: opencomments,
   error: displayError,
 })
}

function opencomments(results) {
  console.log(results);
if(results == "[]") {
    console.log("comment empty");
    $("#com-"+textboxID).append("<br>No Comments Yet, Be the First to Comment!");
  } else {
  var comments = results.split(',');
  var commentsParsed;
  for(var i=0; i<comments.length; i++) {
    if(i == 0) {
      comments[i] = comments[i].replace('[{"','');
    } else if (i == comments.length-1) {
      comments[i] = comments[i].replace('"}]','');
    }
    comments[i]=comments[i].split('":"').pop();//removes column title from text
    for(var j=0; j<comments[i].length; j++) {
      comments[i][j]=comments[i][j].replace('""','');
    }
  }
  for(var i=2; i<comments.length; i+=2) {
    comments[i]=comments[i].split('T').shift();
  }
  for(var i=0; i<comments.length; i+=2) {
    $("#com-"+textboxID).append("<br>" + comments[i+1]+": "+ comments[i]);
    //$(comments[i]+": "+comments[i+1]).appendTo("#com-"+textboxID);
  }
  }
  console.log(textboxID);

  $("#com-"+textboxID).show();
  $(".chatinput").show();
  $("#ta-"+textboxID).show();
  console.log(comments);

  //putting your comment into the sql table and displaying
  $("#send-btn-"+textboxID).click(function() {
    if($("#ta-"+textboxID).val()=="") {
      return;
    } else {
      var sentComment = $("#ta-"+textboxID).val();
      //console.log(sentComment);
      //console.log(userinfoSelf[0]);
      //console.log(artpiecerecord[textboxID]);
      //opencomment(sendComment);
      $(".chatinput").hide();
      $("#send-btn-"+textboxID).hide();

      $.ajax ({
        url: Url+"/sendcom?Comment="+sentComment+"&Username="+userinfoSelf[0]+"&artpiece="+artpiecerecord[textboxID],
        type: "GET",
        success: processcomment,
        error: displayError,
      });



    }

  });

}

//adds comment to other comments on web page after sent by user
//userinfoSelf[0]+": "+
function processcomment(results) {
  //$(userinfoSelf[0]+": "+results.Comment).appendTo("#com-"+textboxID);
  $("#com-"+textboxID).append("<br>" + userinfoSelf[0]+": "+ $("#ta-"+textboxID).val());
}

function myFunction(imgs) {
  // Get the expanded image
  var expandImg = document.getElementById("expandedImg");
  // Get the image text
  var imgText = document.getElementById("imgtext");
  // Use the same src in the expanded image as the image being clicked on from the grid
  expandImg.src = imgs.src;
  // Use the value of the alt attribute of the clickable image as text inside the expanded image
  imgText.innerHTML = imgs.alt;
  // Show the container element (hidden with CSS)
  expandImg.parentElement.style.display = "block";
}

function listFavorites(results){
	$(".column1").html("");
	$(".container2").hide(); //hide the expanding image container
	rows = JSON.parse(results);
	var result;
	var counter = 0;
        rows.forEach(function(row){
	 $("<figure><img src=" + row.artpiece + " class='image' alt="+row.Title+" style='width:100%;' onclick='myFunction(this);'><figcaption>"+row.Title+"</figcaption></figure>").appendTo("#col"+counter);
	 counter++;
	 if(counter == 4)
	  counter = 0;
	})
}
function getFavorites(username){
	$.ajax({
	 url: Url+'/getfavs?Username='+username,
	 type: "GET",
	 success: listFavorites,
	 error: displayError,
	})
}

//function to check if a username is taken
function checkUsername(results){
	console.log(results);
	$("#errorMessage").html("");

	//if there is already a user with that username
	if (results != "[]"){
	   $("#errorMessage").html("Username Already Taken");
	}
	else{
	 $.ajax({
         url: Url+'/addrec?Username='+$('#addusername').val()+'&Password='+$('#addpassword').val()+'&Biography='+$('#addbiography').val(),
         type:"GET",
         success: processAdd,
         error: displayError
         })
       }
}
