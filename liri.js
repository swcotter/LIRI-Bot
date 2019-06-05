require("dotenv").config();

//variables
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var moment = require("moment");
var fs = require("fs");
var argOne = process.argv[2];
var argTwo = process.argv.slice(3).join(" ");

//functions
//spotify function
function getSpotify(songName) {
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: songName, limit: 5 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var spotifyLog = "\n" + data.tracks.items[0].name + "\n" + "Artist(s): " + data.tracks.items[0].artists[0].name + "\n" + "Song name: " + data.tracks.items[0].name + "\n" + "Song preview: " + data.tracks.items[0].album.external_urls.spotify + "\n" + "Album name: " + data.tracks.items[0].album.name + "\n";
            console.log(spotifyLog);
            appendToFile(spotifyLog);
        }
    });
};

//movie-this function
function getMovie(movieName) {
    var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";

    request(url, function (error, response, body) {
        var jsonData = JSON.parse(body);
        if (error) {
            console.log('Error:', error);
        } else {
            var movieLog = "\n"+ 'Title: ' + jsonData.Title +"\n"+ 'Year: ' + jsonData.Year +"\n"+ 'IMDB Rated: ' + jsonData.imdbRating +"\n"+ 'Rotten Tomatoes Rated: ' + jsonData.tomatoRating +"\n"+ 'Country: ' + jsonData.Country +"\n"+ 'language ' + jsonData.Language +"\n"+ 'Plot: ' + jsonData.Plot +"\n"+ 'Actors: ' + jsonData.Actors +"\n";
            console.log(movieLog);
            appendToFile(movieLog);
        };
    });
};

//Concert-this function
function getConcert(artist) {
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp&date=upcoming";

    request(url, function (error, response, body) {
        var jsonData = JSON.parse(body);
        if (error) {
            console.log('Error:', error);
        } else {
            var eventDate = moment(jsonData[0].datetime).format("MM/DD/YYYY");
            var concertLog = "\n"+ 'Venue: ' + jsonData[0].venue.name +"\n"+ 'Venue location : ' + jsonData[0].venue.city + ", " + jsonData[0].venue.region +"\n"+ "Date: " + eventDate +"\n";
            console.log(concertLog);
            appendToFile(concertLog);
        }
    });
};

//do-what-it-says function
function getDoWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var randomAction = data.split(",");
        searchItem = randomAction[1];
        getSpotify(searchItem);
    });
}

// switch case function to decide between the different functions based off of the request
function pickFunction(caseData, functionData) {
    switch (caseData) {
        case 'movie-this':
            getMovie(functionData);
            break;
        case 'concert-this':
            getConcert(functionData);
            break;
        case 'do-what-it-says':
            getDoWhatItSays();
            break;
        case 'spotify-this-song':
            if (functionData == "") {
                functionData = "The Sign Ace";
            }
            getSpotify(functionData);
            break;
        default:
            console.log("Did not work")

    };
};

// BONOUS: to append content to the sample.txt file
function appendToFile(content) {
    fs.appendFile("sample.txt", content, function (err) {
        // If an error was experienced we will log it.
        if (err) {
            console.log(err);
        }
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
            console.log("Content Added to sample.txt file!");
        }
    });
}

//initial function call
pickFunction(argOne, argTwo);