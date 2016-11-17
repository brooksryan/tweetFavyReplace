//stuck on getting firebase to work here

var searchForDuplicateArticle = function (articleTitle){

	barbRef.orderByChild('title')
		.startAt(articleTitle)
		.endAt(articleTitle)
		.once('value',function(snap){
			
		var thisSnapshot = snap.val();

        if (thisSnapshot != null){
          	
          	return true;
        
        } else {
			
			return false;
        
        }
	})
}

var saveNewArticlesToFirebase = function(arrayOfRssFeedResults){
  	console.log('made it here!')
	arrayOfRssFeedResults.forEach(function(articleEntry){

		//variables articleEntry title
		var thisTitle = articleEntry.title;

		//adds server timestamp to article
		articleEntry.timestamp = firebase.database.ServerValue.TIMESTAMP

		if (searchForDuplicateArticle(thisTitle) == true){
		console.log('this already exists')
	    } else {
		console.log('hey! We found a new article ' + thisTitle);
		barbRef.push(articleEntry);
	    }
		    
	});
};


module.exports = {

	saveNewArticlesToFirebase: saveNewArticlesToFirebase,

	searchForDuplicateArticle: searchForDuplicateArticle
	
};