

// var  newTwitterStream = function (twitterInfo) {

//     this.thisClient = twitterInfo,

//     this.streamParams = {
//         track: 'Arsenal, #AFC, Ozil, Alexis Sanchez, #COYG'
//     }

//     this.startStream = this.thisClient.stream('statuses/filter', this.streamParams)

// }


// function isThisPositive (tweet,callback) {

//     var thisSentimentScore = sentiment(tweet)

//     return thisSentimentScore.score

// }


// function determineIfPositive (sentimentScore, callback) {

//   if (sentimentScore > 0) {
//     return true
//   } else {
//     return false
//   }

// }


// // STREAM INITIALIZATION
// // 
// var streamParams = {
//   track: 'Arsenal, #AFC, Ozil, Alexis Sanchez, #COYG'
// }

// // Checks rate limit on requests
// var theseCheckParams = {
//     resources: 'statuses'
//   }

// // client.get('application/rate_limit_status', theseCheckParams,function(error, response){
// //     console.log(response.resources.statuses);
// // })

// function checkRetweetStatus (tweet){

//   if (tweet.retweeted_status) {
//     return true
//   }

//   else {
//     return false;
//   }
// }

// var countOfTweets = 0;

// // initializes stream
// //var stream = client.stream('statuses/filter', streamParams);
  
// // stream.on('data', function(event) {

// //     var thisTweetRetweetStatus = checkRetweetStatus(event);

// //     var thisTweetText = event.text;

// //     var thisTweetScore = isThisPositive(thisTweetText)

// //     var shouldIFavoriteThis = determineIfPositive(thisTweetScore);
          
// //     var params = {
// //       id: event.id_str
// //     }

// //     if (thisTweetRetweetStatus === false){
    
// //         countOfTweets += 1;
// //         console.log(thisTweetText + " " + countOfTweets);
    
    
// //         client.post('favorites/create', params, function (error, tweet, response){
                
// //             //console.log(response);
            
// //             if (error) {

// //                 console.log(error + ' I found an error')
// //             }

// //             else {                
// //                         // console.log(newData);
// //                         // if (newData != null) {
// //                         //     var thisNewData = []
// //                         //     thisNewData += newData
// //                         //     console.log(thisNewData[0].message);
// //                         // } else {
// //                 console.log("You just favorited " + thisTweetText + " with a score of " + thisTweetScore)
// //             }
// //         })
// //     }

// //     else {
// //       console.log('I didnt favorite this tweet because it was a retweet');
// //     }
// // });

// // stream.on('error', function(error) {
// //     throw error;
// // });



// module.exports = {

//   createNewClient: newTwitterStream()

// }