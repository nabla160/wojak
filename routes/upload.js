var express = require('express');
var router = express.Router();

var bdd = require('../module/bdd') 

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

/* GET home page. */
router.get('/', bdd.logged_in, function(req, res, next) {
  res.render('upload', {user:req.user, tags: bdd.top_tag, category: bdd.top_category});
});

router.post('/', bdd.logged_in, function(req, res, next){

  var name = req.body.name;


 if(req.files){

   var file = req.files.file;
   var category = req.body.category;
   var user = req.user.name;
   var user_id = req.user.id;
   
   var tag_1 = req.body.tag_1;
   var tag_2 = req.body.tag_2;
   var tag_3 = req.body.tag_3;
   var tag_4 = req.body.tag_4;
   var tag_5 = req.body.tag_5;
   var tag_6 = req.body.tag_6;
  
   if(file.mimetype.match("image") && file.size <= 16 * 1024 *1024){

    var buffer = imagemin.buffer(file.data, {plugins: [
      imageminWebp({
          preset: 'drawing',
          size: 20*1000,
      })
    ]});

    buffer.then(min_file => {
      var wojak = {
        name: name,
        file: file.data,
        min_file: min_file,
        user: user,
        user_id: user_id,
        category: category,
 
        tag_1: tag_1,
        tag_2: tag_2,
        tag_3: tag_3,
        tag_4: tag_4,
        tag_5: tag_5,
        tag_6: tag_6
      }

      console.log(wojak)
 
 
      console.log('Pret à transfert')
      
      bdd.add_wojak(wojak, (err) => {
       res.render('upload', {user: req.user, tags: bdd.top_tag, category: bdd.top_category});  
      })
    });
    
  } else{
    res.render('upload', {user: req.user, tags: bdd.top_tag, category: bdd.top_category})
  }

}

});

module.exports = router;
