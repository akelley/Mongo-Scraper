var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	headline: {
		type: String,
		trim: true
	},

	link: {
		type: String,
		trim: true
	},

	summary: {
		type: String,
		trim: true
	},

	details: {
		type: String,
		trim: true
	},

	saved: {
		type: Boolean
	}
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;