var express = require('express');
var router = express.Router();

var bdd = require("../module/bdd");


/* GET home page. */
router.get('/:id', function(req, res, next) {

  var id_list = bdd.get_metadata_by_tag(req.params.id)

  id_list.then((result, err) => {
    if (err || result == undefined) {
      res.sendStatus(404);
    } else {
      res.render('tag_view', {wojak_list: result, tag: req.params.id, user: req.user, tags: bdd.top_tag});
    }
  })

});

module.exports = router;
