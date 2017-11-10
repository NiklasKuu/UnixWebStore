const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const userModel = mongoose.model('UserModel');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
  	userModel.findOne({email: username}, function (err,user){
  		if(err) {return done(err);}
  		if(!user) {
  			return done(null, false, {
  				message: "Incorrect username."
  			});
  		}
  		if(!user.validPassword(password)){
  			return done(null, false, {
  				message: "Incorrect password."
  			});
  		}
  		return done(null,user);
  	});
  }
));