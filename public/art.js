const port='9019'
const Url ='http://jimskon.com:'+port
var operation;
var selectID;
var recIndex;
var search;
var password
var artrecord = [];//stores each artwork locally. not implemented yet
var rows;
var userinfoSelf = [];
var sqlTable ="art.sql";
var isSelf = true; //for searching users, tells if it is self user or not;

$(document).ready(function () {
    $(".modal").show();
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
      $(".search-option").show();//junk, shoult not be in final product, just for testing.
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
    addfavorite(artrecord[elmid]);
  });

});

function getMatches() {//if set on one function pass sqlTable to this
  //basically gutted this for demo, we can implement later
  //need a way to differentiate between tables, but cannot call in doc .ready with sql name or else wont search properly
  //may be worth writing a seperate one for user/password
    sqlTable="art.sql";
    search = $("#art-search-input").val();//sets search value
    $('#art-search-input').empty();
  //}
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
   console.log($("#user-search-input").length);
   if($("#user-search-input").is(':visible')) {
   search=$("#user-search-input").val();
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
   console.log("self"+search+" "+password);
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
     $.ajax({
         url: Url+'/addrec?Username='+$('#addusername').val()+'&Password='+$('#addpassword').val()+'&Biography='+$('#addbiography').val(),
         type:"GET",
         success: processAdd,
         error: displayError
     }) //favorite artists and picture are fixed at an arbitrary value, this will be changed in the final product
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
function addfavorite(newfavorite) {
  sqlTable="favorite.sql";
  console.log("favorite: "+newfavorite);
  $.ajax({
    url: Url+'/addfav?Username='+userinfoSelf[0]+'&artpiece='+newfavorite,
    type:"GET",
    success: processAdd,
    error: displayError,
  })
}
//outputs pictures after search
function processResults(results) {
  console.log(results);
  console.log(sqlTable);
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
        console.log($("#password-login").val());
        $(".modal").hide();
        $(".user-profile").show();
        $("#user-username").text(userinfo[0]);
        $("#user-biography").text(userinfo[1]);
        $("#bioEdit").hide();
        $("#changeBio").hide();

        $(".bio").click(function(){
          $("#bioEdit").show();
          $("#changeBio").show();
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
          });
        });

	$.ajax({
	 url: Url+'/getfavs?Username='+userinfo[0],
	 type: "GET",
	 success: listFavorites,
	 error: displayError,
	})
        for(var i=0; i<userinfo.length; i++) {
          console.log(userinfo.length);
          userinfoSelf[i]=userinfo[i];
        }
        //$("#self-profile").show(); //features on user-profile only accessable if user page is self--Not in html yet

      }
      isSelf=false;
      console.log("CheckSelf "+isSelf);
    } else {

      $(".search-option").hide();
      $(".user-profile").show();
      $("#user-username").text(userinfo[0]);
      $("#user-biography").text(userinfo[1]);
      $(".favorite-artists").text(userinfo[3]);
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
        $.ajax({
          url:Url+'/getcom?artpiece='+row.URL,
          type:'GET',
          error:displayError,
        })
      artrecord[i] = `<img src=${row.URL} class = URL>` + '<p class=Title>Title: ' + row.Title + '</p><p class = Year>Year: ' + row.Year + '</p><p class = Artist>Artist: ' + row.Artist + '</p><p class = Born>Artist Born-Died: ' + row.BornDied + '</p><p class = Technique>Technique: ' + row.Technique + '</p><p class = Location>Location: ' + row.Location + '</p><p class = Form>Form: ' + row.Form + '</p><p class = Type>Type: ' + row.Type + '</p><p class = School>School: ' + row.School + '</p><p class = Timeframe>Timeframe: ' + row.Timeframe + '</p>' ;
      console.log(artrecord[i]);
     result += artrecord[i] + '<p><button class ="list-add-button" data-id="'+ i + '">Add painting to favorites</button>';
     result += '<div class="scrollabletextbox" id="message""></div><span id="chatinput"><textarea id="message" class="form-control" rows="1" cols="60" placehold="message"></textarea><br/><input type="button" value="send" id="send-btn"></p> </span>';
     result += "<hr>";
     i++;
     //need to add in artrecord for choosing favorites
    })
    result += '</div>';
    $(result).appendTo('#results');
    console.log($(".list-add-button").length);
    $(".list-add-button").click(function(){
     console.log("favorite button clicked");
     var elmid=$(this).attr("data-id");
     console.log(elmid);
     addfavorite(artrecord[elmid]);
    });
}
}
}
//shows error
function displayError(error) {
    console.log('Error ${error}');
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
	rows = JSON.parse(results);
	var result;
        rows.forEach(function(row){
	 result += row.artpiece;
	})
	$(result).appendTo('#user-favs');
}
