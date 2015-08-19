var mongoose = require('mongoose');
var request = require('request');
var user = require('./models');
var fs = require('fs');
var path = require('path');

exports.register = function(name, reg_id, callback) {
    var newuser = new user({
        name: name,
        reg_id: reg_id,
        status: true
    });

    user.find({name: name}, function (err, users) {
        if (users.length != 0) {
            callback({'response':'User already registered!'});
        } else {
            newuser.save(function(err) {
                if (err) {
                    callback({'response':'Registration Failure'});
                } else {
                    callback({'response':'Registration Success'});
                }
            });
        }
    })
}

exports.login = function(name,callback) {
 
    var newuser = new user({
        name: name
        //reg_id: reg_id
    });
 
    user.find({name: name}, function (err,users){
 
        var len = users.length;
        if(len == 0){
            callback({'response':"No user found, please register"});
        }else{
            updateUserStatus(name, true);
            console.log("user reg id: " + users[0].reg_id)
            callback({'response':"Logged in", 'reg_id':users[0].reg_id});
        }
    });
}

exports.logout = function(name, callback) {
    user.find({name: name}, function(err, users) {
        if (err) console.log(err);
        else {
            var currentUser = user[0];
            var options = {multi: false};
            user.update({name: name}, {status: false}, options, function (err, numRowsAffected) {
                if(err) console.log(err);
                else 
                    {
                        console.log("Updated: " + numRowsAffected);
                        callback({'response':"Logged out"});
                    }
            });
        }
    })
}

exports.getuser = function(name,callback) {
 
    user.find(function(err,users){ 
       var len = users.length; 
        if(len == 0){ 
            callback({'response':"No Users Registered"});
        }else{
            callback(removeUser(users, name));
        }
    });
}
 
 
exports.removeuser = function(name,callback) {
    user.remove({name:name},function(err,users){
        if(!err){
            callback({'response':"Removed Sucessfully"});
        }else{
            callback({'response':"Error"});
        }
    });
}
 
 
 
exports.send = function(from,to,msg,callback) {
    user.find({name: to},function(err,users){
        var len = users.length;
        if(len == 0){
            console.log("user not found: " + to);
            callback({'response':"Failure"});
        }else{
            var to_id = users[0].reg_id;
         
            request({ 
                method: 'POST',
                uri: 'https://android.googleapis.com/gcm/send',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'key=AIzaSyBktXap4Am1cIa2kz2HxnPqtBsyeg3O1ls'
                },
                body: JSON.stringify({
                  "registration_ids" : [to_id],
                  "data" : {
                    "msg":msg,
                    "sender":from,
                    "receiver":to
                    }, "time_to_live": 108})
            }, function (error, response, body) {
                if(error)
                {
                    console.log(error);
                } 
                else
                {
                    console.log("response: " + JSON.stringify(body));
                    callback({'response':"Success"});
                }
            })}
        });
}
 

exports.saveImage = function (files, callback) {
    console.log(files.image.originalFilename);
    console.log(files.image.path);
        fs.readFile(files.image.path, function (err, data){
            var newPath = path.normalize(__dirname + "/../uploads/" + files.image.originalFilename);
            console.log(newPath);
            fs.writeFile(newPath, data, function (err) {
                if(err){
                    callback({'response':"Error"});
                }else {
                    callback({'response':"Image Saved"});
                }
            });
        });
}

exports.getImage = function(fileName, callback) {
    var filePath = path.normalize(__dirname + "/../uploads/" + fileName);
    try {
        var img = fs.readFileSync(filePath);    
        callback(null, image);
    } catch (e) {
        callback(e);
    }

}

function removeUser(arr, val) {
    for(var i=0; i<arr.length; i++) {
        if(arr[i].name == val) {
            arr.splice(i, 1);
            return arr;
            break;
        }
    }
}

function updateUserStatus(name, status) {
    var options = {multi: false};
    var query = {name: name};
    var update = {status: status};

    user.update(query, update, options, function (err, affected) {
        if (err) console.log(err);
        else console.log("rows affected: " + affected);
    });
}