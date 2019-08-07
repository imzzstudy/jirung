var express = require('express');
var router = express.Router();
var Board = require('../models/Board');
var User = require('../models/User');
let session=require('express-session');

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.session.user) { //세션이 있으면
        Board.find({}).populate(['writer']).exec(function (err, board) {
            res.render('index',{board:board, session:req.session});
    });
        
    } else {
        res.redirect('/users/login');
    }

});


module.exports = router;