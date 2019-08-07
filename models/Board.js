var mongoose = require('mongoose');
var User = require('./User');
var Schema = mongoose.Schema;
 
 
var boardSchema = new Schema({
    title: String,
    contents: String,
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        writer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        createdAt: {type:Date,default:Date.now}
    }],
    createdAt: {type:Date,default:Date.now}
});
 
module.exports = mongoose.model('board', boardSchema);