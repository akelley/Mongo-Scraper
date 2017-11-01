// when click on SCRAPE, scrape that puppy!
$(document).on("click", ".scraped", function(){
  $.get("/scrape", function (data) {
  }).then(function(data) {
  	console.log(data);
  	alert(data); 
  });
});


// when click on HOME link, get all UNSAVED articles
$(document).on("click", ".home", function(){
	$("div#articles").html("");

  $.get("/articles", function (data) {
  }).then(function(data) {
  	//console.log(data);
    for (var i = 0; i < data.length; i++) {
      // Article ID number attached to DIV and SAVE button
			$("#articles").append("<div data-id='" + data[i]._id + "'><h3><a href='" + 
      data[i].link + "' target='_blank'>" + data[i].headline + "</a><button class='save' data-id='" + 
			data[i]._id + "'>Save</button></h3><h5>" + data[i].summary + "</h5></div>");
		}
  });
});


// when click on SAVED link, get all UAVED articles
$(document).on("click", ".saved", function() {
  $("div#articles").html("");
  
  $.get("/saved", function(data){
    }).then(function(data){
      //console.log(data);
      for (var i = 0; i < data.length; i++) {
        // Article ID number attached to DIV, UNSAVE and CHECKNOTES buttons
        $("#articles").append("<div data-id='" + data[i]._id + "'><h3><a href='" + data[i].link + 
        "' target='_blank'>" + data[i].headline + "</a><button class='unsave' data-id='" + 
        data[i]._id + "'>Unsave</button><button class='checknotes' data-toggle='modal' data-target='#myModal' data-id='" + 
        data[i]._id + "'>Check Notes</button></h3><h5>" + data[i].summary + "</h5></div>");
      }
    });
});


// when click on a SAVE button
$(document).on("click", ".save", function() {
  var thisId = $(this).attr("data-id"); // get article ID number
  
  $.ajax({
    method: "POST",
    url: "/save/" + thisId
  }).done(function(data) {
  	$("div").filter("[data-id='" + thisId + "']").remove();
  });
});


// when click on a UNSAVE button
$(document).on("click", ".unsave", function() {
  var thisId = $(this).attr("data-id"); // get article ID number
  
  $.ajax({
    method: "POST",
    url: "/unsave/" + thisId
  }).done(function(data) {
    $("div").filter("[data-id='" + thisId + "']").remove();
  });
});


// when click on a CHECKNOTES button
$(document).on("click", ".checknotes", function() {
  var thisId = $(this).attr("data-id");
  $("#newNote").val("");

  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
  .done(function(data) {
    $("h4.modal-title").html("");
    $("h4.modal-title").attr("data-id", thisId);
    $("h4.modal-title").append("Notes for Article: " + thisId);
    
    for (var i = 0; i < data[0].notes.length; i++) {
      // the note DIV and DELETE button both have NOTE ID number
      $("h4.modal-title").append("<div class='articlenote' data-id='" + data[0].notes[i]._id + "'>" + 
        data[0].notes[i].body + "<button class='deletenote btn-warning btn-sm' data-id='" + 
        data[0].notes[i]._id + "'>Delete</button></div>");
    };
  });
});


// when click on a SAVENOTE button
$(document).on("click", ".savenote", function() {
  var thisId = $("h4.modal-title").attr("data-id"); 
  var body = $("#newNote").val();

  if(body != ""){
    $.ajax({
      method: "POST",
      url: "/notes/" + thisId, 
      data: {
        body: body
      }
    })
  }

  $('#myModal').modal('toggle');
});


// when click on a DELETENOTE button
$(document).on("click", ".deletenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/deletenote/" + thisId
  })

  $('#myModal').modal('toggle');
});
