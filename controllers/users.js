const mongoose = require('mongoose');
const userModel = mongoose.model('UserModel');

const respond = function(res,status,content){
	res.status(status);
	res.json(content);
}



module.exports.listAllUsers = function(req,res){
	userModel.find(function(err,data){
		if(err){
			respond(res,400,{"error":err});
		} else {
			respond(res,200,data);	
		}
	});
}

module.exports.createNewUser = function(req,res){
	let newUser = new userModel();

	newUser.name = req.body.name;
	newUser.email = req.body.email;
	newUser.setPassword(req.body.password);
	newUser.accountType = req.body.accountType;

	newUser.save(function(err){
		if(err){
			respond(res,400,{"error":err});
		} else {
			respond(res,200,{"message": "A new user was created"});	
		}
	});
}