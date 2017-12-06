

// function onSignIn(googleUser) {
//   // Useful data for your client-side scripts:
//   var profile = googleUser.getBasicProfile();
//   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
//   console.log('Full Name: ' + profile.getName());
//   console.log('Given Name: ' + profile.getGivenName());
//   console.log('Family Name: ' + profile.getFamilyName());
//   console.log("Image URL: " + profile.getImageUrl());
//   console.log("Email: " + profile.getEmail());
//
//
//
//   // The ID token you need to pass to your backend:
//   var id_token = googleUser.getAuthResponse().id_token;
//   console.log("ID Token: " + id_token);
// };



var app = angular.module("app", []);



app.controller('submitPageController', function($scope, $http) {

    $(document).ready(function() {
        $scope.submissionreceived = false;
        $scope.warningPts = false;
        $scope.warningDate = false;
        $scope.warningDescription = false;
        $scope.notSignedIn = true;

        // $('.ui.selection.dropdown').dropdown();

        $('#calendarDropdown').calendar({
            type: 'date',
            maxDate: new Date(),
            minDate: new Date('Dec 4, 2017')
        });

        var title = removeSlash(window.location.pathname.toString());
        console.log(window.location.pathname);
        console.log(title);
        $scope.navBarClick(title);
    });





    function removeSlash(text) {
        var name = text.toString();
        return name.substring(1);
    }

    function comparePoints(a,b) {
      if (parseInt(a.points) > parseInt(b.points))
        return -1;
      if (parseInt(a.points) < parseInt(b.points))
        return 1;
      return 0;
    }

    function comparePtsPerWeek(a,b) {
      if (parseInt(a.ptsperweek) > parseInt(b.ptsperweek))
        return -1;
      if (parseInt(a.ptsperweek) < parseInt(b.ptsperweek))
        return 1;
      return 0;
    }

    function compareInteractions(a,b) {
      if (parseInt(a.interactions.length) > parseInt(b.interactions.length))
        return -1;
      if (parseInt(a.interactions.length) < parseInt(b.interactions.length))
        return 1;
      return 0;
    }


    $scope.newSubmission = function() {
        var form = document.getElementById("submissionForm");
        form.reset();

        $('.ui.selection.dropdown')
            .dropdown('clear');

        $scope.submissionreceived = false;
        $scope.warningPts = false;
        $scope.warningDate = false;
        $scope.warningDescription = false;
    }



    $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
    .then(function(response) {
        $scope.entrants = response.data;

            //when submit button is clicked, update log, and update user's interaction array

            function onSignIn(googleUser) {
              // Useful data for your client-side scripts:
              var profile = googleUser.getBasicProfile();
              console.log("ID: " + profile.getId()); // Don't send this directly to your server!
              console.log('Full Name: ' + profile.getName());
              console.log('Given Name: ' + profile.getGivenName());
              console.log('Family Name: ' + profile.getFamilyName());
              console.log("Image URL: " + profile.getImageUrl());
              console.log("Email: " + profile.getEmail());



              $scope.$apply(function() {
                   $scope.user = {
                       fullName: profile.getName(),
                       givenName: profile.getGivenName(),
                       familyName: profile.getFamilyName(),
                       pic: profile.getImageUrl(),
                       email: profile.getEmail(),
                       id: profile.getId()
                   }

                   $scope.notSignedIn = false;
              });


              $scope.$apply(function() {
                    $scope.submitPlayer = findUser();
              });

              function findUser() {
                  if ($scope.user.fullName.includes("Mylon") || $scope.user.fullName.includes("mylon")) {
                      console.log('here');
                      return findPlayer('Mylon');
                  } else if ($scope.user.fullName.includes("Pratham") || $scope.user.fullName.includes("pratham") || $scope.user.fullName.includes("Desai")
                  || $scope.user.fullName.includes("desai")) {
                      return findPlayer('Pratham');
                  } else if ($scope.user.fullName.includes("Robert") || $scope.user.fullName.includes("robert") || $scope.user.fullName.includes("Kuramshin")
                    || $scope.user.fullName.includes("kuramshin")) {
                         return findPlayer('Robert');
                  } else if ($scope.user.fullName.includes("Aldrin") || $scope.user.fullName.includes("aldrin") || $scope.user.fullName.includes("Ramiro") || $scope.user.fullName.includes("ramiro")) {
                       return findPlayer('Aldrin');
                  } else if ($scope.user.fullName.includes("Chris") || $scope.user.fullName.includes("chris") || $scope.user.fullName.includes("Seniow") || $scope.user.fullName.includes("seniow")) {
                       return findPlayer('Chris');
                  } else if ($scope.user.fullName.includes("Navid") || $scope.user.fullName.includes("navid") || $scope.user.fullName.includes("Alaee") || $scope.user.fullName.includes("alaee")) {
                       return findPlayer('Navid');
                  } else if ($scope.user.fullName.includes("Jimmy") || $scope.user.fullName.includes("jimmy") || $scope.user.fullName.includes("Tam") || $scope.user.fullName.includes("tam")) {
                       return findPlayer('Jimmy');
                  }
              }

              function findPlayer(name) {
                  for (var i in $scope.entrants) {
                      if (name === $scope.entrants[i].fname) {
                          return $scope.entrants[i];
                      }
                  }
              }

               // $scope.submitPlayer = findUser();

              // The ID token you need to pass to your backend:
              var id_token = googleUser.getAuthResponse().id_token;
              console.log("ID Token: " + id_token);

              var name = profile.getName();

            };

            window.onSignIn = onSignIn;
            // $scope.$digest();


            $scope.submitButtonClick = function() {

                var id = $scope.submitPlayer._id.$oid;
                var date = new Date(Date.parse(document.getElementById("date").value));
                var points = parseInt(document.getElementById("points").value);
                var description = document.getElementById("description").value;

                $scope.showId = id;
                $scope.showDate = date;
                console.log($scope.showDate instanceof Date && !isNaN($scope.showDate.valueOf()));

                if(!($scope.showDate instanceof Date && !isNaN($scope.showDate.valueOf()))) {
                    console.log("HERERERE");
                    $scope.warningDate = true;
                    return;
                }

                $scope.showPoints = points;
                $scope.showDescription = description;

                if ($scope.showPoints < 0 || $scope.showPoints > 20000) {
                    $scope.warningPts = true;
                    return;
                }

                if ($scope.showDate < new Date('Dec 4 2017') || $scope.showDate > new Date()) {
                    $scope.warningDate = true;
                    return
                }

                if (!$scope.showPoints) {
                    $scope.warningPts = true;
                    return;
                }

                if ($scope.showDescription == "") {
                    $scope.warningDescription = true;
                    return;
                }

                // for (var x in $scope.entrants) {
                //     if (id === $scope.entrants[x]._id.$oid) {
                //         $scope.person = $scope.entrants[x];
                //         console.log($scope.person.fname)
                //     }
                // }

                var person_name = $scope.submitPlayer.fname.toString() + " " + $scope.submitPlayer.lname.toString();
                console.log(person_name);

                var final_interaction = {
                    "id": id.toString(),
                    "name": person_name,
                    "date": date,
                    "dateadded": new Date(),
                    "ptsawarded": points,
                    "description": description.toString()
                }

                $scope.submitPlayer.interactions.push(final_interaction);
                $scope.submitPlayer.interactions.length = 0;
                console.log($scope.submitPlayer.interactions);

                $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants/" + $scope.submitPlayer._id.$oid + "?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
                  data: JSON.stringify( { "$set" : { "interactions" : $scope.submitPlayer.interactions  } } ),
                  type: "PUT",
                  contentType: "application/json"
                });

                $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/interactions?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
        		  data: JSON.stringify({
                      "id": id.toString(),
                      "name": person_name,
                      "ptsonthisday": parseInt($scope.submitPlayer.points) + parseInt(points),
                      "pic": $scope.submitPlayer.pic,
                      "date": date,
                      "dateadded": new Date(),
                      "ptsawarded": points,
                      "description": description.toString()
                  }),
        		  type: "POST",
        		  contentType: "application/json" } );

                  $scope.submissionreceived = true;

            }




            for (var x in $scope.entrants) {
                var interactionsthisweek;

                var currentpoints = 0;

                for (var i in $scope.entrants[x].interactions) {
                    currentpoints += parseInt($scope.entrants[x].interactions[i].ptsawarded);
                }

                $scope.entrants[x].points = currentpoints;

                $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants/" + $scope.entrants[x]._id.$oid + "?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
                  data: JSON.stringify( { "$set" : { "points" : parseInt($scope.entrants[x].points) } } ),
                  type: "PUT",
                  contentType: "application/json"
                });

            }

    });


    $scope.navBar = [
        {
            title: "stats",
            active: false
        },
        {
            title: "players",
            active: false
        },
        {
            title: "news",
            active: false
        },
        {
            title: "rules",
            active: false
        },
        {
            title: "submit",
            active: false
        }
    ];

    $scope.navBarClick = function(item) {
        console.log(item);
        for (var i in $scope.navBar) {
            if ($scope.navBar[i].title == item) {
                $scope.navBar[i].active = true;
            } else {
                $scope.navBar[i].active = false;
            }
        }
    }


    $scope.round = function (value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }



});
