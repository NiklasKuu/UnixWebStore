const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
	name: {type:String, required: true},
	description: {type:String, required: false},
	price: {type: Number},
	stock: {type: Number, "default": 0},
	bought: {type: Number, "default": 0},
	timeStamp: {type: Date, "default":Date.now}
});

productSchema.methods.setPrice = function(number){
	this.price = number * 100;
}

productSchema.methods.getPrice = function(){
	return (this.price/100).toFixed(2);
}

mongoose.model('ProductModel',productSchema);