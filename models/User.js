var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id: String,
    password: String,
    name: String,
    createdAt: {type:Date,default:Date.now}
});

var User = mongoose.model('User', userSchema);

module.exports = User;