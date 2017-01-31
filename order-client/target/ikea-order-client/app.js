'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'myApp.placeorder',
  'myApp.products',
  'myApp.orders',
  'myApp.delivery',
  'myApp.messages',
  'myApp.login',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  
  $routeProvider.otherwise({redirectTo: '/login'});
}]);


myApp.controller('HeaderController', ['$scope','$location', 'auth', function ($scope,$location,auth) {

  $scope.isLoggedIn = function(){
    return auth.isLoggedIn();
  };
  
  
  $scope.isCustomer = function(){
	 var value = auth.isCarrier();
	  return !value;
  }
  
  $scope.isAdmin = function(){
		 var value = auth.isAdmin();
		  return value;
	  }

  $scope.logOut = function () {
    auth.logOut();
    $location.path("/login");
  };

}]);