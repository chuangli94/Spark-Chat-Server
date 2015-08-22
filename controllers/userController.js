var user = require('mongoose').model('User');

exports.login = function(req, res) {
	console.log("logging in");
	var name = req.body.name;

	user.find({name: name}, function (err,users){
        if(users.length == 0){
            res.send({'response':"No user found, please register"});
        }else{
            updateUserStatus(name, true);
            console.log("user reg id: " + users[0].reg_id)
            res.send({'response':"Logged in"});
        }
    });
}

exports.logout = function(req, res) {
	var name = req.body.name;

    user.find({name: name}, function(err, users) {
        if (err) console.log(err);
        else {
			updateUserStatus(name, false);
            res.send({'response':"Logged out"});
        }
    })
}

exports.getUsers = function(req, res) {
    var name = req.body.name;
    user.find({name: {$ne : name}}, function(err,users){ 
        if(err){ 
            res.send({'response':"No Users Registered"});
        }else{
            res.json(users);
        }
    });
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