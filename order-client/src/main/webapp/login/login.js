'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl',
            resolve: {
                init: ['$location', 'auth', function ($location, auth) {
                    if (auth.isLoggedIn()) {
                        $location.path("/placeorder");
                    }
                }]
            }
        });
    }])

    .controller('LoginCtrl', ['$scope', '$location', 'auth', function ($scope, $location, auth) {

        $scope.user = {};
        $scope.user.role = "customer";
        $scope.login = function () {
            auth.logIn($scope.user);
            $location.path("/placeorder");
        };


    }]);
