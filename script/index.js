



var app = angular.module("app", []);

app.controller('indexPageController', function($scope, $http) {

    $(document).ready(function() {
        if (document.title != "Shabba Championship") {
            $scope.navBarClick(document.title.toLowerCase());
        } else {
            $scope.navBarClick('home');
        }
    });

    $http.get("https://api.mlab.com/api/1/databases/shabba-championship/collections/entrants?apiKey=LsLTrgh9YNAnjrItyn7MYJKmzXKt7nqb")
    .then(function(response) {
        $scope.entrants = response.data;

        for (var x  in $scope.entrants) {
            for (var y in $scope.entrants) {
                if ($scope.entrants[x].points > $scope.entrants[y].points) {
                    var temp = $scope.entrants[x];
                    $scope.entrants[x] = $scope.entrants[y]
                    $scope.entrants[y] = temp;
                }
            }
        }

        for (var x in $scope.entrants) {
            console.log($scope.entrants[x].points);
            $scope.entrants[x].position = parseInt(x) + 1;
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
