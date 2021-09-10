var express = require('express');
var router = express.Router();

var bdd = require("../module/bdd");


/* GET home page. */
router.get('/:id', function(req, res, next) {

  var id_list = bdd.get_metadata_by_category(req.params.id)

  id_list.then((result, err) => {
    if (err || result == undefined) {
      res.sendStatus(404);
    } else {
      res.render('category_view', {wojak_list: result, category: req.params.id, user: req.user, tags: bdd.top_tag});
    }
  })

});

module.exports = router;
