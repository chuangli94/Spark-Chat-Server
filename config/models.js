var mongoose = require('mongoose');
 
var Schema = mongoose.Schema;
 
var userSchema = mongoose.Schema({
    name : String,
    reg_id: String,
    status: {type:Boolean, default:false}
});
 
mongoose.connect('mongodb://localhost:27017/android-chat-node');
module.exports = mongoose.model('users', userSchema);