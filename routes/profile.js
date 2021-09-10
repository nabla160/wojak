var express = require('express');
var bdd = require("../module/bdd");

const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

/* GET home page. */
router.get('/me', bdd.logged_in, function(req, res, next) {
    var id = req.user.id;
    bdd.get_user_by_id(id).then(t_user => {
        bdd.get_meta_by_fav(id).then(fav_list => {
            bdd.get_metadata_by_user_id(id).then(wojak_list => {
                res.render('profile', {
                    title: 'Wojak Paradise',
                    user:req.user,
                    tags: bdd.top_tag,
                    wojak_list: wojak_list,
                    fav_list: fav_list,
                    fav_custom: 'Wojaks you liked :',
                    t_user : t_user,
                    custom: 'Wojak posted by ' + t_user.name + ' :',
                    my_account : true
                })
            })
        })
    }, () => {
        res.sendStatus(200);
    })
});

router.get('/:id', function(req, res, next) {
    var id = req.params.id;

    bdd.get_user_by_id(id).then(t_user => {
        bdd.get_metadata_by_user_id(id).then(wojak_list => {
            res.render('profile', {
                title: 'Wojak Paradise',
                user:req.user,
                tags: bdd.top_tag,
                wojak_list: wojak_list,
                t_user : t_user,
                custom: 'Wojak posted by ' + t_user.name + ' :',
                my_account : false
            })
        })
    }, () => {
        res.sendStatus(404);
    })
});

router.get('/me/modify', bdd.logged_in, function(req, res, next) {

    res.render('modify', {user: req.user, tags: bdd.top_tag})
  });
  
router.post('/me/modify', bdd.logged_in, function(req, res, next) {

    bdd.get_pp_by_id(req.user.id).then(picture => {

        if(req.files !== null){
            picture = req.files.picture.data;
        }       

        var user = {
            id : req.user.id,
            name: req.body.username,
            picture: picture,
            provider: 'none',
            verified: 'none'
        }

        bdd.save_user(user).then(() => {
            bdd.modify_wojak_username(req.user.id)
        })
    })

    res.render('modify', {user: req.user, tags: bdd.top_tag})
});



module.exports = router;
