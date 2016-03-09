var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
results = [];

request('http://codeclan.com/about/', function(err, response, html){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(html);
    $('div.team-image').each(function(i, element){
      var url = $(this).attr('style');
      results.push(url);
    });
    
    for(result of results){
      console.log('Result:', result.substring(22, result.length-2))
    };
    console.log("Finished scraping. There are " + results.length + " results.");

    var getTheURLS = results.map(function(result){
      return result.substring(22, result.length-2)
    })
    // //now looping over urls in results array. We use .pipe to put it into a string
    for (var i = 0; i < getTheURLS.length; i++) {
      request(getTheURLS[i]).pipe(fs.createWriteStream('resultsFile/' + i + '.jpg'));
    };
  }
});

