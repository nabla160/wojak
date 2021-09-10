const mysql = require("mysql");
const fs = require('fs');

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

var LIMIT =50;

var bdd = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "wojak",
});

bdd.connect(function (error) {
  if (!!error) {
    console.log("Echec de la connexion à la base de donnée");
    //console.log(error)
    process.exit();
  } else {
    console.log("Connected to BDD");
  }
});


var request = 'SELECT * FROM `image`';
bdd.query(request, (err, result) => {
    
    result.forEach(wojak => {
        var buffer = imagemin.buffer(wojak.file, {plugins: [
            imageminWebp({
                preset: 'drawing',
                size: 20*1000,
            })
        ]})

        buffer.then(result => {
            console.log(result)
            var request_wo = 'UPDATE image SET min_file = ? WHERE id = ?'
            identifier = [result, wojak.id]
            bdd.query(request_wo, identifier, (err, result) => {
                console.log('Done', result, err)
            })
        })
    })    
})