const mongoose = require('mongoose');
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