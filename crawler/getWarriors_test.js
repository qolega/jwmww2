
var casper = require('casper').create({
    clientScripts: ["includes/utils.js"]
});
var fs = require('fs');

var outputFileName = 'warriors.json';

var soldierLinksOnClickAttrib = [];
var pagesLinktsHrefAttrib = [];

function getLinkAttribs(selector, attrib) {
    
    var links = document.querySelectorAll(selector);
    
    return Array.prototype.map.call(links, function(e) {
        return e.getAttribute(attrib);
    });
}

function getSoldierValues() {

    var soldier = {};
    
    soldier.first_name = document.querySelector('span[id$="FirstName"]').innerHTML;
    soldier.last_name = document.querySelector('span[id$="LastName"]').innerHTML;
    soldier.army_name = document.querySelector('input[name$="txtArmy"]').getAttribute('value');
    
    return soldier;
}

casper.start('http://www.jwmww2.org/JewishFighters/Display/SearchResults.aspx?fName=&lName=&army=&cat=&partizans=&division=');

casper.then(function() {
    soldierLinksOnClickAttrib = this.evaluate(getLinkAttribs, 'a.label', 'onclick');
    pagesLinktsHrefAttrib = this.evaluate(getLinkAttribs, 'a[href*=Page]', 'href')
});

function extractSoldier(element) {
    casper.then(function() {
        this.click('a[onclick="' + element + '"]');
    });
    
    casper.then(function() {
        var soldier = this.evaluate(getSoldierValues); 
        
        fs.write(outputFileName, JSON.stringify(soldier) + '\n', 'a');
    });
    
    casper.back();    
}

// extract from first navigation
casper.then(function() {
    soldierLinksOnClickAttrib.forEach(extractSoldier);    
});

function navigateToPage(element) {
    casper.then(function() {
        this.click('a[href="' + element + '"]');
    });
    
    casper.then(function() {
        soldierLinksOnClickAttrib = this.evaluate(getLinkAttribs, 'a.label', 'onclick');
    });
    
    casper.then(function() {
        soldierLinksOnClickAttrib.forEach(extractSoldier);    
    });
};

casper.then(function() {
    //pagesLinktsHrefAttrib.forEach(navigateToPage);
});

casper.run(function() {
    this.exit();
});