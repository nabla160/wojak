var express = require('express');
var bdd = require("../module/bdd");

const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.logout();

  res.render('login', {user: req.user, tags: bdd.top_tag})
});

module.exports = router;
