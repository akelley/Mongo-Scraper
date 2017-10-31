var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var request = require('request');
var cheerio = require('cheerio');

var Article = require("./models/Article.js");
var Note = require('./models/Note.js');

var app = express();

app.use(logger("dev"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
	extended: false
}));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var Promise = require('bluebird');
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
var db = mongoose.connection;

app.get("/", function(req, res) {
  res.render("index");
});

var lastScraped = "";
app.get("/scrape", function(req, res) {
	var date = new Date();
	var today = date.getDay();
	
	if(lastScraped != today){
		request("http://www.nytimes.com", function(error, response, html) {
		  var $ = cheerio.load(html);
		  var results = [];

	  	var lastScrapedDate = new Date();
			lastScraped = lastScrapedDate.getDay();

			$("article.story.theme-summary").each(function(i, element) {
		  	var result = {};
		    var headline = $(this).children(".story-heading").children("a").text().trim();
		    var link = $(this).children(".story-heading").children("a").attr('href');
		    var summary = $(this).children("p.summary").text().trim();
		    var details = $(this).children("p.byline").text();
		    
		    if(headline && link && summary){
		    	result.headline = headline;
		    	result.link = link;
		    	result.summary = summary;
		    	result.saved = false;
		    	
		    	if(details){
		    		result.details = details;
		    	}

		    	results.push(result);
		    }		
		  });

	    Article.create(results).then(function(dbArticles) {
	      res.json(dbArticles);
	    })
	    .catch(function(err) {
	      res.json(err);
	    });
		});
	}
	else {
		res.json(null);
	}
});

app.get("/articles", function(req, res) {
  Article.find({ "saved": false }).then(function(dbArticles) {
      res.json(dbArticles);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/saved", function(req, res) {
  Article.find({ "saved": true }, function(error, dbArticles) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(dbArticles);
    }
  });
});

app.post("/marksaved/:id", function(req, res) {
  Article.update({_id: req.params.id }, 
  	{ $set: {saved: true}
  })
  .then(function(dbArticle) {
      res.json(dbArticle);
    })
  .catch(function(err){
      res.json(err);
  });
});

app.post("/markunsaved/:id", function(req, res) {
  Article.update({_id: req.params.id }, 
  	{ $set: {saved: false}
  })
  .then(function(dbArticle) {
      res.json(dbArticle);
    })
  .catch(function(err){
      res.json(err);
  });
});





// app.post("/articles/:id", function(req, res) {
//   Note.create(req.body).then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

var PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
	console.log("App listening on port number " + PORT + "...");
});