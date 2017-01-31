'use strict';

angular.module('myApp.delivery', [ 'ngRoute','ngResource' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/delivery', {
		templateUrl : 'delivery/delivery.html',
		controller : 'DeliveryCtrl',
		resolve : {
			init : [ '$location', 'auth', function($location, auth) {
				if (!auth.isLoggedIn()) {
					$location.path("/login");
				}else{
					if(!(auth.getToken().role == "carrier")){
						$location.path("/placeorder");
					}
				}
			} ]
		}
	});
} ])

.controller('DeliveryCtrl', [
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
							
							$scope.orders = Order.query({status: "READYTODELIVER"});
							
							$scope.refresh = function(){
								$scope.orders = Order.query({status: "READYTODELIVER"});
							}

							
							$scope.deliverOrder = function(order){
								
								var req = {
										method : 'POST',
										url : 'http://localhost:8080/engine-rest/message/',
										headers : {
											'Content-Type' : 'application/json'
										},
										data : {
											"messageName" : "PRODUCTRECIEVED",
											"businessKey" : order.token,
											"correlationKeys" : {}
										}
									}

									$http(req).then(function(success) {
										$scope.orders = Order.query({status: "READYTODELIVER"});
									}, function(error) {

									});
								
							}

} ]);