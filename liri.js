// Variables and requires node packages
require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')
var request = require('request');

var command = process.argv[2];



// keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


// switch case
switch (command) {
    // if user types "my tweets," the last 20 tweets from the twitter account @web_dev_alex will display
    case "my-tweets":
        var params = { screen_name: 'web_dev_alex', count: 20 };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log("@" + tweets[i].user.screen_name + '\n' + tweets[i].text + '\n' + "Retweets: " + tweets[i].retweet_count + ' ' + "Favorites: " + tweets[i].favorite_count + '\n' + tweets[i].created_at +'\n=====================================');
                }
            }
        });
        break;
    // if the user types "spotify-this-song" plus a song name, liri will pull the song's: Name, Artist, Spotify Link & Album Name
    case "spotify-this-song":
        var title = process.argv[3];
        var trackItems;
        if (title) {
            spotify.search({ type: 'track', query: title, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                trackItems = data.tracks.items[0];
                console.log("Song: " + trackItems.name + '\n' + "Artist: " + trackItems.artists[0].name + '\n' + "Spotify Link: " + trackItems.album.external_urls.spotify + '\n' + "Album Name: " + trackItems.album.name);

            });
            // If no song title is provided, the default song is Smash Mouth's "All Star"
        } else {
            spotify.search({ type: 'track', query: "All Star", limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                trackItems = data.tracks.items[0];
                console.log("Song: " + trackItems.name + '\n' + "Artist: " + trackItems.artists[0].name + '\n' + "Spotify Link: " + trackItems.album.external_urls.spotify + '\n' + "Album Name: " + trackItems.album.name);
            });
        }


        break;
    // When a user uses the command "movie-this <'movie title'>", liri will pull the movie's: Title, Release Year, imdbRating, Rotten Tomatoes Score, Country in which production took place,Language, Plot, Actors and Actresses
    case "movie-this":
        var nodeArgs = process.argv;
        var movieName = "";
        // allows for more than one word to be used as one argument
        for (var i = 3; i < nodeArgs.length; i++) {

            if (i > 3 && i < nodeArgs.length) {

                movieName = movieName + "+" + nodeArgs[i];

            }
            else {

                movieName += nodeArgs[i];

            }
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        if (nodeArgs[3]) {
            request(queryUrl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("Title: " + JSON.parse(body).Title + '\n' + "Release Year: " + JSON.parse(body).Year + '\n' + "imdbRating: " + JSON.parse(body).imdbRating + '\n' + "Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value + '\n' + "Production: " + JSON.parse(body).Production + '\n' + "Language: " + JSON.parse(body).Language + '\n' + "Plot: " + JSON.parse(body).Plot + '\n' + "Actors/Actresses: " + JSON.parse(body).Actors);
                }
            });
        }
        //If the user does not provide a movie title, liri will default to providing information for the movie "Mr. Nobody"
        else {
            movieName = "Mr. Nobody";
            queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
            request(queryUrl, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("Title: " + JSON.parse(body).Title + '\n' + "Release Year: " + JSON.parse(body).Year + '\n' + "imdbRating: " + JSON.parse(body).imdbRating + '\n' + "Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value + '\n' + "Production: " + JSON.parse(body).Production + '\n' + "Language: " + JSON.parse(body).Language + '\n' + "Plot: " + JSON.parse(body).Plot + '\n' + "Actors/Actresses: " + JSON.parse(body).Actors);

                }
            });
        }


        break;
        // This command will pull information from Spotify for Taylor Swift's, "Gorgeous" from random.txt
    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }
            var output = data.split(",");
            spotify.search({ type: 'track', query: output[1], limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                trackItems = data.tracks.items[0];
                console.log("Song: " + trackItems.name + '\n' + "Artist: " + trackItems.artists[0].name + '\n' + "Spotify Link: " + trackItems.album.external_urls.spotify + '\n' + "Album Name: " + trackItems.album.name);
            });
        });
        break;
        // if the wrong command or no command is used, liri will display all valid commands
    default: console.log("Use one of the following commands: my-tweets, spotify-this-song, movie-this, or do-what-it-says")
};