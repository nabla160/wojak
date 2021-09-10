var express = require("express");
var router = express.Router();

var bdd = require("../module/bdd");

router.get('/add', function(req,res,next){
  res.sendStatus(418)
})

/* GET home page. */
router.get("/:id/img", function (req, res, next) {
  var id = req.params.id;

  var data = bdd.get_wojak(id);

  data.then((data, error) => {

    if (error || data == undefined) {
      res.sendStatus(404);
    } else {
      console.log(data.min_file); 
      res.contentType("image/png");
      res.end(data.file, "binary");
    }
  });
});

router.get("/:id/img/mini", function (req, res, next) {
  var id = req.params.id;

  var data = bdd.get_wojak_mini(id);

  data.then((data, error) => {
    if (error || data == undefined) {
      res.sendStatus(404);
    } else {
      res.contentType("image/webp");
      res.end(data.min_file, "binary");
    }
  });
});

router.get("/:id", function (req, res, next) {
  var id = req.params.id;

  var metadata = bdd.get_metadata(id)

  metadata.then((result, error) => {
    var data = result
    data.id = id
   
    prepare_wojak_view(result).then((value) => {
      console.log(value.v_value)
      res.render('wojak_view', {data: data, v_value: value.v_value, h_value: value.h_value,user: req.user, tags: bdd.top_tag})
      console.log(value.v_value )
    })    
  }) 

});

router.get("/:id/delete", bdd.logged_in, function (req, res, next) {
  var id = req.params.id;

  var metadata = bdd.get_metadata(id)

  metadata.then((result, error) => {

    if(result.user_id == req.user.id){
      res.render('delete-wojak', {user: req.user, tags: bdd.top_tag})
    }
  });

});

router.get("/:id/delete/confirm", bdd.logged_in, function (req, res, next) {
  var id = req.params.id;

  var metadata = bdd.get_metadata(id)

  metadata.then((result, error) => {

    if(result.user_id == req.user.id){
      bdd.delete_wojak(id)
      res.redirect('/')
    }
  });

});

function prepare_wojak_view(metadata){
  return new Promise((resolve, reject) => {
    var vertical_id = bdd.get_metadata_by_category(metadata.category)
    vertical_id.then((v_value)=> {
      console.log(v_value)
      var horizontal_id = bdd.get_metadata_by_tag(metadata.tag_1)
      horizontal_id.then((h_value) => {
        console.log(h_value)
        resolve({
          v_value: {
            title: "More in \"" + metadata.category + "\"",
            wojak_list: v_value
          },
          h_value: {
            title: "More in \"" + metadata.tag_1 + "\"",
            wojak_list: h_value}      
          }  
        )
      })
    })
  })
}

module.exports = router;

