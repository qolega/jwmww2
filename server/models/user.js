// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({ 
    password: String, 
    email: String,
    admin: { type: Boolean, default: false } 
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', userSchema);