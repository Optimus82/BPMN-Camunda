'use strict';

angular
		.module('myApp.placeorder', [ 'ngRoute', 'ngResource' ])

		.config([ '$routeProvider', function($routeProvider) {
			$routeProvider.when('/placeorder', {
				templateUrl : 'placeorder/placeorder.html',
				controller : 'PlaceorderCtrl',
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
				'PlaceorderCtrl',
				[
						'$scope',
						'$resource',
						'$location',
						'$http',
						'auth',
						function($scope, $resource, $location, $http, auth) {

							$scope.product = {};
							$scope.product.price = 0;
							$scope.amount = 1;

							var Product = $resource(
									'http://localhost:8080/ikea-order/product/:productId',
									{
										productId : '@id'
									});
							
							Product.query(function(result) {
								$scope.products = result;
							});

							$scope.placeOrder = function() {
								

								

								$http(
										{
											method : 'GET',
											url : 'http://localhost:8080/engine-rest/process-definition/key/ikea-order'
										}).then(
										function successCallback(response) {

											var processID = response.data.id;
											var prod = $scope.product.name;
											var number = $scope.amount;
											var authToken = auth.getToken();
											var mail = authToken.mail;
											var token = auth.generateUUID();
											
											var req = {
													method : 'POST',
													url : 'http://localhost:8080/engine-rest/process-definition/' + processID + '/start',
													headers : {
														'Content-Type' : 'application/json'
													},
													data : {
														"variables" : {
															"product" : {
																"value" : prod,
																"type" : "String"
															},
															"amount" : {
																"value" : number,
																"type" : "long"
															},
															"mail" : {
																"value" : mail,
																"type" : "String"
															},
															"token" : {
																"value" : token,
																"type" : "String"
															}
														},
														"businessKey" : token
													}
												}
											
											
											$http(req).then(
													function(success) {
														
														$scope.product = {};
														$scope.product.price = 0;
														$scope.amount = 1;
														
													}, function(error) {

														
													});

										}, function errorCallback(response) {
									
										});

							}

						} ]);