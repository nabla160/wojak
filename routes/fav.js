var express = require('express');
var bdd = require("../module/bdd");

const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

/* GET home page. */
router.get('/save/:id', bdd.logged_in, function(req, res, next) {
    bdd.save_fav(req.user.id, req.params.id)
    res.status(200).send( {result : true});
});

router.get('/remove/:id', bdd.logged_in, function(req, res, next) {
  bdd.remove_fav(req.user.id, req.params.id)
  res.status(200).send( {result : true});
});

router.get('/get/:id', function(req, res, next) {
  if (req.user == undefined){
    res.status(200).send( {result : false});
    return;
  }
  bdd.fav_exist(req.user.id, req.params.id).then(result => {
    console.log(result)
    if(result){
      res.status(200).send( {result : true})
    }
    else{
      res.status(200).send({result : false})
    }
  });
});

module.exports = router;
