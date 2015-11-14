// first run getWarriorIds.js 

var casper = require('casper').create({
    // inject utils to page
    clientScripts: ["./crawler/includes/utils.js"]
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

var errorsLog = './crawler/data/warriors_witherrors.json';
var outputFileName = './crawler/data/warriors.json';

cleanWorkingDirectory();

var warriorIds;

function getSoldierDetails(soldier) {

    // first page - soldier details
    soldier.personal_information = {};
    soldier.personal_information.first_name = document.querySelector('input[id$="txtFirstNameHeb"]').getAttribute('value');
    soldier.personal_information.last_name = document.querySelector('input[id$="txtFamilyHeb"]').getAttribute('value');
    soldier.personal_information.army_id = document.querySelector('input[id$="txtArmyId"]').getAttribute('value');
    soldier.personal_information.former_last_name = document.querySelector('input[id$="txtFormerFamilyHeb"]').getAttribute('value');
    soldier.personal_information.father_name = document.querySelector('input[id$="txtFatherName"]').getAttribute('value');
    soldier.personal_information.mother_name = document.querySelector('input[id$="txtMotherName"]').getAttribute('value');
    
    // convert to date 
    soldier.personal_information.birth_date = utils.getDateByIdPostfix('Birth');
    
    soldier.personal_information.lunar_birth_date = document.querySelector('input[id$="txtBirthDateLunar"]').getAttribute('value');
    soldier.personal_information.birth_country = utils.getDropDownSeleced('select[id$="ddlBirthCountry"]');
    soldier.personal_information.birth_city = utils.getAttribBySelector('input[id$="txtBirthCity"]', 'value');
    
    // migration date
    soldier.personal_information.migration_date = utils.getDateByIdPostfix('Immigration');

    var isMale = utils.getIsCheckedBySelector('input[id$="rbMale"]');
    soldier.personal_information.gender = isMale ? 'male' : 'female';

    soldier.death_details = {};
    soldier.death_details.death_cause = utils.getAttribBySelector('input[id$="txtDeathRemarks"]', 'value');
    soldier.death_details.death_date = utils.getDateByIdPostfix('Death');
    soldier.death_details.death_place = utils.getAttribBySelector('input[id$="txtPlaceOfDeath"]', 'value');
    
    
    soldier.categories = utils.getAttribsBySelector('span[id$="lblCat"]');
    
    soldier.approved = utils.getIsCheckedBySelector('input[id$="chkConfirmDIsplay"]');
    
    soldier.case_number = utils.getAttribBySelector('input[id$="txtAppNo"]', 'value');

    return soldier;
}

function getSoldierWW2Details(soldier) {

    soldier.ww2 = {};
    soldier.ww2.jewish_community_volunteer_check = utils.getIsCheckedBySelector('input[id$="chkWeapons"]');
    soldier.ww2.partisan_check = utils.getIsCheckedBySelector('input[id$="chkForests"]');
    soldier.ww2.partisan_country = utils.getDropDownSeleced('select[id$="ddlForests"]');
    
    soldier.ww2.getto_check = utils.getIsCheckedBySelector('input[id$="chkGetto"]');
    soldier.ww2.getto = utils.getAttribBySelector('input[id$="txtGetto"]', 'value');
    
    soldier.ww2.resistance_movement_check = utils.getIsCheckedBySelector('input[id$="chkPartisans"]');
    soldier.ww2.resistance_movement_country = utils.getDropDownSeleced('select[id$="ddlPartizans"]');
    
    soldier.ww2.protest_movement_check = utils.getIsCheckedBySelector('input[id$="chkProtest"]');
    soldier.ww2.protest_movement = utils.getAttribBySelector('input[id$="txtProtest"]', 'value');
    
    soldier.ww2.service_check = utils.getIsCheckedBySelector('input[id$="chkRegularService"]');
    soldier.ww2.service_country = utils.getDropDownSeleced('select[id$="ddlServiceCountry"]');
    soldier.ww2.service_corps = utils.getDropDownSeleced('select[id$="ddlDivision"]');
    soldier.ww2.service_platoon = utils.getAttribBySelector('input[id$="txtPlatoon"]', 'value');
    
    var isVolunteer = utils.getIsCheckedBySelector('input[id$="rbVolunteer"]');
    soldier.ww2.recruitment = isVolunteer ? 'volunteer' : 'enlist';
    
    soldier.ww2.dismiss_reason = utils.getAttribBySelector('input[id$="txtDismissReason"]', 'value');

    soldier.battles = [];
    var battles = document.querySelectorAll('table[id$="GridViewBattles"] tr');
    for (var i = 1; i < battles.length; i++) {
        var battle = {};
        battle.soldier_rank = battles[i].querySelector('span[id$="degreeLabel"]').innerHTML;
        battle.soldier_role = battles[i].querySelector('span[id$="roleLabel"]').innerHTML;
        battle.front = battles[i].querySelector('span[id$="frontLabel"]').innerHTML;
        battle.operation = battles[i].querySelector('span[id$="battleLabel"]').innerHTML;
        battle.date = battles[i].querySelector('span[id$="battleDateLabel"]').innerHTML;
        battle.medal = battles[i].querySelector('span[id$="medalLabel"]').innerHTML;
        battle.details = battles[i].querySelector('span[id$="remarksLabel"]').innerHTML;
        soldier.battles.push(battle);
    }
    
    soldier.ww2.wounds_details = utils.getAttribBySelector('textarea[id$="txtWounded"]', 'value');
    
    soldier.prison = {};
    soldier.prison.dates = utils.getAttribBySelector('input[id$="txtPrisonDates"]', 'value');
    soldier.prison.place = utils.getAttribBySelector('input[id$="txtPrisonPlace"]', 'value');
    soldier.prison.name = utils.getAttribBySelector('input[id$="txtPrisonName"]', 'value');
    soldier.prison.circumstances = utils.getAttribBySelector('textarea[id$="txtPrisonReason"]', 'value');

    return soldier;
}

function getSoldierIdfDetails(soldier) {
    
    soldier.idf_details = {};
    soldier.idf_details.corps = utils.getDropDownSeleced('select[id$="ddlDivision"]');
    soldier.idf_details.platoon = utils.getAttribBySelector('input[id$="txtPlatoon"]', 'value');
    soldier.idf_details.enlist_date = utils.getDateByIdPostfix('Enlist');
    soldier.idf_details.rank = utils.getDropDownSeleced('select[id$="ddlDegree"]');
    soldier.idf_details.release_date = utils.getDateByIdPostfix('Release');
    
    soldier.idf_battles = [];
    var battles = document.querySelectorAll('table[id$="GridViewBattles"] tr');
    for (var i = 1; i < battles.length; i++) {
        var battle = {};
        battle.front = battles[i].querySelector('span[id$="frontLabel"]').innerHTML;
        battle.operation = battles[i].querySelector('span[id$="battleLabel"]').innerHTML;
        battle.date = battles[i].querySelector('span[id$="battleDateLabel"]').innerHTML;
        battle.medal = battles[i].querySelector('span[id$="medalLabel"]').innerHTML;
        battle.details = battles[i].querySelector('span[id$="remarksLabel"]').innerHTML;
        soldier.battles.push(battle);
    }
    
    return soldier;
}

function getSoldierContactInfo(soldier) {
    
    soldier.contact_information = {};
    soldier.contact_information.first_name = utils.getAttribBySelector('input[id$="txtFirstName"]', 'value');
    soldier.contact_information.last_name = utils.getAttribBySelector('input[id$="txtLastName"]', 'value');
    soldier.contact_information.address = utils.getAttribBySelector('input[id$="txtAddress"]', 'value');
    soldier.contact_information.city = utils.getAttribBySelector('input[id$="txtCity"]', 'value');
    soldier.contact_information.phone = utils.getAttribBySelector('input[id$="txtPhone"]', 'value');
    soldier.contact_information.mobile_phone = utils.getAttribBySelector('input[id$="txtMobile"]', 'value');
    soldier.contact_information.email_address = utils.getAttribBySelector('input[id$="txtEmail"]', 'value');
    soldier.contact_information.relation_to_warrior = utils.getAttribBySelector('input[id$="txtRelative"]', 'value');
    soldier.contact_information.date = utils.getAttribBySelector('input[id$="txtDate"]', 'value');
    soldier.contact_information.first_submission = utils.getIsCheckedBySelector('input[id$="rbPreviousNo"]');
    soldier.contact_information.for_display = utils.getIsCheckedBySelector('input[id$="rbForDisplayYes"]');
    
    return soldier;
}

function getSoldierMedals(soldier) {
    
    soldier.medal_links = []
    var links = document.querySelectorAll('table[id$="GridViewLinks"] tr');
    for (var i = 1; i < links.length; i++) {
        var link = {};
        link.title = links[i].querySelector('span[id$="titleLabel"]').innerHTML;
        link.href = links[i].querySelector('span[id$="linkLabel"]').innerHTML;
        soldier.medal_links.push(link);
    }
    return soldier;
}

function getSoldierCV(soldier) {
    soldier.resume = utils.getAttribBySelector('textarea[id$="txtCV"]');
    return soldier;
}

function getSoldierStory(soldier) {
    
    soldier.personal_story = utils.getAttribBySelector('textarea[id$="txtStory"]');
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

function getSoldierVarious(soldier) {
    soldier.remarks = utils.getAttribsBySelector('textarea[name$="txtRemarks"]');
    return soldier;
}

function getSoldierLinks(soldier) {
    
    soldier.links = []
    var links = document.querySelectorAll('table[id$="GridViewLinks"] tr');
    for (var i = 1; i < links.length; i++) {
        var link = {};
        link.title = links[i].querySelector('span[id$="titleLabel"]').innerHTML;
        link.href = links[i].querySelector('span[id$="linkLabel"]').innerHTML;
        soldier.links.push(link);
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
    warriorIds = JSON.parse(fs.read('./crawler/data/warriors_id.json'));
});


function extractSoldier(soldierId) {

    var soldier = {};

    casper.thenOpen(getFullUrl('PersonalManage', soldierId), function() {
        soldier = this.evaluate(getSoldierDetails, soldier);
    });

    casper.thenOpen(getFullUrl('WarTwoManage', soldierId), function() {
        soldier = this.evaluate(getSoldierWW2Details, soldier);
    });
    
    casper.thenOpen(getFullUrl('ServiceManage', soldierId), function() {
        soldier = this.evaluate(getSoldierIdfDetails, soldier);
    });
    
    casper.thenOpen(getFullUrl('ContactInfoManage', soldierId), function() {
        soldier = this.evaluate(getSoldierContactInfo, soldier);
    });
    
    casper.thenOpen(getFullUrl('MedalsManage', soldierId), function() {
        soldier = this.evaluate(getSoldierMedals, soldier);
    });
    
    casper.thenOpen(getFullUrl('CVManage', soldierId), function() {
        soldier = this.evaluate(getSoldierCV, soldier);
    });
    
    casper.thenOpen(getFullUrl('StoryManage', soldierId), function() {
        soldier = this.evaluate(getSoldierStory, soldier);
    });

    casper.thenOpen(getFullUrl('PicturesManage', soldierId), function() {
        soldier = this.evaluate(getSoldierImages, soldier);
    });
    
    casper.thenOpen(getFullUrl('VariousManage', soldierId), function() {
        soldier = this.evaluate(getSoldierVarious, soldier);
    });
    
    casper.thenOpen(getFullUrl('LinksManage', soldierId), function() {
        soldier = this.evaluate(getSoldierLinks, soldier);
    });

    // download all soldier images
    /*casper.then(function() {
        soldier.images.forEach(function(image) {
            // create local path to save image
            var imagepath = makeDirectoryForImagePath(image.src);
            console.log('downloading: path - ' + siteUrl + image.src + '; file path - ' + imagepath);
            casper.download(siteUrl + image.src, imagepath);
        });
    });*/

    casper.then(function() {
        //this.echo(JSON.stringify(soldier));
        fs.write(outputFileName, JSON.stringify(soldier) + '\n', 'a');    
    });
}


casper.then(function() {
    
    var i = 0;
    // process soldier ids one by one
    /*warriorIds.forEach(function(warriorId) {
        casper.waitFor(function check() {
            console.log('extract num ', i++);
            extractSoldier(warriorId);
            return true;
        });
    });*/
    extractSoldier('113869'); // חנה סנש
});

/*casper.then(function() {
    var i = 0;
    warriorIds.forEach(function(warriorId) {
        console.log('extract num ', i++);
        extractSoldier(warriorId);
    });
    
    //extractSoldier(warriorIds[0]);
});*/

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

casper.run(function() {
    this.exit();
});


function makeDirectoryForImagePath(imagePath) {
    imagePath = imagePath.trim();
    var fileSplit = imagePath.split('/');
    var fullPath = ".";
    for (var i = 0; i < fileSplit.length - 1; i++) {

        if (fileSplit[i] === '..') {
            continue;
        }

        fullPath += '/' + fileSplit[i]

        if (!fs.exists(fileSplit[i])) {
            fs.makeDirectory(fullPath);
        }
    }

    fullPath += '/' + fileSplit[fileSplit.length - 1];

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