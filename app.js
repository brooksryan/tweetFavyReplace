var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//installed dependencies
var request = require('request')
var parser = require('node-feedparser')
var cheerio = require('cheerio');

//Twitter API
var Twitter = require('twitter');
var io = require("socket.io");

//Sentiment Analysis
var sentiment = require('sentiment');

 
var client = new Twitter({
  consumer_key: 'xCWNq4gnaveJKhg9yyBInu1iK',
  consumer_secret: 'nmUEattEkNQuT5hAeRG1apXiYANwhvDRic01qoWH98ddIRA2Xj',
  access_token_key: '187015627-8pZAOgkbmL1iYJThyCgffPgMWkEoQUAuCgw1ST6W',
  access_token_secret: 'w91vVZ3NkFDqVZDmh1mTbVc6Pso9wYVs8Sl7xeuJo2CxA'
});

//rssService
var rssService = require('./services/rssService.js')


var saveFileToFirebase = require('./services/saveFileToFirebase')  

//

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




// THIS IS TWITTER STREAM STUFF //
// 

//SENTIMENT ANALYSIS

function isThisPositive (tweet,callback) {

    var thisSentimentScore = sentiment(tweet)

    return thisSentimentScore.score

}


function determineIfPositive (sentimentScore, callback) {

  if (sentimentScore > 0) {
    return true
  } else {
    return false
  }

}


// STREAM INITIALIZATION
// 
var streamParams = {
  track: 'Arsenal, #AFC, Ozil, Alexis Sanchez, #COYG'
}

// Checks rate limit on requests
var theseCheckParams = {
    resources: 'statuses'
  }

client.get('application/rate_limit_status', theseCheckParams,function(error, response){
    console.log(response.resources.statuses);
})

function checkRetweetStatus (tweet){

  if (tweet.retweeted_status) {
    return true
  }

  else {
    return false;
  }
}

var countOfTweets = 0;

// initializes stream
var stream = client.stream('statuses/filter', streamParams);
  
stream.on('data', function(event) {

    var thisTweetRetweetStatus = checkRetweetStatus(event);

    var thisTweetText = event.text;

    var thisTweetScore = isThisPositive(thisTweetText)

    var shouldIFavoriteThis = determineIfPositive(thisTweetScore);
          
    var params = {
      id: event.id_str
    }

    if (thisTweetRetweetStatus === false){
    
        countOfTweets += 1;
        console.log(thisTweetText + " " + countOfTweets);
    
    
        client.post('favorites/create', params, function (error, tweet, response){
                
            //console.log(response);
            
            if (error) {

                console.log(error + ' I found an error')
            }

            else {                
                        // console.log(newData);
                        // if (newData != null) {
                        //     var thisNewData = []
                        //     thisNewData += newData
                        //     console.log(thisNewData[0].message);
                        // } else {
                console.log("You just favorited " + thisTweetText + " with a score of " + thisTweetScore)
            }
        })
    }

    else {
      console.log('I didnt favorite this tweet because it was a retweet');
    }
});

stream.on('error', function(error) {
    throw error;
});



// function favoriteCounterLastFifteenMinutes
//  >> Counts the current number of favorites in the last 15 minutes
//  >> Timer that countes to 15 minutes

// function favoriteCounterStatus
//  >> binary can favorite status to let us know if we can favorite new tweets
//       If number of tweets in the last 15 minutes is <= 15 then = true
//       else = false

// function checkStatusOfFavoriteCounter

// function favoriteTweet

