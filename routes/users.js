var express = require('express');
var router = express.Router();
var User = require('../models/User');
var crypto = require('crypto');
//crypto.createHash('sha512').update('비밀번호').digest('base64');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/join', function (req, res, next) {
    res.render('join');
});
router.post('/join', function (req, res, next) {
    var id = req.body.id;
    var cipher = crypto.createCipher('aes-256-cbc', 'hiddenKey');
    var password = cipher.update(req.body.password, 'utf8', 'base64');
    password += cipher.final('base64');
    console.log('암호화된 암호: ', password);
    var name = req.body.name;
    console.log(id);
    console.log(password);
    console.log(name);
    User.create({
        id: id,
        password: password,
        name: name
    });
    console.log('회원가입성공');
    res.redirect('/users/login');
});
router.get('/login', function (req, res, next) {
    res.render('login');
});

router.post('/login', function (req, res, next) {
    User.findOne({
        id: req.body.id
    }, function (err, exists) {
        if (err) throw err;
        if (exists) {
            var decipher = crypto.createDecipher('aes-256-cbc', 'hiddenKey');
            var check = decipher.update(exists.password, 'base64', 'utf8');
            check += decipher.final('utf8');
            console.log(check);
            if (check == req.body.password) {
                req.session.user = {
                    objId: exists._id,
                    id: exists.id,
                    password: exists.password,
                    name: exists.name,
                    autorized: true
                };
                res.redirect('/');
            } else {
                res.send('존재하지 않습니다.');
            }
        }

    });
});




router.get('/logout', function (req, res, next) {

    //로그인된 상태
    console.log('로그아웃합니다.');

    req.session.destroy(function (err) {
        if (err) {
            throw err;
        }

        console.log('세션을 삭제하고 로그아웃되었습니다.');
        res.redirect('/users/login');
    });

});



module.exports = router;