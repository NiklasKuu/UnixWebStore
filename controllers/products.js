const mongoose = require('mongoose');
const productModel = mongoose.model('ProductModel');

const respond = function(res,status,content){
	res.status(status);
	res.json(content);
}


module.exports.listAllProducts = function(req,res){
	productModel.find({},function(err,data){
		if(err){
			respond(res,400,{"error": err});
		}
		for(let i = 0; i < data.length;i++){
			data[i].price = (data[i].price/100).toFixed(2);
		}
		respond(res,200,data);
	});


}

module.exports.createNewProduct = function(req,res){
	let newProduct = new productModel();

	newProduct.name = req.body.name;
	newProduct.description = req.body.description;
	newProduct.setPrice(req.body.price);

	newProduct.save(function(err){
		if(err){
			respond(res,400,{"error": err});
		}
		respond(res,200,{"message": "product created"});
	});

}