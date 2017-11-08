const mongoose = require('mongoose');
const userModel = mongoose.model('UserModel');

const response = function(res,status,content){
	res.status(status);
	res.json(content);
}



module.exports.listAllUsers = function(req,res){
	res.status(200);
	res.json({"message": "Here are all the users"});
}

module.exports.createNewUser = function(req,res){
	res.status(200);
	res.json({"message": "this resource creates a new user"});
}