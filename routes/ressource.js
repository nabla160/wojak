var express = require('express');
var bdd = require("../module/bdd");

const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

/* GET home page. */
router.get('/tags', function(req, res, next) {
  var data = JSON.stringify(bdd.top_tag)
  res.send(data);
});

router.get('/category', function(req, res, next) {
  var data = JSON.stringify(bdd.top_category)
  res.send(data);
});

module.exports = router;
