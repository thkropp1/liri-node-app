// Access the data from the file keys.js
var keys = require("./keys.js"); 

// Show the contents of the file keys.js
//console.log(require("./keys.js"));

// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");

// Load the fs package to read and write
var fs = require("fs");

// Load the Spotify API
var spotify = require("node-spotify-api");

// New instance of a Spotify client
var user = new spotify(keys.spotifyKeys); 

//console.log("Spotify id: " + spotify.id);
//console.log("Spotify secret: " + spotify.secret);

// Load the Twitter API
var twitter = require("twitter");

// New instance of a Twitter client
var client = new twitter(keys.twitterKeys); 

//console.log("Twitter consumer_key: " + client.consumer_key);
//console.log("Twitter consumer_secret key: " + client.consumer_secret);
//console.log("Twitter access_token_key: " + client.access_token_key);
//console.log("Twitter access_token_secret: " + client.access_token_secret);


// Get the user input        
var action = process.argv[2];

var nodeArgs = process.argv;

var value = "";

//console.log("The action is: " + action);

var params = {
    screen_name: 'tksweetie1970',
    count: 20
}

// We will then create a switch-case statement (if-then would also work).
// The switch-case will direct which function gets run.
switch (action) {
  case "my-tweets":
    myTweets();
    break;

  case "spotify-this-song":
    if (nodeArgs.length === 3) { //If the user doesn't provide a song title, default to 'The Sign'
      value = "The+Sign";
      console.log(' ');
      console.log("No song title provided, so set it to 'The Sign'.");
    } else {
      value = getValue();  //Get the song title
      //console.log("Spotify song title is: " + value);
    }
    spotifyThisSong(value);
    break;

  case "movie-this":
    movieThis();
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  default:
    console.log("Invalid command. Please try again.");
    fs.appendFileSync('log.txt', "\r\n\r\nInvalid command. Please try again.\r\n");
    break;
}

//Get the value of the argument
function getValue() {

    // Loop through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {

      if (i > 3 && i < nodeArgs.length) {
        value = value + "+" + nodeArgs[i];
      } else {
            value += nodeArgs[i];
      }
    }
    //console.log("The value is: " + value);
    return value;
}


// If the "myTweets" function is called...
function myTweets() {

var tweetsLength;

  // Grab the most recent tweets
  client.get('statuses/user_timeline', function(error, tweets, response) {
    if(error) throw error;

    //Loop through the length of tweets and return the tweets date and text.
    tweetsLength = 0;

    for(var i=0; i < tweets.length; i++){
      tweetsLength ++;
    }
    if (tweetsLength > 20){ //If more than 20 tweets, cut it off at 20 tweets
      tweetsLength = 20;
    }
    console.log(' ');
    for (var i=0; i < tweetsLength; i++){
      console.log("Tweet " + (i+1) + " text: " + tweets[i].text);
      console.log("Tweet " + (i+1) + " created on: " + tweets[i].created_at);
      console.log("--------------------------------------------------------------");

      //Append tweets to log.txt
      fs.appendFileSync('log.txt', "\r\nTweet #" + (i+1) + " text: " + tweets[i].text + ",  created on: " + tweets[i].created_at + "\r\n");
    }
});

}

// If the "spotifyThisSong" function is called...
function spotifyThisSong(spotValue) {

    //console.log("Spotify function value is: " + spotValue);

    user.search({ type: 'track', query: spotValue }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        } 
        //console.log(data); 
        spotifyData = data.tracks.items[0];
        console.log(' ');
        console.log('Artist(s): ' + spotifyData.artists[0].name);
        console.log('Song Title: ' + spotifyData.name);
        console.log('Preview Link of the Song from Spotify: ' + spotifyData.preview_url);
        console.log('Album that the Song is from: ' + spotifyData.album.name);
        console.log(' ');

        //Append movie information to log.txt
        fs.appendFileSync('log.txt', "\r\n\r\nSpotify This Song:\r\n");
        fs.appendFileSync('log.txt', "\r\n" + "Artist(s): " + spotifyData.artists[0].name + "\r\n");
        fs.appendFileSync('log.txt', "\r\n" + "Song Title: " + spotifyData.name + "\r\n");
        fs.appendFileSync('log.txt', "\r\n" + "Preview Link of the Song from Spotify: " + spotifyData.preview_url + "\r\n");
        fs.appendFileSync('log.txt', "\r\n" + "Album that the Song is from: " + spotifyData.album.name + "\r\n");

    });
}


// If the "movieThis" function is called...
function movieThis() {

    // Create an empty variable for holding the movie name
    var movieName = "";

    if (nodeArgs.length === 3) { // User doesn't type in a movie title
    	movieName = "Mr.+Nobody";
    	//console.log("No movie title was entered. Will use 'Mr. Nobody' as the movie title.");
    } else {
      movieName = getValue(); //Set input value to movieName
    }
    
    //console.log("Movie Name is: " + movieName);

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    //var queryUrl = "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=40e9cece";
    // This line is just to help us debug against the actual URL.
    //console.log(queryUrl);

    request(queryUrl, function(error, response, body) {

    // Movie data
    //console.log(body);	

    // If the request is successful
    if (!error && response.statusCode === 200) {

      movieInfo = JSON.parse(body);
      // Parse the body of the site and get the data needed
      console.log(' ');
      console.log("Movie Title: " + movieInfo.Title);
      console.log("Release Year: " + movieInfo.Year);
      console.log("IMDB Rating: " + movieInfo.imdbRating);
      console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);
      console.log("Country where the movie was produced: " + movieInfo.Country);
      console.log("Language of the movie: " + movieInfo.Language);
      console.log("Movie Plot: " + movieInfo.Plot);
      console.log("Actors in the movie: " + JSON.parse(body).Actors);
      console.log(' ');

      //Append song information to log.txt
      fs.appendFileSync('log.txt', "\r\n\r\nMovie This:\r\n");
      fs.appendFileSync('log.txt', "\r\nMovie Title: " + movieInfo.Title + "\r\n");
      fs.appendFileSync('log.txt', "\r\nRelease Year: " + movieInfo.Year + "\r\n");
      fs.appendFileSync('log.txt', "\r\nIMDB Rating: " + movieInfo.imdbRating  + "\r\n");
      fs.appendFileSync('log.txt', "\r\nRotten Tomatoes Rating: " + movieInfo.Ratings[1].Value + "\r\n");
      fs.appendFileSync('log.txt', "\r\nCountry where the movie was produced: " + movieInfo.Country + "\r\n");
      fs.appendFileSync('log.txt', "\r\nLanguage of the movie: " + movieInfo.Language + "\r\n");
      fs.appendFileSync('log.txt', "\r\nMovie Plot: " + movieInfo.Plot + "\r\n");
      fs.appendFileSync('log.txt', "\r\nActors in the movie: " + JSON.parse(body).Actors + "\r\n");

    } 
  });
}


// If the "doWhatItSays" function is called...
function doWhatItSays() {

// We will read the existing random.txt file
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

    // Create an array from the string
    var data = data.split(",");

    // Loop through data array and parse the elements into variables
    for (var i = 0; i < data.length; i++) {
      if (i===0) {
        action = data[i];
        //console.log("Action: " + action);
      } else if (i === 1){
      	value = data[i].split(' ').join('+');
      	//console.log("Value: " + value);
      }
    }

    // Call the function spotifyThisSong
    spotifyThisSong(value);

  });
}

