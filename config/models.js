var mongoose = require('mongoose');
 
var Schema = mongoose.Schema;
 
var userSchema = mongoose.Schema({
    name : String,
    reg_id: String,
    status: {type:Boolean, default:false}
});
 
//mongoose.connect('mongodb://localhost:27017/android-chat-node');
mongoose.connect('mongodb://admin:admin@ds035663.mongolab.com:35663/spark-chat');
module.exports = mongoose.model('users', userSchema);