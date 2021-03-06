const mongoose = require('mongoose');
const productModel = mongoose.model('ProductModel');
const userModel = mongoose.model('UserModel');

const respond = function(res,status,content){
	res.status(status);
	res.json(content);
}

const notAuthorized = function(res,accountType,neededType){
	respond(res,401,{
			"message": "UnauthorizedError: User is not authorized to commit this action.\
			 Was " + accountType + " needs to be: " + neededType
		});
}


module.exports.listAllProducts = function(req,res){
	productModel.find({},function(err,data){
		if(err){
			respond(res,400,err);
		} else {
			for(let i = 0; i < data.length;i++){
			data[i].price = (data[i].price/100).toFixed(2);
			}
			respond(res,200,data);
		}
	});
}


module.exports.createNewProduct = function(req,res){
	//only do if Userlevel is 1
	if(req.payload.accountType === 1){

		//send error if requrest lacks name or description, or price
		if(!req.body.name || !req.body.description || !req.body.price) {
			respond(res,400,{"message": "Not all required parameters were entered"});
			return;
		}


		let newProduct = new productModel();

		newProduct.name = req.body.name;
		newProduct.description = req.body.description;
		newProduct.setPrice(req.body.price);

		if(req.body.image){
			newProduct.image = req.body.image;
		}

		if(req.body.stock){
			newProduct.stock = req.body.stock;	
		}
		

		newProduct.save(function(err){
			if(err){
				respond(res,400,err);
			} else {
				respond(res,200,{"message": "product created"});
			}
		});
	} else {
		notAuthorized(res,req.payload.accountType,1);
	}
}

module.exports.getProduct = function(req,res){
	productModel.findOne({_id:req.params.id},function(err,data){
		if(err){
			respond(res,400,err);
		} else {
			data.price = (data.price/100).toFixed(2);
			singleDataArray = new Array();
			singleDataArray.push(data);
			respond(res,200,singleDataArray);
		}
	});
}

module.exports.editProduct = function(req,res){
	if(req.payload.accountType === 1){
		if(!req.params.id || !req.body.name || !req.body.description || !req.body.price || (!req.body.stock && req.body.stock != 0) || (!req.body.bought && req.body.bought != 0)){
			respond(res,400, {"message": "Not all required parameters were entered"});
			return;
		}
		//send error if request stock is under 0
		if(req.body.stock < 0){
			respond(res,400,{"message": "Incorrect Stock value entered."});
			return;
		}
		//send error if price is 0 or under 0
		if(req.body.price <= 0){
			respond(res,400,{"message": "Incorrect Price entered."});
			return;
		}


		productModel.findOne({_id:req.params.id},function(err,data){
			data.name = req.body.name;
			data.description = req.body.description;
			data.setPrice(req.body.price);
			data.stock = req.body.stock;
			data.bought = req.body.bought;
			data.timeStamp = Date.now();

			if(req.body.image){
				data.image = req.body.image;
			}

			data.save(function(err){
				if(err){
					respond(res,400,err);
				} else {
					respond(res,200,{"message": "Product edited successfully"});
				}
			});	
		})

	} else {
		notAuthorized(res,req.payload.accountType,1);
	}
};

module.exports.editProductStock = function(req,res){
	if(req.payload.accountType < 3){

		//send error if request lacks id parameter
		if(!req.params.id || (!req.body.stock && req.body.stock !== 0)){
			respond(res,400,{"message": "Not all required parameters were entered."});
			return;
		}
		//send error if request stock is under 0
		if(req.body.stock < 0){
			respond(res,400,{"message": "Incorrect Stock value entered."});
			return;
		}


		productModel.findOne({_id:req.params.id},function(err,data){
			if(err){
				respond(res,400,err);
			} else {
				data.stock = req.body.stock;

				data.save(function(err){
					if(err){
						respond(res,400,err);
					} else {
						respond(res,200,{"message": "Product stock saved successfully"});
					}
				});
			}
		});
	} else {
		notAuthorized(res,req.payload.accountType,2);
	}
}

module.exports.deleteProduct = function(req,res){
	if(req.payload.accountType === 1){
		if(!req.params.id){
			respond(res,400,{"message": "Not all required parameters were entered"});
		}
		productModel.findOne({_id: req.params.id}).remove(function(err){
			if(err){
				respond(res,400,err);
			} else {
				respond(res,200,{"message": "Product removed successfully"});
			}
		});

	} else {
		notAuthorized(res,req.payload.accountType,1);	
	}
}

module.exports.addToCart = function(req,res){
	if(!req.body.amount || req.body.amount <= 0){
		respond(res,400,{"message":"Incorrect product amount."});
		return;
	}
	productModel.findOne({_id:req.params.id},function(err,data){

		if(err){
			respond(res,400,err);
		} else if(!data){
			respond(res,400,{"message":"could not find product matching id"});
		} else if(data.stock < req.body.amount){
			respond(res,400,{"message":"Not enough stock for purchase."});
		} else {
			userModel.findOne({_id:req.payload._id},function(err,user){
				if(err){
					respond(res,400,err);
					return;
				}


				//checking if id is already in cart. If it is we add to its amount, otherwise we add a new product
				let found = false;
				for(let i = 0; i < user.cart.length;i++){
					if(user.cart[i].product  == req.params.id){
						found = true;
						user.cart[i].amount += req.body.amount;
					}
				}
				if(!found) {			// adding a new element into cart
					user.cart.push({
						product: req.params.id,
						amount: req.body.amount,
						name: data.name,
						price: (data.price/100).toFixed(2)
					});
				}
				user.save(function(err){
					if(err){
						respond(res,400,err);
					} else {
						respond(res,200,{"message": "Added to Cart"});
					}
				});
							
			});
		}
	});
}
/*
module.exports.purchaseProduct = function(req,res){
	productModel.findOne({_id:req.params.id},function(err,data){
		if(err){
			respond(res,400,err);
		} else if(!data){
			respond(res,400,{"message":"could not find product matching id"});
		} else {
			if((req.body.amount * (data.price/100).toFixed(2)) > req.body.payment){
				respond(res,400,{"message": "Payment was not large enough."})
			} else if((data.stock - req.body.amount ) < 0){
				respond(res,400,{"message": "Product does not have enough stock for purchase"});
			} else {
				userModel.findOne({_id:req.payload._id},function(err,foundUser){
					if(err){
						respond(res,400,err);
					} else if(!foundUser){
						respond(res,400,{"message":"Could not find user."});
					} else {
						foundUser.purchases.push({
							product: req.params.id,
							amount: req.body.amount,
							name: data.name,
							price: (data.price/100).toFixed(2)
						});
						foundUser.save(function(err){
							if(err){
								respond(res,400,err);
							} else {
								data.bought += req.body.amount;
								data.stock -= req.body.amount;
								data.save(function(err){
									if(err){
										respond(res,400,err);
									} else {
										var change = (req.body.payment - (req.body.amount * (data.price/100).toFixed(2)));
										var buyMessage = 'Product bought successfully with ' + change + '€ as change.';
										respond(res,200,{"message": buyMessage});
									}
								});
							}
						});
					}
				});
			}
		}
	});
}*/

module.exports.findNewest = function(req,res){
	productModel.find({}).sort('-timeStamp').exec(function(err,data){
		if(err){
			respond(res,400,err);
		} else {
			for(let i = 0; i < data.length;i++){ // setting price to correct form for each entry
				data[i].price = (data[i].price/100).toFixed(2);
			}
			respond(res,200,data);
		}
	});
}

module.exports.findPopular = function(req,res){
	productModel.find({}).sort('-bought').exec(function(err,data){
		if(err){
			respond(res,400,err);
		} else {
			for(let i = 0; i < data.length;i++){ // setting price to correct form for each entry
				data[i].price = (data[i].price/100).toFixed(2);
			}
			respond(res,200,data);
		}
	});
}