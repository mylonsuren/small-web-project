



var app = angular.module("app", []);

app.controller('submitPageController', function($scope, $http) {

    $(document).ready(function() {
        $scope.submissionreceived = false;
        $scope.warning = false
        $('.ui.selection.dropdown').dropdown();

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
    }



    $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
    .then(function(response) {
        $scope.entrants = response.data;

        // $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
        // .then(function(response_inter) {
            // $scope.logs = response_inter.data;

            //when submit button is clicked, update log, and update user's interaction array
            $scope.submitButtonClick = function() {



                var id = document.getElementById("name").value;
                var date = new Date(Date.parse(document.getElementById("date").value));
                var points = parseInt(document.getElementById("points").value);
                var description = document.getElementById("description").value;

                $scope.showId = id;
                $scope.showDate = date;
                $scope.showPoints = points;
                $scope.showDescription = description;

                if ($scope.showPoints < 0 || $scope.showPoints >= 20000) {
                    $scope.warning = true;
                    return;
                }


                for (var x in $scope.entrants) {
                    if (id === $scope.entrants[x]._id.$oid) {
                        $scope.person = $scope.entrants[x];
                        console.log($scope.person.fname)
                    }
                }

                var person_name = $scope.person.fname.toString() + " " + $scope.person.lname.toString();
                console.log(person_name);

                var final_interaction = {
                    "id": id.toString(),
                    "name": person_name,
                    "date": date,
                    "ptsawarded": points,
                    "description": description.toString()
                }

                $scope.person.interactions.push(final_interaction);
                console.log($scope.person.interactions);

                $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants/" + $scope.person._id.$oid + "?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
                  data: JSON.stringify( { "$set" : { "interactions" : $scope.person.interactions  } } ),
                  type: "PUT",
                  contentType: "application/json"
                });

                $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/interactions?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
        		  data: JSON.stringify({
                      "id": id.toString(),
                      "name": person_name,
                      "ptsonthisday": parseInt($scope.person.points) + parseInt(points),
                      "pic": $scope.person.pic,
                      "date": date,
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

        // });
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
