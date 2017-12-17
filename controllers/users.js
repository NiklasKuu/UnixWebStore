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

const addToOne = function(id,name,amount){
	return new Promise((resolve,reject) =>{
		productModel.findOne({_id:id},function(err,data){
			if(err){
				reject(err);
			} else if(data.stock < amount){
				reject({"message":"not enough stock to buy product: " + name});
			} else {
				data.bought += amount;
				data.stock -= amount;

				data.save(function(err){
					if(err){
						reject(err);
					}
					resolve({"message":"item bought successfully"});
				});
			}
		});
	});
}


module.exports.listAllUsers = function(req,res){
	if(req.payload.accountType === 1){
		userModel.find(function(err,data){
			if(err){
				respond(res,400,err);
			} else {
				respond(res,200,data);	
			}
		});
	} else {
		notAuthorized(res,req.payload.accountType,1);
	}
}

module.exports.getUser = function(req,res){
	if(req.payload.accountType === 1 || req.payload._id === req.params.id){
		userModel.findOne({_id:req.params.id},function(err,data){
			if(err){
				respond(res,400,err);
			} else {
				respond(res,200,data);
			}
		});
	} else {
		notAuthorized(res,req.payload.accountType,1);
	}

}

module.exports.createNewUser = function(req,res){
	if(req.payload.accountType === 1){
		if(!req.body.name || !req.body.email || !req.body.password || !req.accountType){
			respond(res,400,{"message": "Not all required parameters were entered"});
			return;
		}


		let newUser = new userModel();

		newUser.name = req.body.name;
		newUser.email = req.body.email;
		newUser.setPassword(req.body.password);
		newUser.accountType = req.body.accountType;

		newUser.save(function(err){
			if(err){
				respond(res,400,err);
			} else {
				respond(res,200,{"message": "A new user was created"});	
			}
		});
	} else {
		notAuthorized(res,req.payload.accountType,1);
	}
}

module.exports.deleteUser = function(req,res){
	if(req.payload.accountType === 1){
		userModel.findOne({_id:req.params.id}).remove(function(err){
			if(err){
				respond(res,400,err);
			} else {
				respond(res,200,{"message":"User deleted successfully."});
			}
		});
	} else {
		notAuthorized(res,req.payload.accountType,1);
	}
}

module.exports.purchaseCart = function(req,res){
	userModel.findOne({_id:req.payload._id},function(err,data){
		let totalCost = 0;
		let money = req.body.money;
		for(let i = 0; i < data.cart.length;i++){
			totalCost += data.cart[i].price * data.cart[i].amount;
		}
		if(totalCost > money){
			respond(res,400,{"message": "Payment was not large enough."})
			return;
		} else {
			money -= totalCost;
		}
		let promises = [];
		for(let i = 0; i < data.cart.length;i++){

			promises.push(addToOne(data.cart[i].product,data.cart[i].name,data.cart[i].amount));
		}
		Promise.all(promises).then(function(){
			data.cart = [];
			data.save(function(err){
				if(err){
					respond(res,400,err);		
				} else {
					respond(res,200,{"message":"All Products were bought successfully with " + money.toFixed(2) + "€ in change."});
				}
			});
		}).catch(function(err){
			respond(res,400,err);
		});
	});
}

module.exports.deleteFromCart = function(req,res){
	if(req.payload.accountType === 1 || req.payload._id === req.params.id){
		userModel.findOne({_id:req.params.id},function(err,data){
			for(let i = 0; i < data.cart.length;i++){
				if(data.cart[i].product == req.params.prodId){
					data.cart.splice(i,1);
				}
			}
			data.save(function(err){
				if(err){
					respond(res,400,err);
				} else {
					respond(res,200,{"message":"product successfully deleted from cart"});
				}
			});
		});
	} else {
		notAuthorized(res,req.payload.accountType,1);
	}
}