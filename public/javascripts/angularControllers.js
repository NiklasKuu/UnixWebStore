var homeCtrl = function($scope,$resource){
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
					console.log(fullProductlist[i].name.toLowerCase() + ":" + $scope.productSearch.toLowerCase());
					$scope.productSearchRecomendation.push(fullProductlist[i].name);
				}
			}
		});
	}

};

var productCtrl = function($scope,$resource){
	var AllProducts = $resource('/api/products');
	AllProducts.query(function(allProducts){
		$scope.products = allProducts;
	});
}