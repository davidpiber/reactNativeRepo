'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//create new instance of the mongoose.schema. the schema takes an
//object that shows the shape of your database entries.
var CommentsSchema = new Schema({
    author: String,
    text: String
});

//export our module to use it in Server.js

module.exports = mongoose.model('Comment', CommentsSchema);