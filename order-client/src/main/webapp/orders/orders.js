'use strict';

angular.module('myApp.orders', [ 'ngRoute', 'ngResource' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/orders', {
		templateUrl : 'orders/orders.html',
		controller : 'OrdersCtrl',
		resolve : {
			init : [ '$location', 'auth', function($location, auth) {
				if (!auth.isLoggedIn()) {
					$location.path("/login");
				}else{
					if(auth.getToken().role == "carrier"){
						$location.path("/delivery");
					}
				}
			} ]
		}
	});
} ])

.controller(
		'OrdersCtrl',
		[
				'$scope',
				'$resource',
				'$location',
				'$http',
				'auth',
				function($scope, $resource, $location, $http, auth) {

					$scope.searchOrder = '';

					
					
					var Order = $resource(
							'http://localhost:8080/ikea-order/order/:orderId',
							{
								orderId : '@id'
							});

					
					$scope.orders = Order.query({
						customer : auth.getToken().mail
					});

					$scope.canPay = function(order) {
						return order.status == 'ACCEPTED';
					}
					
					$scope.refresh = function(){
						$scope.orders = Order.query({
							customer : auth.getToken().mail
						});
					}

					$scope.payOrder = function(order) {

						var req = {
							method : 'POST',
							url : 'http://localhost:8080/engine-rest/message/',
							headers : {
								'Content-Type' : 'application/json'
							},
							data : {
								"messageName" : "PAYMENT",
								"businessKey" : order.token,
								"correlationKeys" : {}
							}
						}

						$http(req).then(function(success) {
							
							$scope.orders = Order.query({
								customer : auth.getToken().mail
							});

						}, function(error) {

						});

					}

				} ]);