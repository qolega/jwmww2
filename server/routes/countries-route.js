var express = require('express');
var router = express.Router();
var Model = require('../models/country-model');

router.get('/countries', function(req, res) {
    
    Model.find().
    sort({ name: 1 }).
    exec(function(err, countries) {
        if (err) {
            console.log(err);
            res.status(500).send({ 
                success: false, 
                message: 'oops something went wrong!'
            });
        }
        
        res.json(countries);
    })
});

module.exports = router;
