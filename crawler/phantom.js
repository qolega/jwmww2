
var page = require('webpage').create();
var loadInProgress = false;
var testindex = 0;

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

page.onAlert = function (msg) {
    console.log('alert!!> ' + msg);
};

page.onLoadStarted = function() {
    loadInProgress = true;
    console.log("load started");
};

page.onLoadFinished = function(status) {
    loadInProgress = false;
    if (status !== 'success')
    {
        console.log('Unable to access network');
        phantom.exit();
    }
    else
    {
        console.log("load finished");
    }
};

var steps = [
    function() {
        page.open('http://www.jwmww2.org/JewishFighters/Display/SearchResults.aspx?fName=&lName=&army=&cat=&partizans=&division=');
    },
    function() {
        page.includeJs('//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js');
    },
    function () {
        page.evaluate(function() {
            var i = 1;
            $.each( $("a"), function(index, value) {
                console.log( value);
                console.log( $(this).attr("onclick"));
                if (i = 1) {
                    $(this).click();
                }
            });
        });
    },
    /*
    function() {
        page.evaluate(function() {
            $.each( $("a"), function(index, value) {
                
                var cleanTxt = value.text.replace('(', '').replace(')', '');
                
                var soldierNamePattern = /(.*)צבא/;
                var soldierName = soldierNamePattern.exec(cleanTxt);
                soldierName = soldierName ? soldierName : '';
                
                var armyNamePattern = /צבא:(.*)/
                var armyName = armyNamePattern.exec(cleanTxt);
                armyName = armyName ? armyName : '';
                console.log(cleanTxt + " SoldierName: " + soldierName[1] + ", armyName: " + armyName);
            });
            
        });
    }*/
    /*
    function() {
        page.evaluate(function() {
            var links = document.getElementsByTagName("a");
            var url = "javascript:__doPostBack('ctl00$ContentPlaceHolder1$gvResults','Page$" + 2 + "')";
            for (var i=0; i < links.length; i++) { 
                if (links[i].getAttribute('href') == url) {
                    // create a mouse click event
                    var event = document.createEvent( 'MouseEvents');
                    event.initMouseEvent('click', true, true, window, 1, 0, 0);
                 
                    // send click to element
                    links[i].dispatchEvent(event);
                }
            }
        });
    }*/
    function () {
                console.log('Answers:');
                page.render('AnswerPage.png');
                
    },
    function () {
          console.log('Exiting');
    }
];

var interval = setInterval( function() {
    if (!loadInProgress && typeof steps[testindex] == "function")
    {
        console.log("step " + (testindex + 1));
        steps[testindex]();
        testindex++;
    }
    if (typeof steps[testindex] != "function")
    {
        console.log("test complete!");
        phantom.exit();
    }
}, 1000);