/**
 * 物品list
 */
var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var GoodsListSchema = new Schema({          
    name : { type: String },            
    price: {type: Number},       
    num: {type: Number},            
    company : { type: String}
});

module.exports = mongoose.model('goodsList',GoodsListSchema);