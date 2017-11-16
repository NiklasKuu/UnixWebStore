var homeCtrl = function($scope,$resource){
	var NewestProducts = $resource('/api/products/newest')
	NewestProducts.query(function(newestProductsList){
		$scope.newProducts = newestProductsList.slice(0,4);
	});
	var PopularProcucts = $resource('/api/products/popular');
	
	PopularProcucts.query(function(popularProductsList){
		$scope.popularProducts = popularProductsList.slice(0,4);
	});
};