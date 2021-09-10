var express = require('express');
var bdd = require("../module/bdd");
var email = require("../module/email");

const uuidv4 = require("uuid/v4")

const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {

  res.render('register', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag});
       
});

router.post('/register', function(req, res) {
  console.log(req.body)

  bdd.get_user_by_email(req.body.email).then(() => {
    res.redirect('/');
  }, () => {

    bdd.verify_email(req.body.email).then(result => {
      if(validateEmail(req.body.email) && result == false){
        var user = {
          id: uuidv4(),
          name: req.body.username,
          picture: undefined,
          provider: 'local',
          email: req.body.email,
          password: req.body.password,
          verified: false
        }

        console.log("TEST")
    
        bdd.save_user(user);
        bdd.create_email_req(user.id, 'verify').then((link_id) => {
          email.send_mail(user.email, link_id, 'verify');
        })
        res.render('email-ask', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag});  
      } else {
        res.redirect('/login')
        }
    })

    
  })
})

router.get('/forgot', function(req, res){
  res.render('reset_password1', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag})
})

router.post('/forgot', function(req, res) {
  bdd.verify_email(req.body.email).then((user_id) => {

    if(user_id !== false){

      bdd.create_email_req(user_id, 'reset').then((link_id) => {
        email.send_mail(req.body.email, link_id, 'reset');
      })
      res.render('reset_password2', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag})
    }
  })
})

router.get('/:id', function(req, res, next) {

  var link_id = req.params.id;

  bdd.search_email_req(link_id).then(result => {
    if(result.request_type == 'verify'){
      bdd.verify_user(result.user_id);
      bdd.delete_email_req(result.user_id, link_id)
      res.render('email-success', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag});
    } else if (result.request_type == 'reset'){
      res.render('reset_password3', { title: 'Wojak Paradise', user: req.user, tags: bdd.top_tag});
    }
  }, () => {
    res.sendStatus(404)
  })
       
});

router.post('/:id', function(req, res){

    var link_id = req.params.id;
  
    bdd.search_email_req(link_id).then(result => {
      if (result.request_type == 'reset'){
        var password = req.body.password;

        bdd.modify_password(result.user_id, password);
        bdd.delete_email_req(result.user_id, link_id)

        res.redirect('/login')

      }
    }, () => {
      res.sendStatus(404)
    })
})


function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = router;
