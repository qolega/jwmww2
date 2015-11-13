var mongoose = require('mongoose');
var fs = require('fs');

// Database
var config = require('../server/config/config');  // load the database config
mongoose.connect(config.url);

var WarriorModel = require('../server/models/warrior');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    
    console.log('connected to DB.')
    
    var warriors = [];
    
    WarriorModel.remove(function(err) {
       if (err) {
           throw err;
       } 
    });
    
    var rl = require('readline').createInterface({
      input: require('fs').createReadStream('./warriors.json')
    });
    
    rl.on('close', function() {
      console.log('Readline closed.');
      
      WarriorModel.collection.insert(warriors, function(err, docs) {
        if (err) {
            throw err;
        } else {
            console.info('%s warriors were successfully stored.', docs.length);
        }  
        
        process.exit(0);
      });
      
      
    });
    
    var i = 1;
    
    rl.on('line', function (line) {
        
        var warrior = JSON.parse(line);
        /*warrior.images.forEach(function(image) {
            console.log('about to read image - ' + image.src);
           image.data = fs.readFileSync(image.src); 
           image.contentType = 'image/' + image.src.substr(image.src.length - 3, image.src.length);
        });*/
        
        warriors.push(warrior);
        
        //console.log('Parsed line ', i++);
        
    });
    
});

