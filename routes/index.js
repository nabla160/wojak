var express = require('express');
var bdd = require("../module/bdd");

const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var cat_list = bdd.top_category;

  var cat_final = []
  var cat_wojak = [];
 
  cat_list.forEach(element => {
    cat_wojak.push(bdd.get_metadata_by_category(element, 1))
  });

  Promise.all(cat_wojak).then((values)=>{

    values.forEach((element, index) => {
      
      var temp = {};

      temp.wojak = element[0];
      temp.cat = cat_list[index];

      cat_final.push(temp);
    })

    var rand_id = bdd.get_random_id(50);
    rand_id.then(value => {
      var rand_wojak = bdd.get_meta_by_ids(value);
      rand_wojak.then(rand_meta => {
        res.render('index', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag, cat_list: cat_final, wojak_list: rand_meta, random: true});
      })
    })

    
  });
  
});

module.exports = router;
