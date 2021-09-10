var express = require('express');
var bdd = require("../module/bdd");

const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('rgpd', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag});
});

module.exports = router;
