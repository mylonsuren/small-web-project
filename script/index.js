



var app = angular.module("app", []);

app.controller('indexPageController', function($scope, $http) {

    $(document).ready(function() {
        if (document.title != "Shabba Championship") {
            $scope.navBarClick(document.title.toLowerCase());
        } else {
            $scope.navBarClick('home');
        }
    });

    function compare(a,b) {
      if (parseInt(a.points) > parseInt(b.points))
        return -1;
      if (parseInt(a.points) < parseInt(b.points))
        return 1;
      return 0;
    }



    $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
    .then(function(response) {
        $scope.entrants = response.data;

        $scope.entrants.sort(compare);


        for (var x in $scope.entrants) {
            console.log($scope.entrants[x].points);
            $scope.entrants[x].position = parseInt(x) + 1;
            console.log($scope.entrants[x]._id.$oid);
            $.ajax( { url: "https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants/" + $scope.entrants[x]._id.$oid + "?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb",
    		  data: JSON.stringify( { "$set" : { "position" : parseInt(x)+1 } } ),
    		  type: "PUT",
    		  contentType: "application/json"
            });
        }

    });




    $scope.categories = [
        {
            title: 'Position',
            abv: 'pos'
        },
        {
            title: 'Entrant',
            abv: 'entrant'
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
            title: "home",
            active: true
        },
        {
            title: "standings",
            active: false
        },
        {
            title: "entrants",
            active: false
        },
        {
            title: "news",
            active: false
        },
    ];

    $scope.navBarClick = function(item) {
        for (var i in $scope.navBar) {
            if ($scope.navBar[i].title == item) {
                $scope.navBar[i].active = true;
            } else {
                $scope.navBar[i].active = false;
            }
        }
    }


});
