/**
 * 物品list
 */
var mongoose = require('./db.js'),
    Schema = mongoose.Schema;

var NewsListSchema = new Schema({          
    title : { type: String },            
    desc : { type: String },
    content : { type: String },
    time: {type: Number},
    artno: {type: Number},
    imgage:  { type: String }
});

module.exports = mongoose.model('newslists',NewsListSchema);