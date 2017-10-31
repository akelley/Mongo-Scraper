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
				data[i]._id + "'>Delete</button></h3><h5>" + data[i].summary + "</h5></div>");
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



