var express = require('express');
var bdd = require("../module/bdd");



const { BLEND_DARKEN } = require('jimp');
var router = express.Router();

router.post('/', function (req, res, next){

    var sort;
    var search;

    if(req.body === undefined){
        res.sendStatus(404)
        return;
    }

    if(req.body.sort === undefined){
        sort = "view"
    } else {
        sort = req.body.sort
    }

    search = req.body.search;
    

    var search_result = bdd.get_metadata_by_search(search, sort)
    search_result.then(value => {
        console.log(value.length)
        res.render('search', {search: search, sort:sort, result: value, user: req.user, tags: bdd.top_tag});
    })

})

router.get('/', (req, res) => {
    var search_result = bdd.get_metadata_by_search('', 'view')
    search_result.then(value => {
        console.log(value.length)
        res.render('search', {search: '', sort:'view', result: value, user: req.user, tags: bdd.top_tag});
    })
})

router.post('/req', function (req, res, next){

    var sort;
    var search;

    if(req.body === undefined){
        res.sendStatus(404)
        return;
    }

    if(req.body.sort === undefined){
        sort = "view"
    } else {
        sort = req.body.sort
    }

    search = req.body.search;
    

    var search_result = bdd.get_metadata_by_search(search, sort)
    search_result.then(value => {
        console.log(value.length)

        res.send(JSON.stringify(value));
    })

})

module.exports = router;