var express = require('express');
var router = express.Router();
var Board = require('../models/Board');
let session=require('express-session');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');

});
router.get('/write', function (req, res, next) {
    res.render('write', {board: null});

});
router.post('/write', function (req, res, next) {
    var title = req.body.title;
    var contents = req.body.contents;
    console.log(title);
    console.log(contents);
    Board.create({
        title: title,
        contents: contents,
        writer: req.session.user.objId
    });
    res.redirect('/');


});

router.get('/update', function (req, res, next) {
 
    var boardObjId = req.query.boardId;
    console.log(boardObjId);

    Board.findOne({_id: boardObjId}, function (err, result) {
        console.log(result);
        res.render('write', {board: result});
    });
});
router.post('/update', function (req, res, next) {
    var title = req.body.title;
    var contents = req.body.contents;
    var boardId = req.body.boardId;
    console.log(title);
    console.log(contents);
    console.log(boardId);

    Board.update({_id: boardId},{contents: contents, title: title }, function (err, result) {
        res.redirect('/');
    });
});
router.post('/delete',function(req, res, next){
    var boardId = req.body.boardId;
    Board.remove({_id:boardId},function(err){
       res.redirect('/');                            
    });
});
///comment/write

router.post('/comment/write',function(req,res,next){
    console.log(req.body.writer);
    console.log(req.body.content);
   var commentObj = {writer:req.body.writer, content:req.body.content};
    Board.update({_id:req.body.boardId},{$push:{comments:commentObj}}, function(err, board){
        
        res.redirect('/board/'+req.body.boardId);
    });
});
///board/comment/delete remove
router.post('/comment/delete',function(req, res, next){
    var boardId = req.body.boardId;
    var commentId = req.body.commentId;
    
    Board.update({_id:boardId},{$pull:{comments: {"_id": commentId}}},function (err, result) {
        res.redirect('/board/'+req.body.boardId);
    });
});
///board/comment/save
router.post('/comment/save',function(req, res, next){
    var boardId = req.body.boardId;
    var commentId = req.body.commentId;
    var updateCo=req.body.updateCo;
    console.log(boardId);
    console.log(commentId);
     console.log('==============');
    console.log(updateCo);
    
    
    Board.update({'_id':boardId, 'comments._id': commentId},{'$set':{'comments.$.content': updateCo}},function (err, result) {
         if(result){
        res.redirect('/board/'+req.body.boardId);
         }
    });
   
});


router.get('/:id', function (req, res, next) {  
    Board.findOne({_id:req.params.id}).populate(['writer','comments.writer']).exec(function(err, board){
        if(board){
             res.render('board',{ title:'글 상세보기', board : board,  session:req.session});
        }
        
    });        

});

        

module.exports = router;