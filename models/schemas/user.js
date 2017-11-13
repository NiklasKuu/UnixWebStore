const mongoose = require('mongoose');
const crypto = require('crypto');
const jsonWebToken = require('jsonwebtoken');

const purchaseSchema = new mongoose.Schema({
	product: { type: mongoose.Schema.Types.ObjectId, required: true},
	amount: {type: Number, required: true}
});


const userSchema = new mongoose.Schema({
	name: { type: String, required: true},
	email: { type: String, required: true, unique: true},
	hash: String,
	salt: String,
	accountType: { type: Number, required: true, min: 1, max: 3},
	purchases: [purchaseSchema]
});

//encryṕts given password and sets users salt and hash
userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password,this.salt,1000,64,'sha1').toString('hex');
}

//checks if given password maches the hash of the user
userSchema.methods.validPassword = function(password){
	const hash = crypto.pbkdf2Sync(password,this.salt, 1000,64,'sha1').toString('hex');
	return this.hash === hash;
}



userSchema.methods.generateJwt = function(){
	let expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jsonWebToken.sign({
		_id: this._id,
		email: this.email,
		name: this.name,
		accountType: this.accountType,
		exp: parseInt(expiry.getTime() / 1000),  
	}, process.env.JWT_SECRET); // CHANGE THIS BEFORE RETURNING TO TEACHER, ADD TO ENV VARIABLE. INSTRUCTIONS CAN BE FOUND IN THE GETTING MEAN BOOK
};

mongoose.model('UserModel',userSchema);