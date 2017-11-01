var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema ({
	id: {
		type: String
	},

	body: {
		type: String
	}
});

module.exports = mongoose.model('Note', NoteSchema);