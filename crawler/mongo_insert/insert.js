var mongoose = require('mongoose');
var fs = require('fs');

// Database
var config = require('../../server/config/config');  // load the database config
mongoose.connect(config.url);

var model = require('../../server/models/rank-model');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    
    console.log('connected to DB.')
    
    model.remove(function(err) {
       if (err) {
           throw err;
       } 
    });
    
    fs.readFile('../data/rank.json', 'utf8', function (err,data) {
        
        if (err) {
            throw err;
        }
        
        var items = JSON.parse(data);
        console.log('Found %d items', items.length);
        
        model.collection.insert(items, function(err, docs) {
            if (err) {
                throw err;
            } else {
                console.info('%d items were successfully stored.', docs.result.n);
            }  
        
            process.exit(0);
        });
    });
    
    
});

