const port='9019'
const Url = "http://jimskon.com:"+port
var operation;
var selectID;
var recIndex;
var rows;
var webPage="Login";
var sqlTable ="art.sql";
var saveRecord;

$(document).ready(function () {
  /*$(".btn-login").click( {
    sqlTable="userinfo.sql"
  });*/
  $("#art-search").click(getMatches);
 // changeoperation(operation);
 /* $(".btn-login").click(getMatches);

  $(".btn-createaccount").click(makeAccount);
*/
  $(".dropdown-menu li a").click(function(){
    $(this).parents(".btn-group").find('.selection').text($(this).text());
    operation=$(this).text().split(" ").pop();  // Get last word
    });
});

function getMatches() {
  console.log("GetMatches:"+sqlTable);
 /* if(sqlTable=="User Info") {
    if("#usernaem-login").length()>1{
      var username = $("#username-login").val();
      var password = $("#password-login").val();
      var search = username+" "+password; }
    else
      var search = $("#user-search-input").val();
  }
  else if(sqlTable=="Art") {
    var search = $("#art-search-input").val();
  }*/
  var search = $("#art-search-input").val();
  $.ajax({
    url: Url+'/find?field='sqlTable+'&search'=search;
    type:"GET",
    success: processResults,
    error:displayError
  })
}


function pageChange(webPage) {
/*  if(webPage=="Login") {
    //login page functions will show
}*/
  if(webPage=="Main") {
    //main page functions wiill show
  }
  if(webPage=="ArtSeach") {
    //Art Results pages will show
  }
}
function errorText() {
  $("#modal-login-text").hide();
  $("#modal-login-error-text").show();
}
function processResults(results) {
  if(results=="") {
   errorText();
  }
  else {
    ('#modal').modal('hide');
  }

}

function buildTable(data) {
    rows=JSON.parse(data);
    if (rows.length < 1) {
	return "<h3>Nothing Found</h3>";
    } else {
	var result = '<table class="w3-table-all w3-hoverable" border="2"><tr><th>Title</th><th>Author</th><th>Form</th><th>Type</th><th>URL</th><tr>';
	var i=0
	rows.forEach(function(row) {
	    result += "<tr><td class='title'>"+row.Title+"</td><td class='author'>"+row.Author+"</td><td class='form'>"+row.Form+"</td><td class='type'>"+row.Type+"</td><td class ='url'>"+row.URL+"</td>";
	    i++;
	})
	result += "</table>";

	return result;
    }
}

function clearResults(){
	$('#searchresults').empty();
}
