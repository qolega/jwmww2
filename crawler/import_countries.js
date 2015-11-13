var mongoose = require('mongoose');
var fs = require('fs');

// Database
var config = require('../server/config/config');  // load the database config
mongoose.connect(config.url);

var countryModel = require('../server/models/country-model');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    
    console.log('connected to DB.')
    
    var countries;
    
    countryModel.remove(function(err) {
       if (err) {
           throw err;
       } 
    });
    
    var rl = require('readline').createInterface({
      input: require('fs').createReadStream('./data/countries.json')
    });
    
    rl.on('line', function (line) {
        
        countries = JSON.parse(line);
        /*warrior.images.forEach(function(image) {
            console.log('about to read image - ' + image.src);
           image.data = fs.readFileSync(image.src); 
           image.contentType = 'image/' + image.src.substr(image.src.length - 3, image.src.length);
        });*/
        
        console.log('Found %d countries', countries.length);
    });
    
    rl.on('close', function() {
      console.log('Readline closed.');
      
      countryModel.collection.insert(countries, function(err, docs) {
        if (err) {
            throw err;
        } else {
            console.info('%d countries were successfully stored.', docs.result.n);
        }  
        
        process.exit(0);
      });
    });
});

