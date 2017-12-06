



var app = angular.module("app", []);


app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.controller('newsPageController', function($scope, $http) {

    $(document).ready(function() {
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

    $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
    .then(function(response) {
        $scope.entrants = response.data;

        $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/interactions?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
        .then(function(response_inter) {
            $scope.logs = response_inter.data;

            console.log($scope.logs);





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


    $scope.formatDate = function(date) {

        date = new Date(date);

        var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return monthNames[monthIndex] + ' ' + day + ', ' + year;
    }



});
