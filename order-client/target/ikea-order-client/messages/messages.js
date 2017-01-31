'use strict';

angular.module('myApp.messages', [ 'ngRoute', 'ngResource' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/messages', {
		templateUrl : 'messages/messages.html',
		controller : 'MessagesCtrl',
		resolve : {
			init : [ '$location', 'auth', function($location, auth) {
				if (!auth.isLoggedIn()) {
					$location.path("/login");
				}else{
					if(auth.getToken().carrier){
						$location.path("/delivery");
					}
				}
			} ]
		}
	});
} ])

.controller(
		'MessagesCtrl',
		[
				'$scope',
				'$resource',
				'$location',
				'$http',
				'auth',
				function($scope, $resource, $location, $http, auth) {

					$scope.searchMessage = '';

					var Message = $resource(
							'http://localhost:8080/ikea-order/message/:messageId',
							{
								orderId : '@messageId'
							});

					
					$scope.messages = Message.query({
						customer : auth.getToken().mail
					});

					$scope.refresh = function(){
						$scope.messages = Message.query({
							customer : auth.getToken().mail
						});
					}

				} ]);