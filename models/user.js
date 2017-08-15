const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// user schema
const userSchema = new Schema({
  username : {type: String, required: true, unique: true},
  name : {type: String, required: true},
  email : {type: String, required: true},
  providerId: { type: String },
  passwordHash: {type: String}
});

userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

userSchema.statics.authenticate = function(username, password) {
  return (
    User.findOne({ username: username })

      .then(user => {
        if (user && user.validatePassword(password)) {
          return user;
        } else {
          return null;
        }
      })
  );
};

const User = mongoose.model('User', userSchema);

module.exports = User;
