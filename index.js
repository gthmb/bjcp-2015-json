var parser = require('xml2json');
var request = require('request');

var fs = require('fs');
var useRemote = false;
var xml = "";

if(process.argv[2] === "useRemote"){
  useRemote = true;
}

if(useRemote){
  console.log('request XML remotely...');
  request('https://raw.githubusercontent.com/seth-k/BJCP-styles-XML/master/styleguide-2015.xml', function (err, response, body) {
    if (err) {
      return console.log(err);
    }
    parseXML(body);
  })
} else {
  console.log('using local XML');
  fs.readFile('./xml/styleguide-2015.xml', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    parseXML(data);
  });
}

function parseXML(xml){
  var json = parser.toJson(xml);
  var path = './json/styleguide-2015.min.json';

  fs.writeFile(path, json, function(error) {
     if (error) {
       console.error("write error:  " + error.message);
     } else {
       console.log("Successful Write to " + path);
     }
  });
}