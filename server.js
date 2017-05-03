'use strict';

// We import our dependencies
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Comment  = require('./model/comments');

// Creating our intances

var app = express();
var router = express.Router();

//set server port number to 3001 if process.EV_PORT is not available
var port  = process.env.API_PORT || 3001;

//db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dbermudez:hola2010@ds157040.mlab.com:57040/react-tutorial');

//Configure the API to use body parser and look ofr json data in the requestbody

app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials','true');
    res.setHeader('Access-Control-Allow-Methods','GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, ' +
        'Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method,' +
        ' Access-Control-Request-Headers');

    // removing caching to the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//now we set the route path & initialize the API

router.get('/', function (req, res) {
    res.json({message: 'API initialized!'})
});

//Use our router configuration when we call /api
app.use('/api',router);

//adding the /comments route to our /api router

router.route('/comments').get(function (req, res) {
   // we search in our comments schema
    Comment.find(function (err, comments) {
       if (err) {
           res.send(err);
       }
       res.json(comments);
    });
}).post(function (req, res) {
        var comment =  new Comment();
        // body parser lets use the request.body
        comment.author = req.body.author;
        comment.text = req.body.text;
        comment.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Comment Successfully added!'})
        });
    });

//Add this after our get and post routes
//Adding a rou/comments/:comment_idte to a specific comment based on the database ID
router.route('/comments/:comment_id')
//The put method gives us the chance to update our comment based on
//the ID passed to the route
.put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err)
            res.send(err);
        //setting the new author and text to whatever was changed. If
//nothing was changed we will not alter the field.
        (req.body.author) ? comment.author = req.body.author : null;
        (req.body.text) ? comment.text = req.body.text : null;
        //save comment
        comment.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Comment has been updated' });
        });
    });
})
//delete method for removing a comment from our database
    .delete(function(req, res) {
        //selects the comment by its ID, then removes it.
        Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
            if (err)
                res.send(err);
            res.json({ message: 'Comment has been deleted' })
        })
    });



// start the server and listen for requests
app.listen(port, function () {
    console.log(`API running on port:${port}`);
});





