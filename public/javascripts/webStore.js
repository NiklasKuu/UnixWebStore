
var app = angular.module('webstore',['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeCtrl'
        })
        .when('/products',{
        	templateUrl: 'partials/products.html',
        	controller: 'ProductCtrl'
        })
        .when('/search/:name',{
        	templateUrl: 'partials/searchList.html',
        	controller: 'SearchCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);


//controller definition
app.controller('HomeCtrl', ['$scope','$resource','$location',homeCtrl]);
app.controller('ProductCtrl',['$scope','$resource','$location',productCtrl]);
app.controller('SearchCtrl',['$scope','$resource','$routeParams','$location',searchCtrl]);



