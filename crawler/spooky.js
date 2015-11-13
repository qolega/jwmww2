try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}

var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            var e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }
        
        var soldierLinksOnClickAttrib = [];
        var pagesLinktsHrefAttrib = [];

        spooky.start(
            'http://www.jwmww2.org/JewishFighters/Display/SearchResults.aspx?fName=&lName=&army=&cat=&partizans=&division=');
            
        spooky.then(function() {
            
            function getLinkAttribs(selector, attrib) {
                var links = document.querySelectorAll(selector);
                return Array.prototype.map.call(links, function(e) {
                    return e.getAttribute(attrib);
                });
            };
            
            function getSoldierValues() {
                var soldier = {};
                soldier.first_name = document.querySelector('span[id$="FirstName"]').innerHTML;
                soldier.last_name = document.querySelector('span[id$="LastName"]').innerHTML;
                soldier.army_name = document.querySelector('input[name$="txtArmy"]').getAttribute('value');
                return soldier;
            };
        
            soldierLinksOnClickAttrib = this.evaluate(getLinkAttribs, 'a.label', 'onclick');
            pagesLinktsHrefAttrib = this.evaluate(getLinkAttribs, 'a[href*=Page]', 'href')    
        });
        
        spooky.then(function () {
            this.emit('message', ' - ' + soldierLinksOnClickAttrib.join('\n - '));
        });
        /*spooky.then(function () {
            this.emit('hello', 'Hello, from ' + this.evaluate(function () {
                return document.title;
            }));
        });*/
        spooky.run();
    });

spooky.on('error', function (e, stack) {
    console.error(e);

    if (stack) {
        console.log(stack);
    }
});

/*
// Uncomment this block to see all of the things Casper has to say.
// There are a lot.
// He has opinions.
spooky.on('console', function (line) {
    console.log(line);
});
*/

spooky.on('message', function (greeting) {
    console.log(greeting);
});

spooky.on('log', function (log) {
    if (log.space === 'remote') {
        console.log(log.message.replace(/ \- .*/, ''));
    }
});