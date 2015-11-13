var url = 'http://www.jwmww2.org/';

var casper = require('casper').create({
    // inject utils to page
    clientScripts: ["./includes/utils.js"]
    //,verbose: true
    //,logLevel: 'debug'
});

    
var fs = require('fs');
// import utils to casper
var utils = require("./includes/utils");

var errorsLog = 'warriors_witherrors.json';
var outputFileName = 'warriors.json';

cleanWorkingDirectory();


var soldierLinksOnClickAttrib = [];
var pagesLinktsHrefAttrib = [];

function getSoldierDetails(soldier) {

    // first page - soldier details
    soldier.personal_information = {};
    soldier.personal_information.first_name = document.querySelector('input[id$="txtFirstNameHeb"]').getAttribute('value');
    soldier.personal_information.last_name = document.querySelector('input[id$="txtFamilyHeb"]').getAttribute('value');
    
    soldier.death_details = {};
    soldier.death_details.death_cause = utils.getAttribBySelector('input[id$="txtDeathRemarks"]', 'value');
    
    soldier.categories = utils.getAttribsBySelector('span[id$="lblCat"]');
    
    return soldier;
}

function getSoldierWW2Details(soldier) {
    
    soldier.ww2 = {};
    soldier.ww2.partisan_check = utils.getIsCheckedBySelector('input[id$="chkForests"]');
    soldier.ww2.partisan_country = utils.getDropDownSeleced('select[id$="ddlForests"]');
    soldier.ww2.service_check = utils.getIsCheckedBySelector('input[id$="chkRegularService"]');
    soldier.ww2.service_country = utils.getDropDownSeleced('select[id$="ddlServiceCountry"]');
    
    soldier.battles = [];
    var battles = document.querySelectorAll('table[id$="GridViewBattles"] tr');
    for (var i = 1; i < battles.length; i++) { 
       var battle = {};
       battle.soldier_rank = battles[i].querySelector('span[id$="degreeLabel"]').innerHTML;
       battle.soldier_role = battles[i].querySelector('span[id$="roleLabel"]').innerHTML;
       battle.operation = battles[i].querySelector('span[id$="battleLabel"]').innerHTML;
       battle.date = battles[i].querySelector('span[id$="battleDateLabel"]').innerHTML;
       battle.medal = battles[i].querySelector('span[id$="medalLabel"]').innerHTML;
       battle.details = battles[i].querySelector('span[id$="remarksLabel"]').innerHTML;
       soldier.battles.push(battle);
    }
    
    return soldier;
}

function getSoldierImages(soldier) {
    
    soldier.images = [];
    var images = document.querySelectorAll('table[id$="gvPictures"] tr');
    for (var i = 1; i < images.length; i++) {
        var image = {};
        image.title = images[i].querySelector('span[id$="lblTitle"]').innerHTML;
        image.src = images[i].querySelector('img').getAttribute('src').trim();
        if (image.src.indexOf('../../') === 0) {
            image.src = image.src.substring('../../'.length, image.src.length);
        }
        soldier.images.push(image);
    }
    
    return soldier;
}

casper.start('http://www.jwmww2.org/jewishFighters/Manage/Login.aspx', function() {
    this.fill('form[action="Login.aspx"]', { 
        txtusername: 'admin',
        txtpassword: 'admin'
    });
    this.click('input[type="submit"]');
});

casper.then(function() {
    soldierLinksOnClickAttrib = this.evaluate( utils.getAttribsBySelector, 'a.label', 'onclick');
    pagesLinktsHrefAttrib = this.evaluate( utils.getAttribsBySelector, 'a[href*=Page]', 'href');
});

function extractSoldier(element) {
    
    var soldier = {};
    
    casper.then(function() {
        this.click('a[onclick="' + element + '"]');
    });
    
    casper.then(function() {
        soldier = this.evaluate(getSoldierDetails, soldier); 
    });
    /*
    casper.then(function() {
        this.click('input[id$="btnWarTwo"]');
    });
    
    casper.then(function() {
        soldier = this.evaluate(getSoldierWW2Details, soldier); 
    });
    
    casper.then(function() {
        casper.back();
    });
    
    casper.then(function() {
        this.click('input[id$="btnUploadImg"]');
    });
    
    casper.then(function() {
        soldier = this.evaluate(getSoldierImages, soldier);
    });
    
    casper.then(function() {
        this.back();
    });
    
    casper.then(function() {
        soldier.images.forEach(function(image) {
            // create local path to save image
            var imagepath = makeDirectoryForImagePath(image.src);
            console.log('downloading: path - ' + url + image.src + '; file path - ' + imagepath);
            casper.download(url + image.src, imagepath);      
        });
    });
    */
    
    
    
    
    casper.then(function() {
        this.echo(JSON.stringify(soldier) + '\n');   
        fs.write(outputFileName, JSON.stringify(soldier) + '\n', 'a');
    });
    
    casper.then(function() {
        casper.back();
    });
}

// extract from first navigation
casper.then(function() {
    soldierLinksOnClickAttrib.forEach(extractSoldier);
    //extractSoldier(soldierLinksOnClickAttrib[0]);
});

function navigateToPage(element) {
    casper.then(function() {
        this.click('a[href="' + element + '"]');
    });
    
    casper.then(function() {
        soldierLinksOnClickAttrib = this.evaluate(utils.getAttribsBySelector, 'a.label', 'onclick');
    });
    
    casper.then(function() {
        soldierLinksOnClickAttrib.forEach(extractSoldier);    
    });
};

casper.then(function() {
    pagesLinktsHrefAttrib.forEach(navigateToPage);
});

casper.on('remote.message', function(msg) {
  this.echo(msg);
})

casper.on('error', function(msg,backtrace) {
  this.capture('./out/error.png');
  this.echo('msg: ' + msg);
  this.echo('backtrace: ' + backtrace);
  //throw new ErrorFunc("fatal","error","filename",backtrace,msg);
});

casper.on( 'page.error', function (msg, trace) {
    // ignore export variable from page
    if (msg === "ReferenceError: Can't find variable: exports") {
        return;
    }
    this.echo( 'Error: ' + msg, 'ERROR' );
    fs.write(errorsLog, JSON.stringify('Error: ' + msg) + '\n', 'a');
});

casper.run(function() {
    this.exit();
});


function makeDirectoryForImagePath(imagePath) {
    imagePath = imagePath.trim();
    var fileSplit = imagePath.split('/');
    var fullPath = ".";
    for (var i = 0; i < fileSplit.length-1; i++) {
        
        if (fileSplit[i] === '..') {
            continue;
        }
        
        fullPath += '/' + fileSplit[i]
        
        if(!fs.exists(fileSplit[i])) {
            fs.makeDirectory(fullPath);
        }
    }
    
    fullPath += '/' + fileSplit[fileSplit.length-1];
    
    return fullPath;
}

function cleanWorkingDirectory() {
    if (fs.exists(errorsLog)) {
        fs.remove(errorsLog);
    }
    
    if (fs.exists(outputFileName)) {
        fs.remove(outputFileName);    
    }
    
    
    fs.removeTree('vf');    
}