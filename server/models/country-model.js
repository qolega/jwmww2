var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countrySchema = new Schema({ 
    name: String
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Country', countrySchema);
