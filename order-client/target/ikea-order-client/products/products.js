'use strict';

angular.module('myApp.products', [ 'ngRoute', 'ngResource' ])

.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.when('/products', {
		templateUrl : 'products/products.html',
		controller : 'ProductsCtrl',
		resolve : {
			init : [ '$location', 'auth', function($location, auth) {
				if (!auth.isLoggedIn()) {
					$location.path("/login");
				}else{
					if(!(auth.getToken().role == "admin")){
						$location.path("/login");
					}
				}
			} ]
		}
	});
} ])

.controller(
		'ProductsCtrl',
		[
				'$scope',
				'$resource',
				'$location',
				'$http',
				'auth',
				function($scope, $resource, $location, $http, auth) {

					$scope.searchProduct = '';

					
					
					var Product = $resource(
							'http://localhost:8080/ikea-order/product/:productId',
							{
								productId : '@id'
							});

					
					$scope.products = Product.query();
				
					
					$scope.refresh = function(){
						$scope.products = Product.query();
					}


				} ]);