var parser = require('xml2json');
var request = require('request');

var fs = require('fs');
var useRemote = false;
var xml = "";
var dest = "./json/styleguide-2015";

process.argv.forEach(function(val, index) {
    if (val === "useRemote=true") {
        useRemote = true;
        return;
    }

    if (val.substr(0, 5) === 'dest=') {
        dest = val.substr(5);
        return;
    }
});

if (useRemote) {
    console.log('request XML remotely...');
    request('https://raw.githubusercontent.com/seth-k/BJCP-styles-XML/master/styleguide-2015.xml', function(err, response, body) {
        if (err) {
            return console.log(err);
        }
        parseXML(body);
    })
} else {
    console.log('using local XML');
    fs.readFile('./xml/styleguide-2015.xml', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        parseXML(data);
    });
}

function parseXML(xml) {
    var json = JSON.parse(
        parser.toJson(
            xml.replace(/(<em>)|(<\/em>)|(\s{2,})|(<strong>)|(<\/strong>)/g, ""), { sanitize: false }
        )
    );

    maniuplateDefs(json, 'tags', function(val) {
        return val.split(/,\s/g);
    });

    maniuplateDefs(json, 'examples', function(val) {

        if(val.indexOf(';') !== -1){
            var newVal = {},
                types = val.split(';');

            for(var el in types){
                var typename = types[el].substr(0, types[el].indexOf('-')).trim(),
                    typeval = types[el].substr(types[el].indexOf('-')).replace(/-/, "").trim();
                newVal[typename] = typeval.split(/,\s/g);
            }
            return newVal;
        }

        return val.split(/,\s/g);
    });

    var dests = [{
        fname: dest + '.json',
        content: JSON.stringify(json, null, 4)
    }, {
        fname: dest + '.min.json',
        content: JSON.stringify(json)
    },{
        fname: dest + '.js',
        content: "export const STYLES = " + JSON.stringify(json)
    }];

    dests.forEach(function(fobj) {
        fs.writeFile(fobj.fname, fobj.content, function(error) {
            if (error) {
                console.error("write error:  " + error.message);
            } else {
                console.log("Successful Write to " + fobj.fname);
            }
        });
    });
}

function maniuplateDefs(obj, pname, handler) {
    search = function(o) {
        if (o.hasOwnProperty(pname)) {
            o[pname] = handler(o[pname]);
        }

        for (var el in o) {
            if (typeof o[el] === 'object' && el !== pname) {
                search(o[el]);
            }
        }
    }

    search(obj);
}
