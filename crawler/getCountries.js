var casper = require('casper').create({
    // inject utils to page
    clientScripts: ["./includes/utils.js"]
    //,verbose: true
    //,logLevel: 'debug'
});


var fs = require('fs');
// import utils to casper
var utils = require("./includes/utils");


var siteUrl = 'http://www.jwmww2.org/';
var manageUrl = siteUrl + 'jewishFighters/Manage/'; //PersonalManage
var sufixUrl = '.aspx?id=';

function getFullUrl(page, soldierId) {
    return manageUrl + page + sufixUrl + soldierId;
}

var errorsLog = './data/countries_witherrors.json';
var outputFileName = './data/countries.json';

cleanWorkingDirectory();

var warriorIds;

casper.start('http://www.jwmww2.org/jewishFighters/Manage/Login.aspx', function() {
    this.fill('form[action="Login.aspx"]', {
        txtusername: 'admin',
        txtpassword: 'admin'
    });
    this.click('input[type="submit"]');
});

casper.then(function() {
    warriorIds = JSON.parse(fs.read('./data/warriors_id.json'));
});


function extractCountry(soldierId) {

    var countries = {};

    console.log('about to navigate to: ' + getFullUrl('PersonalManage', soldierId));

    casper.thenOpen(getFullUrl('PersonalManage', soldierId), function() {
        countries  = this.evaluate(function() {
            return utils.getAttribsBySelector('select[id$="ddlBirthCountry"] option');
        });
    });

    casper.then(function() {
        // objectify
        countries = countries.map(function(country) {
            return {name: country};
        });
        this.echo(JSON.stringify(countries ) + '\n');
        fs.write(outputFileName, JSON.stringify(countries ) + '\n', 'a');
    });
}

casper.then(function() {
    // extract country using first warrior ID
    extractCountry(warriorIds[0]);
});

casper.on('remote.message', function(msg) {
    this.echo(msg);
});

casper.on('error', function(msg, backtrace) {
    this.capture('./out/error.png');
    this.echo('msg: ' + msg);
    this.echo('backtrace: ' + backtrace);
    //throw new ErrorFunc("fatal","error","filename",backtrace,msg);
});

casper.on('page.error', function(msg, trace) {
    // ignore export variable from page
    if (msg === "ReferenceError: Can't find variable: exports") {
        return;
    }
    this.echo('Error: ' + msg, 'ERROR');
    fs.write(errorsLog, JSON.stringify('Error: ' + msg) + '\n', 'a');
});

casper.run(function() {
    this.exit();
});

function cleanWorkingDirectory() {
    if (fs.exists(errorsLog)) {
        fs.remove(errorsLog);
    }

    if (fs.exists(outputFileName)) {
        fs.remove(outputFileName);
    }
}