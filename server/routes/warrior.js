var express = require('express');
var router = express.Router();
var Model = require('../models/warrior');

var overviewColumns = 'personal_information.first_name personal_information.last_name ' 
      + 'ww2.service_check ww2.service_country ' 
      + 'ww2.partisan_check ww2.partisan_country';

router.get('/warrior', function(req, res) {
    
    var limit = req.query.limit ? req.query.limit : 20;
    var page = req.query.page ? req.query.page : 1;
    
    Model.paginate({
        approved: true
    },{
      page: page, 
      limit: limit,
      columns: overviewColumns
    }, 
    function(err, items, pageCount, itemCount) {
        if (err) {
            res.send(err.message)   
        }
        var result = {}
        result.itemCount = itemCount;
        result.items = items;
        res.json(result); 
    });
});

router.get('/warrior/search/:query', function(req, res) {
    
    var limit = req.query.limit ? req.query.limit : 20;
    var page = req.query.page ? req.query.page : 1;
    
    var queryList = req.params.query.split(" ");
    var queryAndList = [];
    queryList.forEach(function(e) {
        var queryOrList = [];
        var re = new RegExp(e, 'i');   
        queryOrList.push({'personal_information.first_name' : { $regex: re }});
        queryOrList.push({'personal_information.last_name' : { $regex: re }});
        queryOrList.push({'ww2.partisan_country' : { $regex: re }});
        queryOrList.push({'ww2.service_country' : { $regex: re }});
        
        queryAndList.push({ $or: queryOrList });
        
    })
    
    Model.paginate({
        approved: true,
        $and: queryAndList
    },{
      page: page, 
      limit: limit,
      columns: overviewColumns
    }, 
    function(err, items, pageCount, itemCount) {
        if (err) {
            res.send(err.message)   
        }
        var result = {}
        result.itemCount = itemCount;
        result.items = items;
        res.json(result); 
    });
});


router.get('/warrior/:id', function(req, res) {
    
    Model.findById(req.params.id,
    
    function(err, warrior) {
        
        if(err) {
            res.send(err);    
        }
        res.json(warrior);
    });
})

router.post('/warrior', function(req, res) {
    
    Model.create({
        'personal_information.first_name' : req.body.first_name,
        'personal_information.last_name' : req.body.last_name,
        //army_name : req.body.army_name,
        //army_id : req.body.army_id ,
        // needs to be approved by admin
        approved : false 
    }, function(err, warrior) {
        
        if(err) {
            res.send(err);    
        }
        
        res.sendStatus(200)
    });
});

module.exports = router;
