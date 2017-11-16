
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
        .otherwise({
            redirectTo: '/'
        });
}]);


//controller definition
app.controller('HomeCtrl', ['$scope','$resource',homeCtrl]);
app.controller('ProductCtrl',['$scope','$resource',productCtrl]);




