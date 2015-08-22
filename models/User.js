var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name : String,
    reg_id: String,
    status: {type:Boolean, default:false},
    imagesToView: [{
    	from: String,
    	location: String
    }]
});

userSchema.methods = {
	addImagesToView : addImagesToView,
	getImagesAuth : getImagesAuth
}

var User = mongoose.model('User', userSchema);

function addImagesToView (from, location) {
	this.imagesToView.push({from: from, location: location});
	this.save(function (err) {
		if (err) console.log(err);
	})
}

function getImagesAuth(location) {
	for(var i=0; i<this.imagesToView.length; i++) {
		if (this.imagesToView[i].location == location) 
			return true;
	}
	return false;
}
