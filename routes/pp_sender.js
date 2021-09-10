var express = require("express");
var router = express.Router();

var bdd = require("../module/bdd");

/* GET home page. */
router.get("/:id/img", function (req, res, next) {
  var id = req.params.id;
  console.log(id)

  var data = bdd.get_pp_by_id(id);

  data.then((data, error) => {

    console.log(data)
    console.log(error)

    if (error || data == undefined) {
      res.sendStatus(200);
    } else {
      res.contentType("image/png");
      res.end(data, "binary");
    }
  }, err => {
    res.sendStatus(404);
  });
});

module.exports = router;

