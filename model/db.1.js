const mongoose = require('mongoose');
const DB_URL = 'localhost:27017/data';

/* 连接 */
const db = mongoose.connect(DB_URL);

var Schema = mongoose.Schema;

var goodslist = new Schema({
    name : String ,
    price : Number ,
    num : Number,
    company : String
})

exports.goodslist = db.model('goodslist',goodslist);