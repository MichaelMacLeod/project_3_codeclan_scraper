Introduction: 

This is a scraper that scrapes images from the CodeClan website. 
CodeClan is Scotland's first digital skills academy, and I am a student there. 
I wrote this scraper as part of one of my class projects. 
It stands alone as a tool that can be adapted to scrape anything from any site. 
It uses the Request and Cheerio packages, and we'll talk through how to install these. 

What are we scraping from? 

We'll get the staff images from: 

http://codeclan.com/about/

First step: 

In console, make a new working directory, name it whatever you like. 

Installations: 

Next, also in console, let’s npm install the packages we need: 

npm install request cheerio 

This single line will load all of our module dependencies. There will be lots of errors because our app is so minimal, but just make sure you’ve got Request and Cheerio in there. 

Request is a package we’ll use to make http calls for us. This is what’s takes HTML from the desired site. More details on Request here: 
https://github.com/request/request

Cheerio is what we’ll use to grab that HTML and parse through it. 
https://github.com/cheeriojs/cheerio

We also require 'fs' which stands for Filesystem. By requiring this, we and node can access the filesystem within the computer. 

Final console step: 

Inside your working directory: 
touch app.js 

Now open app.js: 

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
results = [];

request('http://codeclan.com/about/', function(err, response, html){
  if(!err && response.statusCode == 200){
    console.log(html);
}
});

First pass: 

In console, try running: 

node app.js 

You should see the HTML code logged in your terminal window. 

ARG, THAT’S A LOT OF HTML! 

Now we know that we can get the HTML, we need to take a closer look at how the elements are structured. Then we’ll know what to TARGET. So let’s *inspect element* on the page in Chrome. 

We’re looking for elements and class names. 

Targeting and loading: 

Once we’ve identified them, we need to tell it to load the html into cheerio with .load

request('http://codeclan.com/about/', function(err, response, html){
  if(!err && response.statusCode == 200){
    var loader = cheerio.load(html);
    loader('div.team-image').each(function(i, element){
      var url = loader(this).attr('style');
      results.push(url);
    });
    console.log(results);
    console.log("Finished scraping. There are " + results.length + " results.");
  }
});

Next, we need to just target the URL element. 
It’s a bit messy and there will be more efficient re-usable ways to do this, but for now this works: (slot this in below your results console log)

    for(result of results){
      console.log('result', result.substring(22, result.length-2))

——
STREAMING: 
With Request, you can stream any response to a file stream. 
We do this by looping over the results and then using .pipe to tell each result where to go. In our case, that’s gonna be a file we still need to make! 

Now that we’ve got the URLS, we need to put them somewhere. So in console, mkdir resultsFile

In app.js, directly below the ‘finished scraping’ console log: 

    var getTheURLS = results.map(function(result){
      return result.substring(22, result.length-2)
    })
    // //now looping over urls in results array. We use .pipe to put it into a string
    for (var i = 0; i < getTheURLS.length; i++) {
      request(getTheURLS[i]).pipe(fs.createWriteStream('resultsFile/' + i + '.jpg'));
    };

—————
FINAL CODE: 

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
results = [];

request('http://codeclan.com/about/', function(err, response, html){
  if(!err && response.statusCode == 200){
    var loader = cheerio.load(html);
    loader('div.team-image').each(function(i, element){
      var url = loader(this).attr('style');
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

SUMMARY: 

Downsides of web scraping: There is a high chance that this scraper will break as soon as any changes are made to the page we are scraping. Same goes for any page being scraped. If you have a scraper that runs multiple times per month, day, hour or minute, the owner of that server might become suspicious that you're doing something unethical. A good approach is to contact them to explain your project, flag up the fact you're going to be doing this and point out that you're not making any commercial gain from it. 


Next steps: make this dynamic so that there are no substrings being counted through. Then npm publish as a package so it can be a tool that I, or anybody, can use in a React site/app, or any type of app. 