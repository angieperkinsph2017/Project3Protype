const port='9019'
const Url ='http://jimskon.com:'+port
var operation;
var selectID;
var recIndex;
var rows;
var sqlTable ="art.sql";
var saveRecord;
var isSelf = true; //for searching users, tells if it is self user or not;

$(document).ready(function () {
    $(".modal").show();
    $(".signup-modal").hide();
    $(".user-profile").hide();
    $(".search-option").hide();
    $(".btn-createaccount").click(createAccount);

    console.log("ready");
    operation = "Artist";//default
    $("#user-search").click(getList);
    $(".btn-login").click(getList);



  $(".dropdown-menu li a").click(function(){
    $(this).parents(".btn-group").find('.selection').text($(this).text());
    operation=$(this).text().split(" ").pop();  // Get last word
    console.log(operation)
  });
  $("#art-search").click(getMatches);
  $(".art-search-input").keyup(function(e){
    getMatches();
  });

});

function getMatches() {//if set on one function pass sqlTable to this
  //basically gutted this for demo, we can implement later
  //need a way to differentiate between tables, but cannot call in doc .ready with sql name or else wont search properly
  //may be worth writing a seperate one for user/password

  //for dual purpse:
  /*if(sqlTable=="Userinfo") {
    if("#username-login").length()>1{
      var username = $("#username-login").val();
      var password = $("#password-login").val();
      var search = username+" "+password; }
    else
      var search = $("#user-search-input").val();
  }
  else */
  //if(sqlTable=="art") {
    sqlTable="art.sql";
    var search = $("#art-search-input").val();//sets search value
    $('#art-search-input').empty();
  //}
  $.ajax({
    url: Url+'/find?field='+operation+'&search='+search,//+'&sqlTable='+sqlTable, //is this how the find function works or should it be
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
   if($("#user-search-input").length>0) {
   search=$("#user-search-input").val();
   isSelf=false;
 } else
   search=$(".username-login").val();
   $.ajax({
     url: Url+'/list?search='+search,
     type:"GET",
     success: processResults,
     error:displayError
   })
   $('#results').append("this is working list");

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
   console.log($('#addusername').val()+$('#addpassword').val()+$('#addbiography').val()+ $('#addfavorites').val(),)
     $.ajax({
         url: Url+'/addrec?Username='+$('#addusername').val()+'&Password='+$('#addpassword').val()+'&Biography='+$('#addbiography').val()+'&FavoriteArtists=none&Picture=https://www.wga.hu/detail/a/aachen/allegory.jpg',
         type:"GET",
         success: processAdd,
         error: displayError
     }) //favorite artists and picture are fixed at an arbitrary value, this will be changed in the final product
 }
function processAdd() {
  console.log("Success: added to sql table");
  $(".signup-modal").hide();
  $(".search-option").show(); //user is now logged in and is able to search other users.
}
//outputs pictures after search
function processResults(results) {
  console.log(results);
  console.log(sqlTable);
  if(results=="") {
   errorText();
  }
  else if(sqlTable=="Userinfo.sql") {
    var userinfo = results.split(",");
    for (var i=0; i<userinfo.length; i++) {
      if(i == 0) {
        userinfo[i] = userinfo[i].replace('[{','');
      } else if (i == userinfo.length-1) {
        userinfo[i] = userinfo[i].replace('}]','');
      }
      userinfo[i]=userinfo[i].split('":"').pop();//removes column title from text
      for(var j=0; j<userinfo[i].length; j++) {
        userinfo[i][j]=userinfo[i][j].replace('""','');
      }
      console.log(userinfo[i]);
    }
    if(isSelf==true) {
      if($("#password-login").val()!=userinfo[1]) {
        $("#modal-login-error-text").show();
        return;
      } else {
      //$("#self-profile").show(); //features on user-profile only accessable if user page is self--Not in html yet
      }
    }

    $(".search-option").hide();
    $(".user-profile").show();
    $("#user-username").text(userinfo[0]);
    $("#user-biography").text(userinfo[2]);
    $(".favorite-artists").text(userinfo[3]);
    var picture = userinfo[5];
    $(`<img src='${picture}'>`).appendTo("#user-image");//sets profile image of users choice of painting.
  }
  else if (sqlTable=="art.sql"){

  $('#results').html("");//clears past searc results
  $('.search-option').show();
  rows=JSON.parse(results);
 var result = '<div class = artResults>';
 if (rows.length < 1) {
   result += "<h3>Nothing Found</h3>";
   console.log("Nothing Found");
 } else{
    result += '<h3>Results</h3>';
    var i=0;
    rows.forEach(function(row){
     result += `<img src='${row.URL}' class = 'URL'>` + '<p class=Title>Title: ' + row.Title + '</p><p class = Year>Year: ' + row.Year + '</p><p class = Artist>Artist: ' + row.Artist + '</p><p class = Born>Artist Born-Died: ' + row.BornDied + '</p><p class = Technique>Technique: ' + row.Technique + '</p><p class = Location>Location: ' + row.Location + '</p><p class = Form>Form: ' + row.Form + '</p><p class = Type>Type: ' + row.Type + '</p><p class = School>School: ' + row.School + '</p><p class = Timeframe>Timeframe: ' + row.Timeframe + '</p>';
     result += "<hr>";
     i++;
    })
   }
    result += '</div>';
    $(result).appendTo('#results');
} else {
    console.log(":(");
  }
}
//shows error
function displayError(error) {
    console.log('Error ${error}');
}
