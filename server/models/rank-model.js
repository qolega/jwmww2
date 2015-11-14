var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({ 
    name: String
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Rank', schema);
