const mysql = require("mysql");
const fs = require('fs');
const uuidv4 = require("uuid/v4")

const keys = require("../config/keys");

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const { resolve } = require("path");


var LIMIT =50;

var bdd = mysql.createConnection(keys.bdd);

bdd.connect(function (error) {
  if (!!error) {
    console.log("Echec de la connexion à la base de donnée", error);
    process.exit();
  } else {
    console.log("Connected to BDD");
  }
});

//Top Tag
var top_tag = "pending";

var p_top_tag = get_top_tag()
p_top_tag.then(result => {
  top_tag = result;
  exports.top_tag = top_tag;
})

setInterval(() => get_top_tag(), 1000*60*60)

//Top category

var top_category = "pending";

var p_top_category = get_top_category()
p_top_category.then(result => {
  top_category = result;
  exports.top_category = top_category;
})

setInterval(() => get_top_tag(), 1000*60*60)

function add_wojak(wojak, callback) {
  bdd.query("INSERT INTO image SET ?", wojak, function (err, result) {
    return callback(err);
  });
}

function modify_wojak_username(id){
  get_user_by_id(id).then(user => {
    var request = 'UPDATE `image` SET `user` = ? WHERE `user_id` = ?';
    var identifier = [user.name, id]

    bdd.query(request, identifier);
  })
}

function delete_wojak(id){
  var request_1 = 'DELETE FROM `image` WHERE `id` = ?'
  var identifier_1 = [id]

  bdd.query(request_1, identifier_1);

  var request_2 = 'DELETE FROM `fav` WHERE `id` = ?';
  var identifier_2 = [id];

  bdd.query(request_2, identifier_2);


}



//GET Collection
function get_wojak(id, callback) {
  return new Promise((resolve, reject) => {
    bdd.query(
      "SELECT `file` FROM `image` WHERE `id` = ?",
      [id],
      function (err, result) {
          
        if (err) {
          reject(err);
        }
        resolve(result[0]);
      }
    );
  });
}

function get_wojak_mini(id, callback) {
  return new Promise((resolve, reject) => {
    bdd.query(
      "SELECT `min_file` FROM `image` WHERE `id` = ?",
      [id],
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result[0]);
      }
    );
  });
}


function get_metadata(id, callback) {
  return new Promise((resolve, reject) => {
    bdd.query(
      "SELECT `name`, `date`, `user`,`user_id`, `view`, `fav`, `category`, `tag_1`, `tag_2`, `tag_3`, `tag_4`, `tag_5`, `tag_6` FROM `image` WHERE `id` = ?",
      [id],
      function (err, result) {
        if (err) {
          reject(err);
        }
        resolve(result[0]);
      }
    );
  });
}



function get_all_id(callback) {
  return new Promise((resolve, reject) => {
    bdd.query("SELECT `id` FROM `image`", function (err, result) {
      if (result.length > 0 && !err) {
        p_result = [];

        result.forEach((element) => {
          p_result.push(element.id);
        });

        resolve(p_result);
      } else {
        reject(err);
      }
    });
  });
}

function get_all_tag(callback) {
  return new Promise((resolve, reject) => {
    bdd.query("SELECT `tag_1`, `tag_2`, `tag_3`, `tag_4`, `tag_5`, `tag_6` FROM `image`", function (err, result){
      if(result.length > 0 && !err) {
        p_result = [];

        result.forEach((element) => {
          if(element.tag_1 != ''){
            p_result.push(element.tag_1);
          }

          if(element.tag_2 != ''){
            p_result.push(element.tag_2);
          }

          if(element.tag_3 != ''){
            p_result.push(element.tag_3);
          }

          if(element.tag_4 != ''){
            p_result.push(element.tag_4);
          }

          if(element.tag_5 != ''){
            p_result.push(element.tag_5);
          }

          if(element.tag_6 != ''){
            p_result.push(element.tag_6);
          }

          resolve(p_result);
        })
      } else {
        reject(err);
      }
    })
  })
}

function get_all_category(callback) {
  return new Promise((resolve, reject) => {
    bdd.query("SELECT `category` FROM `image`", function (err, result){
      p_result = [];

      result.forEach((element) => {
        p_result.push(element.category);
      });

      resolve(p_result);
    })
  })
}

function get_meta_by_ids(id_list, callback) {

  var wojak_list = [];
  var i = 0;

  return new Promise((resolve, reject) => {
    id_list.forEach((element) => {
      var metadata = get_metadata(element);

      metadata.then((result, error) => {
        wojak_list[i] = {
          id: id_list[i]
        };

        Object.assign(wojak_list[i], result)

        i++;
        if (wojak_list.length == id_list.length) {
          resolve(wojak_list)
        }
      });
    });
  });
}

function get_metadata_by_category(category, limit, callback){
  if(limit === undefined){ limit = LIMIT}

  return new Promise((resolve, reject) => {
    bdd.query(
      "SELECT `id`,`name`, `date`, `user`,`user_id`, `view`, `fav`, `category`, `tag_1`, `tag_2`, `tag_3`, `tag_4`, `tag_5`, `tag_6` FROM `image` WHERE `category`= ? ORDER BY `view` DESC LIMIT ?",
      [category, limit],
      function(err, result){
        if (result.length > 0 && !err) {
          resolve(result);
        } else {
          reject(err);
        }        
      }
    )
  })
}

function get_metadata_by_tag(tag,limit,callback){
  if(limit === undefined){ limit = LIMIT}

  return new Promise((resolve, reject) => {
    bdd.query(
      "SELECT `id`,`name`, `date`, `user`,`user_id`, `view`, `fav`, `category`, `tag_1`, `tag_2`, `tag_3`, `tag_4`, `tag_5`, `tag_6` FROM `image` WHERE `tag_1`= ? OR `tag_2`= ? OR `tag_3`= ? OR `tag_4`= ? OR `tag_5`= ? OR `tag_6`= ?  ORDER BY `view` DESC LIMIT ?",
      [tag,tag,tag,tag,tag,tag, limit],
      function(err, result){
        if (result.length > 0 && !err) {  
          resolve(result);
        } else {
          reject(err);
        }        
      }
    )
  })
}

function get_metadata_by_user_id(id){
  var request = "SELECT `id`,`name`, `date`, `user`,`user_id`, `view`, `fav`, `category`, `tag_1`, `tag_2`, `tag_3`, `tag_4`, `tag_5`, `tag_6` FROM `image` WHERE `user_id`= ? ORDER BY `view`"
  var identifier = [id]

  return new Promise((resolve, reject) => {
    bdd.query(request, identifier, (err, result) => {
      resolve(result);
    })
  })
}


function increment_view(id) {
  bdd.query(
    "SELECT `view` FROM `image` WHERE `id` = ?",
    [id],
    function (err, result) {
      if (result.length > 0 && !err) {
        var view = result[0].view + 1;

        bdd.query("UPDATE `image` SET `view` = ? WHERE `id` = ?", [view, id]);
      }
    }
  );
}

function increment_view(id) {
  bdd.query(
    "SELECT `view` FROM `image` WHERE `id` = ?",
    [id],
    function (err, result) {
      if (result.length > 0 && !err) {
        var view = result[0].view + 1;

        bdd.query("UPDATE `image` SET `view` = ? WHERE `id` = ?", [view, id]);
      }
    }
  );
}


function sort_by_frequency(tag_list){
  var frequency = {}, value;

    // compute frequencies of each value
    for(var i = 0; i < tag_list.length; i++) {
        value = tag_list[i];
        if(value in frequency) {
            frequency[value]++;
        }
        else {
            frequency[value] = 1;
        }
    }

    // make array from the frequency object to de-duplicate
    var uniques = [];
    for(value in frequency) {
        uniques.push(value);
    }

    // sort the uniques array in descending order by frequency
    function compareFrequency(a, b) {
        return frequency[b] - frequency[a];
    }

    return uniques.sort(compareFrequency);
}

function get_top_tag(){
  return new Promise((resolve, reject) => {
    var all_tag = get_all_tag()
    all_tag.then(at => {
      var result = sort_by_frequency(at);
  
      resolve(result);
      top_tag = result;
      exports.top_tag = top_tag;
    })
  });
}

function get_top_category(){
  return new Promise((resolve, reject) => {
    var all_category = get_all_category()
    all_category.then(at => {
      var result = sort_by_frequency(at);
  
      resolve(result);
      top_category = result;
      exports.top_category = top_category;
    })
  });
}

function get_random_id(number){
  return new Promise((resolve, reject) => {
    var ids = get_all_id();
    ids.then(value => {

      value.slice(number);
      var random_id = value.sort((a,b) => 0.5 - Math.random());
      resolve(random_id);
    })
  })
}

function get_metadata_by_search(search, sort){

  search = '%'+search+'%';

  var sort_str;

  switch(sort) {
    case 'newest':
      sort_str = " `date` DESC";
      break;
    case 'oldest':
      sort_str = " `date` ASC";
    break;
    case 'like':
      sort_str = " `fav` DESC";
    break;
    case 'view':
      sort_str = " `view` DESC";
    break;      
    default:
      sort_str = " `view` DESC";
  }

  var request = "SELECT `id`,`name`, `date`, `user`, `view`, `fav`, `category`, `tag_1`, `tag_2`, `tag_3`, `tag_4`, `tag_5`, `tag_6` FROM `image` WHERE `name` LIKE ? OR `user` LIKE ? OR `category` LIKE ? OR `tag_1` LIKE ? OR `tag_2` LIKE ? OR `tag_3` LIKE ? OR `tag_4` LIKE ? OR `tag_5` LIKE ? OR `tag_6` LIKE ? ORDER BY ";
  request += sort_str;
  return new Promise((resolve, reject) => {
    bdd.query(request, 
      [search, search, search, search, search, search, search, search, search ],function(err, result){

      resolve(result);
      
    } )
  })
}

//Login etc...

function save_user(user){

  var id = user.id;
  var name = user.name;
  var picture = user.picture;
  var provider = user.provider;
  var email = user.email;
  var password = user.password;
  var verified = user.verified;

  return new Promise((resolve, reject) => {
    if(picture === undefined){
      picture = fs.readFileSync('./public/images/default_profile_picture.png')
    }
    var request = 'INSERT INTO `user` (id, name, picture, provider, email, password, verified) VALUES (?, ?, ?, ?, ?, PASSWORD(?), ?) ON DUPLICATE KEY UPDATE name = ?, picture = ?'
    var identifier = [id, name, picture, provider,email, password, verified, name, picture ]

    bdd.query(request, identifier, function(err, result){
      console.log(err, result);
      resolve(result);
    });    

  })
}

function delete_user(id){
  var request_1 = 'DELETE FROM `user` WHERE `id` = ?'
  var identifier_1 = [id]

  bdd.query(request_1, identifier_1);

  var request_2 = 'DELETE FROM `user` WHERE `user_id` = ?'
  var identifier_2 = [id]

  bdd.query(request_2, identifier_2);

  var request_3 = 'DELETE FROM `fav` WHERE `user_id` = ?'
  var identifier_3 = [id]
}

function verify_user(user_id){
  var request = 'UPDATE `user` SET `verified` = 1 WHERE `id` = ?'
  var identifier = [user_id];

  bdd.query(request, identifier)
}

function modify_password(id, password){
  var request = 'UPDATE `user` SET password = PASSWORD(?) WHERE `id` = ?'
  var identifier = [password, id]

  bdd.query(request, identifier);

}

function get_user_by_id(id){
  return new Promise((resolve, reject) => {
    var request = 'SELECT `id`,`name`,`date` FROM `user` WHERE `id` = ?'
    var identifier = [id];

    bdd.query(request, identifier, function(err, res){
      if(res !== undefined && res.length > 0){
        resolve(res[0])
      }
      else {
        reject(err);
      }
    })
  })
}

function get_user_by_email(email){
  return new Promise((resolve, reject) => {
    var request = 'SELECT `id`,`name`,`date` FROM `user` WHERE `email` = ?'
    var identifier = [email];

    bdd.query(request, identifier, function(err, res){
      if(res !== undefined && res.length > 0){
        resolve(res[0])
      }
      else {
        reject(err);
      }
    })
  })
}

function verify_password(user_id ,password){

  var request = 'SELECT `id` FROM `user` WHERE `id` = ? AND `password` = PASSWORD(?)';
  var identifier = [user_id, password]

  return new Promise((resolve, reject) => {
    
    bdd.query(request, identifier, (err, res) => {
      if(res !== undefined && res.length > 0){
        resolve(true)
      }
      else {
        reject(false);
      }
    })
  })
}

function verify_email(email){

  var request = 'SELECT `id` FROM `user` WHERE `email` = ?';
  var identifier = [email]

  return new Promise((resolve, reject) => {
    
    bdd.query(request, identifier, (err, res) => {
      if(res !== undefined && res.length > 0){
        console.log(res)
        resolve(res[0].id)
      }
      else {
        resolve(false);
      }
    })
  })
}

function get_pp_by_id(id){
  return new Promise((resolve, reject) => {
    var request = 'SELECT `picture` FROM `user` WHERE `id` = ?'
    var identifier = [id];

    bdd.query(request, identifier, function(err, res){
      if(res !== undefined && res.length > 0){
        resolve(res[0].picture)
      }
      else {
        reject(err);
      }
    })
  })
}

function logged_in(req, res, next){
  if(req.user === undefined){
    res.redirect('/login');
    return;
  }

  get_user_by_id(req.user.id).then(() => {
    next()
  }, () => {
    res.redirect('/login')
  }
  )
}

//fav

function fav_exist(user_id, id){
  return new Promise((resolve, reject) => {
    request = 'SELECT * FROM `fav` WHERE `user_id` = ? AND `id` = ?';
    identifier = [user_id, id];

    bdd.query(request, identifier, (err, result) => {
      console.log(identifier)
      if(result.length > 0){
        resolve(true);
      }
      else{
        resolve(false);
      }
    })
  })
}

function increment_fav(id) {
  bdd.query(
    "SELECT `fav` FROM `image` WHERE `id` = ?",
    [id],
    function (err, result) {
      if (result.length > 0 && !err) {
        var fav = result[0].fav + 1;

        bdd.query("UPDATE `image` SET `fav` = ? WHERE `id` = ?", [fav, id]);
      }
    }
  );
}

function decrement_fav(id) {
  bdd.query(
    "SELECT `fav` FROM `image` WHERE `id` = ?",
    [id],
    function (err, result) {
      console.log(result);
      if (result.length > 0 && !err) {
        var fav = result[0].fav - 1;

        bdd.query("UPDATE `image` SET `fav` = ? WHERE `id` = ?", [fav, id]);
      }
    }
  );
}

function save_fav(user_id, id){
  var request = 'INSERT INTO `fav` (`user_id`, `id`) VALUES (?, ?)';
  var identifier = [user_id, id];

  fav_exist(user_id, id).then(result => {
    if(result == false){
      bdd.query(request, identifier, (err, result) => {
        console.log(err, result, 'prout')
      });
      increment_fav(id)
    }
  })
}

function remove_fav(user_id, id){
  var request ='DELETE FROM `fav` WHERE `user_id` = ? AND `id` = ?';
  var identifier = [user_id, id];

  fav_exist(user_id, id).then(result => {
    if(result == true){
      bdd.query(request, identifier);
      decrement_fav(id)
    }
  });
};

function get_meta_by_fav(user_id){
  var request = 'SELECT `id` FROM `fav` WHERE `user_id` = ?'
  var identifier = [user_id]

  return new Promise((resolve, reject) => {
    bdd.query(request, identifier, (err, result) => {
      if (result.length > 0 && !err) {
        p_result = [];
  
        result.forEach((element) => {
          p_result.push(element.id);
        });
  
        get_meta_by_ids(p_result).then(result => {
          resolve(result);
        }, err => {
          resolve([])
        })
      } else {
        resolve([])
      }
    })
  })  
}


//Email-request function

function create_email_req(user_id, type){
  var req_id = uuidv4();

  var request = 'INSERT INTO `email-request` (user_id, request_id, request_type) VALUES (?,?,?)';
  var identifier = [user_id, req_id, type];

  return new Promise((resolve, reject) => {
    bdd.query(request, identifier, (err, result) => {
      if(!err){
        resolve(req_id);
      } else {
        reject();
      }
    })
  })
}

function search_email_req (link_id){
  var request = 'SELECT * FROM `email-request` WHERE `request_id` = ?';
  var identifier = [link_id];

  return new Promise((resolve, reject) => {
    bdd.query(request, identifier, (err, res) => {
      if(res !== undefined && res.length > 0){
        resolve(res[0])
      }
      else {
        reject(err);
      }
    })
  })
}

function delete_email_req(user_id, request_id){

  var request = 'DELETE FROM `email-request` WHERE `user_id` = ? AND `request_id` = ?';
  var identifier = [user_id, request_id,];

  return new Promise((resolve, reject) => {
    bdd.query(request, identifier)
  })
}


//function wojak
exports.add_wojak = add_wojak;
exports.modify_wojak_username = modify_wojak_username;
exports.delete_wojak = delete_wojak;
exports.get_wojak = get_wojak;
exports.get_wojak_mini = get_wojak_mini;
exports.get_all_id = get_all_id;
exports.get_all_tag = get_all_tag;
exports.get_metadata = get_metadata;
exports.get_meta_by_ids = get_meta_by_ids;
exports.get_metadata_by_category = get_metadata_by_category;
exports.get_metadata_by_tag = get_metadata_by_tag;
exports.get_metadata_by_user_id = get_metadata_by_user_id;
exports.get_random_id = get_random_id;
exports.get_metadata_by_search = get_metadata_by_search;

//function user
exports.save_user = save_user;
exports.delete_user = delete_user;
exports.modify_password = modify_password;
exports.verify_user = verify_user;
exports.get_user_by_id = get_user_by_id;
exports.get_user_by_email= get_user_by_email;
exports.verify_password = verify_password;
exports.verify_email = verify_email;
exports.get_pp_by_id = get_pp_by_id;
exports.logged_in = logged_in;

//function fav
exports.fav_exist = fav_exist;
exports.save_fav = save_fav;
exports.remove_fav = remove_fav;
exports.get_meta_by_fav = get_meta_by_fav;

//function email
exports.create_email_req = create_email_req;
exports.search_email_req = search_email_req;
exports.delete_email_req = delete_email_req;
//variable
exports.top_tag = top_tag;
exports.top_category = top_category;