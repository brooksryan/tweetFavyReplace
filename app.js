var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//installed dependencies
var request = require('request')
var parser = require('node-feedparser')
var firebase = require("firebase");
var cheerio = require('cheerio');

//Twitter API
var Twitter = require('twitter');
var io = require("socket.io");
//var twitterService = require('./services/twitterStream.js');

//Sentiment Analysis
var sentiment = require('sentiment');

 
var client = new Twitter({
  consumer_key: 'xCWNq4gnaveJKhg9yyBInu1iK',
  consumer_secret: 'nmUEattEkNQuT5hAeRG1apXiYANwhvDRic01qoWH98ddIRA2Xj',
  access_token_key: '187015627-8pZAOgkbmL1iYJThyCgffPgMWkEoQUAuCgw1ST6W',
  access_token_secret: 'w91vVZ3NkFDqVZDmh1mTbVc6Pso9wYVs8Sl7xeuJo2CxA'
});

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

//Setting up firebase credentials
firebase.initializeApp({
    serviceAccount: 
        {
        "type": "service_account",
        "project_id": "barbcupsstats",
        "private_key_id": "b919b6c6a6a48f981f2c58820e432eca9a1b21f1",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCuZER6LBq3QLkE\n0moz2eznIV25/ZWiMs9bmec14mp1UqeZCmyT6rGJiIn+0rNZXh+USeoxDxgXLo/B\nKgqW16JhaAXc2OhZfn+DW1tQDsaq4DNxMvKpmmlCiTH6a6Zr3MSRjJlBkxRy0nDR\n0tPBWFtOH+Y8l7611JNH0b+CYyPV6bZMp5Ak8Gh2Y3D9WVge/0yMNo6Zkbq0e6GP\nL+OXvEyDG/TwmfDzRLEAd2t4T4Bbhf3IzsWSnfDdPmtXkygUJj7cDAJDdKYLzaCb\nmsOI0pbTD1fDkzyvu0+G8+lMy1FRzx5mF5z0GoRx07bRDCLAYgzZEYsDmF9p49f4\nlVzpo1CPAgMBAAECggEAfqwuYV/v9/R3cF0273r4bdr6rcLZEfw+Spc8LxPLqHTl\ncHD19Wugkfov4n1B8URBRAF8ry37nbsgiHr1PiRbus1IlOapv3f3P374kOpqvGwm\nca9EPJYAp2foebIALJEr511tZQhk7hKWCJNPZT289L6PCqxexs0mPiDJLvi8awAp\nCIuwMvkQfA9ZAz08S7dArx0q8TUwUmi7Pf+Oq+bBSttUd5ZQGRLXkMlHXtaBre6/\nDCmhBvzxtDKtfH+SGnGNNXx5SvZdJYMjmitn+aT4IEA3CkUcbhycQAPyeZuTDc0P\nkGouWys3WCors07q/BHHV0XgtlErwpuZ5Y5wO9AcwQKBgQDfyJyzMlzqTeAiUqh8\nxD0JFtG0RGdZuYOjFn6tqYj83Y6KFib+F1j9mqNvLJOTA1tLImeWy/nDsjcqBYDz\neqDdGt4FgL2LiE0LQeQJjav0kom2nMfTduixgmVELL3QxVWfzV7Tdbb5rhFup5ZG\n5DKTjXUDMbi8T8SGsbHMy4CXtwKBgQDHf1llHjx8C01aOcTBwGZYgUIJjr/OXWsA\n3bEe+zpyP7eKBz22DSSi7CiQrTuBQBKJNF7lCJq1PT71hV5h+gUzbO8usLDoamtN\noFxOGUhPaEsqviTLndTzAOu6+MjWC/fteg8+3vE93e3tknDFG2xPPHCVhWoBQYiW\nr5+JQ+Kd6QKBgQCZCiX3+sJGTlmwv1yQbtfa5mslX/5aAx++Ib0iYKXZYF+BmeKy\ntB7c2KtadV67FHmTqYS0QOyfY7qMF1V3rW5jp2Mc2k1GJkGiKD6eNe/aA3kAlLmn\nqVM7ShSdCggJxVpoPdfSv1cR63Pqe9uuwZLBC+Vw+MkAp4CcKNuSVb2sgwKBgAxB\nXIKDuv97ykKyrc2hPihNuHrR1CKfRoWFGO5oTIzcMTA/haD7abbAfzV0DuW/w+O9\n3d6ACtD7dDSs/sFSFKO2G3No01VTxEe+hC0gDHskUwnLKIOBrKVI9zJDOkM79P0X\ntHwOQg+k5IrlphvVtW+grOHikkKFfhiTrV9HVlKRAoGBAM8grBbYIs3/J0F63GDx\n1Hu8/0gO9D/GDs7/en4WmqQjWUDa4PIPQP5bBlmKQtcoreZM6hBZX6aFsl/e4iao\n1o4VV4+AIYU3LVFGtxYlT7BA/5VDWKoVJlWE6+54NxZMX9Te+WdVbQdptAgd37gg\n2VT1+M/3z0a57r2gmAvAB6x5\n-----END PRIVATE KEY-----\n",
        "client_email": "barbserver@barbcupsstats.iam.gserviceaccount.com",
        "client_id": "117584491914275399299",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/barbserver%40barbcupsstats.iam.gserviceaccount.com"
        },
    databaseURL: "https://barbcupsstats.firebaseio.com"
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


//twitterService.createNewClient(client);

//STREAM INITIALIZATION

var streamParams = {
  track: 'Arsenal, #AFC, Ozil, Alexis Sanchez, #COYG'
}

// Checks rate limit on requests
var theseCheckParams = {
    resources: 'statuses',
    filter_level: 'low'
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


//sets variable for pausing stream 
var isStreamPaused = false; 

//unpauses favoriting function
var updateStreamPauseStatus = function () {

    isStreamPaused = false;
    console.log('Ive unpaused this stream');
}

//sets timout to 30 seconds to unpause favoriting function
var setTimeoutForFavoriteFunction = function () {

  console.log('pausing stream')
  setTimeout(updateStreamPauseStatus, 10000)

}

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

    if (thisTweetRetweetStatus === false && isStreamPaused === false){
    
        countOfTweets += 1;
        console.log(thisTweetText + " " + countOfTweets);
    
    
        client.post('favorites/create', params, function (error, tweet, response){
                
            //console.log(response);
            
            if (error) {

                console.log(error);
            }

            if (countOfTweets >= 10) {

                //pauses favoriting function 
                isStreamPaused = true;

                countOfTweets = 0;

                //sets timer to unpause favoriting function in 30 seconds
                setTimeoutForFavoriteFunction();
                
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

    if (thisTweetRetweetStatus === false && isStreamPaused === true) {

      console.log('favoriting functionality is paused');

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

module.exports = app;