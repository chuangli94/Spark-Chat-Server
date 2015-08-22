var request = require('request');
var user = require('mongoose').model('User');
var fs = require('fs');
var path = require('path');
var q = require('q');

var uploadsDir = path.normalize(__dirname + "/../uploads/");

exports.send = function(req, res) {
	var from = req.body.from;
	var to = req.body.to;
	var msg = req.body.msg;

	user.find({name: to},function(err,users){
        var len = users.length;
        if(len == 0){
            console.log("user not found: " + to);
            res.send({'response':"Failure"});
        }else{
            var to_id = users[0].reg_id;
            gcmSend(from, to, to_id, msg)
                .then(function(response) {
                    res.send({'response': response});
                });
        }
    });
}

exports.sendImage = function(req, res) {
    var files = req.files;
    var from = req.body.from;
    var to = req.body.to;
    var msg = req.body.msg;
    console.log("from: " + from + " to: " + to);
    user.find({name: to}, function (err, users) {
        if(err || users.length == 0) {
            console.log("error:" + err);
            res.send({'response':'Failure'});
        } else {
            var to_id = users[0].reg_id;
            saveImage(files)
                .then(function(imageLocation) {
                    users[0].addImagesToView(from, imageLocation);
                    return gcmSend(from, to, to_id, msg, imageLocation);
                })
                .then(function(response) {
                    res.send({'response':response});
                });
        }
    })
}

exports.getImage = function(req, res) {
    var filename = req.params.file;
    var imageURL = req.query.imageURL;
    var reg_id = req.query.reg_id;
    var location = uploadsDir + filename;

    if (reg_id == null || imageURL == null) {
        res.send({'response': 'Retrieval Failed, must provide auth'});
    } else {
        user.findOne({reg_id: reg_id}, function(err, user) {
            if(err || user == null) {
                console.log("Retrieval failed, cannot find user");
                res.send({'response': 'Retrieval Failed, cannot find user'});
            } else {
                if (user.getImagesAuth(imageURL)) {
                    fs.readFile(location, function(err, data) {
                        if (err) {
                            console.log("Failed to retrienve image\n" + err);
                            res.send({'response':'Retrieval failed, cannot read image or corrupted file'});
                        } else {
                            res.writeHead(200, {'Content-Type':'image/jpg'});
                            res.end(data, 'binary');
                        }
                    })
                } else {
                    console.log("Retrieval failed, no image found");
                    res.send({'response': 'Retrieval failed, no image found'});
                }
            }
        })
    }
}

function saveImage(files) {
    var deferred = q.defer();
    //console.log(files.image.originalFilename);
    //console.log(files.image.path);
    fs.readFile(files.image.path, function (err, data){
        var newPath = uploadsDir + files.image.originalFilename;
        fs.writeFile(newPath, data, function (err) {
            if(err){
                deferred.reject('failed to save locallay');
            } else {
                console.log(newPath);
                deferred.resolve(files.image.originalFilename);
            }
        });
    });
    return deferred.promise;
}

function gcmSend(from, to, to_id, msg, imageLocation) {
    var data = {
            "msg":msg,
            "sender":from,
            "receiver":to
        }
    if (imageLocation != null) {
        data.imageLocation = imageLocation;
    }

    var deferred = q.defer();
    request({ 
        method: 'POST',
        uri: 'https://android.googleapis.com/gcm/send',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'key=AIzaSyBktXap4Am1cIa2kz2HxnPqtBsyeg3O1ls'
        },
        body: JSON.stringify({
            "registration_ids" : [to_id],
            "data" : data,
            "time_to_live": 108
        })
    }, function (error, response, body) {
        if(error) {
            console.log(error);
            deferred.reject('Failed');
        } 
        else if (body.failure > 0) {
            console.log(JSON.stringify(body));
            deferred.reject('Failed');
        } else {
            deferred.resolve('Success');
        }
    });
    return deferred.promise;
}
