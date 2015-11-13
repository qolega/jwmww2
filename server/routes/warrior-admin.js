var express = require('express');
var router = express.Router();
var Model = require('../models/warrior');

var overviewColumns = 'personal_information.first_name personal_information.last_name ' 
      + 'ww2.service_check ww2.service_country ' 
      + 'ww2.partisan_check ww2.partisan_country';

router.use('/admin', function (req, res, next) {
    
        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated()) {
            return next();
        }
            
        // if they aren't redirect them to the home page
        res.json({ redirect : '/admin/login'});
    }
);


router.get('/admin/warrior', function(req, res) {
    
    var limit = req.query.limit ? req.query.limit : 20;
    var page = req.query.page ? req.query.page : 1;
    
    Model.paginate({
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

router.get('/admin/warrior/search/:query', function(req, res) {
    
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

router.put('/admin/warrior/publish/:id', function(req, res) {
    
    Model.findById(req.params.id, 
        function(err, warrior) {
            
            if(err) {
                res.send(err);    
            }
            
            if (warrior) {
                warrior.approved = true;
                warrior.save(function(err) {
                    
                    if(err) {
                        res.send(err);    
                    }    
                    
                    Model.find({ approved: false },
                        function(err, warriors) {
                            if (err) {
                                res.send(err)   
                            }
                            res.json(warriors); 
                    });
                });    
            }
    });
});

router.delete('/admin/warrior/:id', function(req, res) {
    
    Model.remove({
        _id : req.params.id
    }, function(err, warrior) {
        
        if(err) {
            res.send(err);    
        }
        
        Model.find({ approved: false }, function(err, warriors) {
            if (err) {
                res.send(err)   
            }
            res.json(warriors); // return all todos in JSON format
        });
    });
});

module.exports = router;
