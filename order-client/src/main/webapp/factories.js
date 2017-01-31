/**
 *
 */

var app = angular
		.module("myApp")

		.factory(
				'auth',
				[
						'$http',
						'$window',
						function($http, $window) {
							var auth = {};

							auth.saveToken = function(token) {
								$window.localStorage['ikea-order-token'] = JSON
										.stringify(token);
							};

							auth.getToken = function() {
								if ($window.localStorage['ikea-order-token']) {
									return JSON
											.parse($window.localStorage['ikea-order-token']);
								}
								return $window.localStorage['ikea-order-token'];
							};

							auth.generateUUID = function guid() {
								function s4() {
									return Math.floor(
											(1 + Math.random()) * 0x10000)
											.toString(16).substring(1);
								}
								return s4() + s4() + '-' + s4() + '-' + s4()
										+ '-' + s4() + '-' + s4() + s4() + s4();
							}

							auth.isLoggedIn = function() {
								var token = auth.getToken();

								if (token) {
									return true;
								} else {
									return false;
								}
							};

							auth.isCarrier = function() {
								if ($window.localStorage['ikea-order-token']) {
									var token = JSON
											.parse($window.localStorage['ikea-order-token']);
									return token.role == "carrier";
								}
								return $window.localStorage['ikea-order-token'];
							}
							
							auth.isAdmin = function() {
								if ($window.localStorage['ikea-order-token']) {
									var token = JSON
											.parse($window.localStorage['ikea-order-token']);
									return token.role == "admin";
								}
								return $window.localStorage['ikea-order-token'];
							}

							auth.currentUser = function() {
								if (auth.isLoggedIn()) {
									var token = auth.getToken();
									return token;
								}
							};

							auth.logIn = function(user) {
								auth.saveToken(user);
							};

							auth.logOut = function() {
								$window.localStorage
										.removeItem('ikea-order-token');
							};

							return auth;
						} ]);
