var siteUrl = 'http://www.jwmww2.org/';

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
var outputFileName = 'warriors_ids.json';

cleanWorkingDirectory();

var soldierIds = [];

casper.start('http://www.jwmww2.org/jewishFighters/Manage/Login.aspx', function() {
    this.fill('form[action="Login.aspx"]', {
        txtusername: 'admin',
        txtpassword: 'admin'
    });
    this.click('input[type="submit"]');
});

casper.thenOpen('http://www.jwmww2.org/jewishFighters/Manage/ExcelMainView.aspx', function() {
    soldierIds = this.evaluate(function() {
        return utils.getAttribsBySelector('table[id$="GridViewForExcel"] tr td:first-child');
    });
    // remove first element
    soldierIds.splice(0, 1);
    fs.write(outputFileName, JSON.stringify(soldierIds), 'w');
});

casper.run(function() {
    this.exit();
});

casper.on('remote.message', function(msg) {
    this.echo(msg);
})

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

function cleanWorkingDirectory() {
    if (fs.exists(errorsLog)) {
        fs.remove(errorsLog);
    }

    if (fs.exists(outputFileName)) {
        fs.remove(outputFileName);
    }
}