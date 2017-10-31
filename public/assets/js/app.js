$(document).on("click", ".scraped", function(){
  $.get("/scrape", function (data) {
  }).then(function(data) {
  	console.log(data);
  	if(data){
  		alert("You have scraped " + data.length + " articles!");
  	}
  	if(data == null) {
  		alert("You have already scraped today.");
  	}
    
  });
});

$(document).on("click", ".home", function(){
	$("div#articles").html("");

  $.get("/articles", function (data) {
  }).then(function(data) {
  	console.log(data);
    for (var i = 0; i < data.length; i++) {
			$("#articles").append("<div data-id='" + data[i]._id + "'><h3><a href='" + data[i].link + 
			"' target='_blank'>" + data[i].headline + "</a><button class='marksaved' data-id='" + 
			data[i]._id + "'>Save</button></h3><h5>" + data[i].summary + "</h5></div>");
		}
  });
});

$(document).on("click", ".marksaved", function() {
  var thisId = $(this).attr("data-id");
  var headline = $(this).attr("headline");
  var link = $(this).attr("link");
  var summary = $(this).attr("summary");
  
  $.ajax({
    method: "POST",
    url: "/marksaved/" + thisId,
    data: {
      headline: headline,
      link: link,
      summary: summary
    }
  })
    .done(function(data) {
    	$("div").filter("[data-id='" + thisId + "']").remove();
      console.log(data);
    });
});

$(document).on("click", ".saved", function() {
  $("div#articles").html("");
  
  $.get("/saved", function(data){
	  }).then(function(data){
	  	console.log(data);
	  	for (var i = 0; i < data.length; i++) {
				$("#articles").append("<div data-id='" + data[i]._id + "'><h3><a href='" + data[i].link + 
				"' target='_blank'>" + data[i].headline + "</a><button class='markunsaved' data-id='" + 
				data[i]._id + "'>Delete</button><button class='checknotes' data-toggle='modal' data-target='#myModal' data-id='" + 
				data[i]._id + "'>Check Notes</button></h3><h5>" + data[i].summary + "</h5></div>");
			}
	  });
});

$(document).on("click", ".markunsaved", function() {
  var thisId = $(this).attr("data-id");
  var headline = $(this).attr("headline");
  var link = $(this).attr("link");
  var summary = $(this).attr("summary");
  
  $.ajax({
    method: "POST",
    url: "/markunsaved/" + thisId,
    data: {
      headline: headline,
      link: link,
      summary: summary
    }
  })
  .done(function(data) {
  	$("div").filter("[data-id='" + thisId + "']").remove();
    console.log(data);
  });
});

$(document).on("click", ".checknotes", function() {
  var thisId = $(this).attr("data-id");
  $("#newNote").val("");

  $.ajax({
    method: "GET",
    url: "/notes/" + thisId
  })
  .done(function(data) {
    console.log(data);
    $("h4.modal-title").html("");
    $("h4.modal-title").attr("data-id", thisId);
    $("h4.modal-title").append("Notes for Articles: " + thisId);
    for (var i = 0; i < data.length; i++) {
      $("h4.modal-title").append("<div class='articlenote'  data-id='" + data[i]._id + "''>" + data[i].body + "<button class='deletenote btn-warning btn-sm' data-id='" + 
        data[i]._id + "'>Delete</button></div>");
    };
  });
});

$(document).on("click", ".savenote", function() {
  var thisId = $("h4.modal-title").attr("data-id");
  var body = $("#newNote").val();

  if(body != ""){
    $.ajax({
      method: "POST",
      url: "/notes/", 
      data: {
        id: thisId,
        body: body
      }
    })
    .done(function(data) {
      $('#myModal').modal('toggle');
    });
  }

  else {
    $('#myModal').modal('toggle');
  }

});

$(document).on("click", ".deletenote", function() {
  var thisId = $("h4.modal-title").attr("data-id");
  var body = $("div.articlenote").val();
  console.log("body: " + thisId);

  $.ajax({
    method: "POST",
    url: "/removenote/" + thisId, 
    data: {
      id: thisId,
      body: body
    }
  })
  .done(function(data) {
    $("h4.modal-title").html("");
    $("h4.modal-title").attr("data-id", thisId);
    $("h4.modal-title").append("Notes for Articles: " + thisId);
  });
});
