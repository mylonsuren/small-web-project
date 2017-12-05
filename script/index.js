



var app = angular.module("app", []);

app.controller('indexPageController', function($scope, $http) {

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




    $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
    .then(function(response) {
        $scope.entrants = response.data;

        $scope.entrants.sort(comparePoints);


        for (var x in $scope.entrants) {
            console.log($scope.entrants[x].points);
            $scope.entrants[x].position = parseInt(x) + 1;
            console.log($scope.entrants[x]._id.$oid);
            $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants/" + $scope.entrants[x]._id.$oid + "?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
    		  data: JSON.stringify( { "$set" : { "position" : parseInt(x)+1 } } ),
    		  type: "PUT",
    		  contentType: "application/json"
            });

            $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants/" + $scope.entrants[x]._id.$oid + "?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
              data: JSON.stringify( { "$set" : { "ptsperweek" : $scope.ptsPerWeek($scope.entrants[x]) } } ),
              type: "PUT",
              contentType: "application/json"
            });
        }

        $scope.ptsperweekSort = $scope.entrants;
        $scope.ptsperweekSort.sort(comparePtsPerWeek);

    });




    $scope.categories = [
        {
            title: 'Position',
            abv: 'pos'
        },
        {
            title: 'Entrant',
            abv: 'player'
        },
        {
            title: 'Nationality',
            abv: 'nationality'
        },
        {
            title: 'School',
            abv: 'school'
        },
        {
            title: 'Points',
            abv: 'pts'
        }
    ];

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

    $scope.totalCareerPts = function(player) {
        var sum = 0;
        for (var i in player.prev_record) {
            sum += parseInt(player.prev_record[i].points);
        }

        sum +=  parseInt(player.points);
        return sum;

    }

    function parseDate(str) {
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }

    function daydiff(first, second) {
        return Math.round((second-first)/(1000*60*60*24));
    }


    $scope.ptsPerWeek = function(player) {

        var today = new Date();
        var first = new Date("October 13, 2017")

        var numDays = daydiff(first, today);
        var ptsperweek = $scope.round(parseInt(player.points)/(numDays/7), 2);

        return ptsperweek;

    }


    $scope.round = function (value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }



});
