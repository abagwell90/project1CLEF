 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyCX0NedGLciVNj9ceBGFSRJCVE_uA7SDw4",
    authDomain: "project1-810bd.firebaseapp.com",
    databaseURL: "https://project1-810bd.firebaseio.com",
    projectId: "project1-810bd",
    storageBucket: "project1-810bd.appspot.com",
    messagingSenderId: "966211961742"
  };
  firebase.initializeApp(config);

//Create Firebase Refs
var database = firebase.database();
var artistsRef = database.ref().child('Artists');
$("#tracksTitle").hide();

$(document).ready(function () {
    
    //Initial buttons upon first load
    var topics = ["Usher", "Foo Fighters", "Green Day", "Black Sabbath", "Kanye", "Cage The Elephant", "Will Smith", "Beyonce"];


    //AJAX CALL #1: MUSIXMATCH API
    function getLyrics(artist) {
        $("#tracksTitle").show();
    var artistSearch = artist;
      document.getElementById("lyrics").textContent = "";
      $.ajax({
        type: "GET",
        data: {
          apikey: "52afe18d818dd653f0b7c539957ee597",
          q_artist: artistSearch,
          format: "jsonp",
          callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: "jsonp_callback",
        contentType: "application/json",
        success: function(data) {
          var randomTracks = data.message.body.track_list;
          for (var i = 0; i < randomTracks.length; i++) {
            var thisTrack = randomTracks[i].track.track_name;

            var p = document.createElement("p");
            p.textContent = `"${thisTrack}"`;
            p.id = thisTrack;

            document.getElementById("lyrics").appendChild(p).style.opacity = 1;
            var b = document.createElement("br");
            document.getElementById("lyrics").appendChild(b).style.opacity = 1;
            var b2 = document.createElement("br");
            document.getElementById("lyrics").appendChild(b2).style.opacity = 1;
            var b3 = document.createElement("br");
            document.getElementById("lyrics").appendChild(b3).style.opacity = 1;

          }
          document.getElementById("tracksTitle").setAttribute("opacity", "1.0");
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        }
      });
    }

    //AJAX CALL #2: GIPHY API
    function displaySpaceStuff() {
        var space = $(this).attr("data-name");
        $("#artistName").text(`${space}'s`);
        // console.log(space);
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + space + "&api_key=mePpseQoZWWEY5RregXq0iDwpYlq2U9J&limit=10";
        getLyrics(space);
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            $("#space-value").empty();
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                var space = $("<div class='spaceGif'>");
                var rating = response.data[i].rating;
                var picRating = $("<p>").text("Rating: " + rating);
                var picStill = response.data[i].images.fixed_height_still.url;
                var picAnimate = response.data[i].images.fixed_height.url;
                var image = $("<img>").addClass("image").attr("src", picAnimate).attr("data-still", picStill).attr("data-animate", picAnimate).attr("data-state", "still");

                space.append(image);
                // space.append(picRating);

                if (rating === 'pg' || rating === 'g') {
                    space.append(image);
                    $("#space-value").append(space);
                }
            }

            $(".image").on("click", function () {
                var state = $(this).attr("data-state");

                if (state === "still") {
                    $(this).attr("src", $(this).attr("data-animate"));
                    $(this).attr("data-state", "animate");
                } else {
                    $(this).attr("src", $(this).attr("data-still"));
                    $(this).attr("data-state", "still");
                }
            });

            //AUTO-SCROLL GIF FUNCTIONALITY
            if ($('#space-value').height() > ($("#backgroundcolor1").height() - 30)) {
                setInterval(function () {
                start();
            }, 500); 
        
            }

            function animateContent(direction) {  
            var animationOffset = $('#backgroundcolor1').height() - $('#space-value').height()-30;
            if (direction == 'up') {
                animationOffset = 0;
            }
        
            $('#space-value').animate({ "marginTop": (animationOffset)+ "px" }, 25000);
            }
        
            function up(){
                animateContent("up")
            }
            function down(){
                animateContent("down")
            }
        
            function start(){
                setTimeout(function () {
                down();
            }, 1000);
                setTimeout(function () {
                up();
            }, 1000);
            }    
        
        });
    }

    function myButtons() {
        $("#myButtons").empty();
        for (var i = 0; i < topics.length; i++) {
            var z = $("<button>");
            z.addClass("spaceClass");
            z.addClass("hvr-pulse-shrink");
            z.attr("data-name", topics[i]);
            z.text(topics[i]);
            $("#myButtons").append(z);
        }
    }

    $("#spaceTheme").on("click", function (event) {
        
        event.preventDefault();
        var space = $("#space-input").val().trim();
        var newArtist = {
            name: space,
        };
       
        artistsRef.push(newArtist);

        if (space != '' && !topics.includes(space)) {
            topics.push(space);
            $("#space-input").val(" ");
            myButtons();
        }
    });


    $(document).on("click", ".spaceClass", displaySpaceStuff);
    myButtons();
});
