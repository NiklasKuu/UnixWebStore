
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
        .when('/login',{
        	templateUrl: 'partials/loginPage.html',
        	controller: 'LoginCtrl'
        })
        .when('/register',{
        	templateUrl: 'partials/registerPage.html',
        	controller: 'RegisterCtrl'
       	})
       	.when('/profile/:id',{
       		templateUrl: 'partials/profilePage.html',
       		controller: 'ProfileCtrl'
       	})
       	.when('/profile/:id/cart',{
       		templateUrl: 'partials/UserCartPage.html',
       		controller: 'CartCtrl'
       	})
       	.when('/users',{
       		templateUrl: 'partials/usersListPage.html',
       		controller: 'UsersListCtrl'
       	})
        .otherwise({
            redirectTo: '/'
        });
}]);

//service defintion

app.service('authentication', ['$window','$http', authenticationService]);


//controller definition
app.controller('HomeCtrl', ['$scope','$resource','$location','authentication',homeCtrl]);
app.controller('ProductListCtrl',['$scope','$resource','$location','$http','authentication',productListCtrl]);
app.controller('SearchCtrl',['$scope','$resource','$routeParams','$location','authentication',searchCtrl]);
app.controller('ProductCtrl',['$scope','$resource','$routeParams','$http','$location','authentication',productCtrl]);
app.controller('LoginCtrl',['$scope','$resource','$location','authentication',loginCtrl]);
app.controller('RegisterCtrl',['$scope','$resource','$location','authentication',registerCtrl]);
app.controller('ProfileCtrl',['$scope','$resource','$routeParams','$location','authentication',profileCtrl]);
app.controller('CartCtrl',['$scope','$resource','$routeParams','$http','$location','authentication',cartCtrl]);
app.controller('UsersListCtrl',['$scope','$resource','$location','authentication',usersListCtrl]);
