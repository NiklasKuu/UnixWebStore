const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('UserModel');

const respond = function(res,status,content){
	res.status(status);
	res.json(content);
}

module.exports.register = function(req,res){
	if(!req.body.name || !req.body.email || !req.body.password){
		respond(res, 400, {"message": "All fields required"});
		return;
	}

	let user = new userModel();

	user.name = req.body.name;
	user.email = req.body.email;
	user.accountType = 3; // all accounts created using registeration will be type customer

	user.setPassword(req.body.password);

	user.save(function(err){
		let token;
		if (err) {
			respond(res, 404, {"error": err});
		} else {
			token = user.generateJwt();
			respond(res, 200, {"token": token});
		}
	});
};

module.exports.login = function(req,res){
	if(!req.body.email || !req.body.password){
		respond(res,400, {"message": "All fields required"});
		return;
	}

	passport.authenticate('local', function(err,user,info){
		let token;

		if(err){
			respond(res, 404, err);
			return;
		}

		if(user){
			token = user.generateJwt();
			respond(res, 200, {"token": token});
		} else {
			respond(res, 401, info);
		}
	})(req,res);
};