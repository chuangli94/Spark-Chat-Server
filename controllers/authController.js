var user = require('mongoose').model('User');

exports.register = function(req, res) {
	var name = req.body.name;
	var reg_id = req.body.reg_id;

	user.find({name: name}, function(err, users) {
		if (users.length != 0) {
			res.send({'response':'User already registered!'});
		}
		else {
			var newuser = new user({
        		name: name,
        		reg_id: reg_id,
        		status: true
    		}).save(function(err) {
				if (err) {
                    res.send({'response':'Registration Failure'});
                } else {
                    res.send({'response':'Registration Success'});
                }
    		});
		}
	});
}

exports.login = function(req, res) {
	console.log("logging in");
	var name = req.body.name;

	user.find({name: name}, function (err,users){
        if(users.length == 0){
            res.send({'response':"No user found, please register"});
        }else{
            updateUserStatus(name, true);
            console.log("user reg id: " + users[0].reg_id)
            res.send({'response':"Logged in", 'reg_id':users[0].reg_id});
        }
    });
}

exports.logout = function(req, res) {
	var name = req.body.name;

    user.find({name: name}, function(err, users) {
        if (err) console.log(err);
        else {
        	/*
            var currentUser = user[0];
            var options = {multi: false};
            user.update({name: name}, {status: false}, options, function (err, numRowsAffected) {
                if(err) console.log(err);
                else 
                    {
                        console.log("Updated: " + numRowsAffected);
                        res.send({'response':"Logged out"});
                    }
            });
*/
			updateUserStatus(name, false);
            res.send({'response':"Logged out"});
        }
    })
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