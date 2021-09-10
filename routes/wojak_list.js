var express = require("express");
var router = express.Router();

var bdd = require("../module/bdd");

/* GET home page. */
router.get("/", function (req, res, next) {
  var id_list = bdd.get_all_id();

 
  id_list.then((id_result, error) => {
    var wojak_list = bdd.get_meta_by_ids(id_result)
    wojak_list.then((wojak_result, error) => {
      res.render("vertical_list", { title: "Liste de tous les wojaks", wojak_list: wojak_result, user: req.user, tags: bdd.top_tag });
    })
  });
  
});

module.exports = router;
