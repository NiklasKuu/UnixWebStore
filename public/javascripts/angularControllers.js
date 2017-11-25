var homeCtrl = function($scope,$resource,$location,authentication){
	$scope.isLoggedIn = authentication.isLoggedIn();
	$scope.currentUser = authentication.currentUser();

	$scope.logout = function(){
        authentication.logout();
        location.reload();
    }


	var NewestProducts = $resource('/api/products/newest')
	NewestProducts.query(function(newestProductsList){
		$scope.newProducts = newestProductsList.slice(0,4);
	});
	var PopularProducts = $resource('/api/products/popular');
	PopularProducts.query(function(popularProductsList){
		$scope.popularProducts = popularProductsList.slice(0,4);
	});
	var AllProducts = $resource('/api/products');
	$scope.generateRecomendation = function(){
		$scope.productSearchRecomendation = new Array();
		AllProducts.query(function(fullProductlist){
			for(var i = 0; i < fullProductlist.length;i++){	//checking each product and checking if user input is a sub string
				if(fullProductlist[i].name.toLowerCase().indexOf($scope.productSearch.toLowerCase()) !== -1){
					$scope.productSearchRecomendation.push(fullProductlist[i].name);
				}
			}
		});
	}

	$scope.submit = function(){
		$location.path('/search/'+$scope.productSearch);
	}
};

var productListCtrl = function($scope,$resource,$location,$http,authentication){
	$scope.isLoggedIn = authentication.isLoggedIn();
	$scope.currentUser = authentication.currentUser();

	$scope.logout = function(){
        authentication.logout();
        location.reload();
    }


    $scope.renderProducts = function(){
    	var AllProducts = $resource('/api/products');
		AllProducts.query(function(allProducts){
			$scope.products = allProducts;
		});	
    }
	$scope.renderProducts();

	$scope.createProduct = function(){
		console.log('creating');
		$http.post('api/products/',$scope.product,{
			headers:{ Authorization: "Bearer " + authentication.getToken()}
		}).then(function(data){
			$scope.creationSuccess = true;
			$scope.creationFail = false;
			$scope.creationMessage = data.data.message;
			$scope.renderProducts();
		},function(err){
			$scope.creationSuccess = false;
			$scope.creationFail = true;
			$scope.creationMessage = err.data.message;
		});
	}

	$scope.generateRecomendation = function(){
		$scope.productSearchRecomendation = new Array();
		AllProducts.query(function(fullProductlist){
			for(var i = 0; i < fullProductlist.length;i++){	//checking each product and checking if user input is a sub string
				if(fullProductlist[i].name.toLowerCase().indexOf($scope.productSearch.toLowerCase()) !== -1){
					$scope.productSearchRecomendation.push(fullProductlist[i].name);
				}
			}
		});
	}

	$scope.submit = function(){
		$location.path('/search/'+$scope.productSearch);
	}
}

var searchCtrl = function($scope, $resource,$routeParams,$location,authentication){
	$scope.isLoggedIn = authentication.isLoggedIn();
	$scope.currentUser = authentication.currentUser();
	$scope.logout = function(){
        authentication.logout();
        location.reload();
    }

	var AllProducts = $resource('/api/products');
	AllProducts.query(function(allProducts){
		$scope.searchResults = new Array();
		for(var i = 0; i < allProducts.length;++i){
			if(allProducts[i].name.toLowerCase().indexOf($routeParams.name.toLowerCase()) !== -1){
				$scope.searchResults.push(allProducts[i]);
			}
		}
	});

	$scope.generateRecomendation = function(){
		$scope.productSearchRecomendation = new Array();
		AllProducts.query(function(fullProductlist){
			for(var i = 0; i < fullProductlist.length;i++){	//checking each product and checking if user input is a sub string
				if(fullProductlist[i].name.toLowerCase().indexOf($scope.productSearch.toLowerCase()) !== -1){
					$scope.productSearchRecomendation.push(fullProductlist[i].name);
				}
			}
		});
	}

	$scope.submit = function(){
		$location.path('/search/'+$scope.productSearch);
	}
};

var productCtrl = function($scope,$resource,$routeParams,$http,$location,authentication){
	$scope.isLoggedIn = authentication.isLoggedIn();
	$scope.currentUser = authentication.currentUser();
	$scope.logout = function(){
        authentication.logout();
        location.reload();
    }

    $scope.renderProduct = function(){
    	var Product = $resource('/api/products/' + $routeParams.id);
		Product.query(function(product){
			$scope.product = product[0];
		});	
    }
    $scope.renderProduct();


	var AllProducts = $resource('/api/products');
	$scope.generateRecomendation = function(){
		$scope.productSearchRecomendation = new Array();
		AllProducts.query(function(fullProductlist){
			for(var i = 0; i < fullProductlist.length;i++){	//checking each product and checking if user input is a sub string
				if(fullProductlist[i].name.toLowerCase().indexOf($scope.productSearch.toLowerCase()) !== -1){
					$scope.productSearchRecomendation.push(fullProductlist[i].name);
				}
			}
		});
	}

	$scope.editProduct = function(){
		$http.put('api/products/' + $scope.product._id,$scope.product,{
			headers:{ Authorization: "Bearer " + authentication.getToken()}
		}).then(function(data){
			$scope.purchaseSuccess = true;
			$scope.purchaseFail = false;
			$scope.purchaseMessage = data.data.message;
			$scope.renderProduct();
		},function(err){
			$scope.purchaseSuccess = false;
			$scope.purchaseFail = true;
			$scope.purchaseMessage = err.data.message;
			$scope.renderProduct();
		});
	}
	
	$scope.changeStock = function(){
		$http.put('api/products/' + $scope.product._id + '/stock',{
			'stock': $scope.newStock
		},{
			headers:{ Authorization: "Bearer " + authentication.getToken()}
		}).then(function(data){
			$scope.purchaseSuccess = true;
			$scope.purchaseFail = false;
			$scope.purchaseMessage = data.data.message;
			$scope.renderProduct();
		},function(err){
			$scope.purchaseSuccess = false;
			$scope.purchaseFail = true;
			$scope.purchaseMessage = err.data.message;
			$scope.renderProduct();
		});
	}

	$scope.purchase = function(){
		$http.post('/api/products/' + $scope.product._id + '/purchase',{
			'amount': $scope.amount,
			'payment': $scope.payment
		},{
			headers:{Authorization: "Bearer " + authentication.getToken()}
		}).then(function(data){
			$scope.purchaseSuccess = true;
			$scope.purchaseFail = false;
			$scope.purchaseMessage = data.data.message;
			$scope.renderProduct();
		},function(err){
			$scope.purchaseSuccess = false;
			$scope.purchaseFail = true;
			$scope.purchaseMessage = err.data.message;
			$scope.renderProduct();
		});

	};

	$scope.deleteProduct = function(){
		$http.delete('/api/products/' + $scope.product._id,{
			headers:{Authorization: "Bearer " + authentication.getToken()}
		}).then(function(data){
			$location.path('/');
			location.reload();		// have to reload the page to get rid of modal
		},function(err){
			$scope.purchaseSuccess = false;
			$scope.purchaseFail = true;
			$scope.purchaseMessage = err.data.message;
			$scope.renderProduct();
		});
	}

	$scope.submit = function(){
		$location.path('/search/'+$scope.productSearch);
	};
};

var loginCtrl = function($scope,$resource,$location,authentication){
	$scope.logInUser = function(){
		authentication.login($scope.user).then(function(){
			$location.path('/');
		}).catch(function(err){
			$scope.failure = true;
			$scope.message = err.data.message;
		});
	};
};

var registerCtrl = function($scope,$resource,$location,authentication){
	$scope.registerUser = function(){
		authentication.register($scope.user).then(function(){
			$location.path('/');
		}).catch(function(err){
			$scope.failure = true;
			$scope.message = err.data.message;
		});
	}
};

var profileCtrl = function($scope,$resource,$routeParams,authentication){
	$scope.isLoggedIn = authentication.isLoggedIn();
	$scope.currentUser = authentication.currentUser();
	$scope.logout = function(){
        authentication.logout();
        location.reload();
    }

	$scope.generateRecomendation = function(){
		$scope.productSearchRecomendation = new Array();
		AllProducts.query(function(fullProductlist){
			for(var i = 0; i < fullProductlist.length;i++){	//checking each product and checking if user input is a sub string
				if(fullProductlist[i].name.toLowerCase().indexOf($scope.productSearch.toLowerCase()) !== -1){
					$scope.productSearchRecomendation.push(fullProductlist[i].name);
				}
			}
		});
	}

	$scope.submit = function(){
		$location.path('/search/'+$scope.productSearch);
	}

	$scope.showCorrectAccountType = function(accountType){
		if(accountType === 1){
			return "Administrator";
		} else if(accountType === 2){
			return "Employee";
		} else {
			return "Customer";
		}
	}

	$scope.productName = function(productId){
		var Product = $resource('/api/products/' + productId);
		Product.query(function(product){
		return product.name;
	});
	}

	var User = $resource('/api/users/' + authentication.currentUser().id,{},{
		query: {
			method: 'GET',
			headers: {Authorization: "Bearer " + authentication.getToken()}
		}
	});
	User.query(function(user){
		$scope.user = user;
	});


};