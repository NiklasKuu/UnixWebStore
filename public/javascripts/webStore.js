
var app = angular.module('webstore',['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/products',{
        	templateUrl: 'partials/products.html',
        	controller: 'ProductListCtrl'
        })
        .when('/search/:name',{
        	templateUrl: 'partials/searchList.html',
        	controller: 'SearchCtrl'
        })
        .when('/product/:id',{
        	templateUrl: 'partials/product.html',
        	controller: 'ProductCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

//service defintion

app.service('authentication', ['$window','$http', authenticationService]);


//controller definition
app.controller('HomeCtrl', ['$scope','$resource','$location',homeCtrl]);
app.controller('ProductListCtrl',['$scope','$resource','$location',productListCtrl]);
app.controller('SearchCtrl',['$scope','$resource','$routeParams','$location',searchCtrl]);
app.controller('ProductCtrl',['$scope','$resource','$routeParams',productCtrl]);


