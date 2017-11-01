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
	},

	notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

module.exports = mongoose.model("Article", ArticleSchema);