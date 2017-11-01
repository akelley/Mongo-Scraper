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
app.use(bodyParser.urlencoded({	extended: false }));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);


// make dat connection
var PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
  console.log("App listening on port number " + PORT + "...");
});


// load index.handlebars file 
app.get("/", function(req, res) {
  res.render("index");
});


// main SCRAPE function
app.get("/scrape", function(req, res) {
  var counter = 0;
  request("http://www.nytimes.com", function(error, response, html) {
    var $ = cheerio.load(html);

    $("article.story.theme-summary").each(function(i, element) {
      var result = {};

      result.headline = $(this).children(".story-heading").children("a").text().trim();
      result.link = $(this).children(".story-heading").children("a").attr('href');
      result.summary = $(this).children("p.summary").text().trim();
      result.details = $(this).children("p.byline").text();
      result.saved = false;

      if(result.headline && result.link && result.summary){
        counter++;
        Article.create(result).then(function(dbArticle) {
          res.send("Number of scraped articles: " + counter);
        }).catch(function(err) {
          res.json(err);
        });
      }
    });
    //console.log("Number of scraped articles: " + counter);
  });
});


// get all UNSAVED articles
app.get("/articles", function(req, res) {
  Article.find({ "saved": false }).then(function(dbArticles) {
    res.json(dbArticles);
  })
  .catch(function(err) {
    res.json(err);
  });
});


// get all SAVED articles
app.get("/saved", function(req, res) {
  Article.find({ "saved": true }).then(function(dbArticles) {
    res.json(dbArticles);
  })
  .catch(function(err){
    res.json(err);
  });
});


// mark an article as SAVED
app.post("/save/:id", function(req, res) {
  Article.update({_id: req.params.id },{ $set: {saved: true}}).then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});


// mark an article as UNSAVED
app.post("/unsave/:id", function(req, res) {
  Article.update({_id: req.params.id },{ $set: {saved: false}}).then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});


// GET all NOTEs associated with an article
app.get("/notes/:id", function(req, res) {
  Article.find({ _id: req.params.id }).populate("notes")
    .then(function(dbNotes) {
      res.json(dbNotes);
    })
    .catch(function(err) {
      res.json(err);
    });
});


// CREATE a new NOTE
app.post("/notes/:id", function(req, res) {
  Note.create(req.body).then(function(dbNote) {
    // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    return Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
  })
  .then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});


// DELETE note 
app.post("/deletenote/:id", function(req, res) {
  Note.remove({	_id: req.params.id}).then(function(dbNote) {
    res.json(dbNote);
  })
  .catch(function(err) {
    res.json(err);
  });
});