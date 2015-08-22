var auth = require('../controllers/authController');
var chat = require('../controllers/chatController');
var user = require('../controllers/userController');
 
 
module.exports = function(app) {
 
    app.get('/', function(req, res) {
        res.end("Node-Android-Chat-Project");
    });
 
    app.post('/register', auth.register);

    app.post('/login', user.login);

    app.post('/logout', user.logout);
 
    app.post('/getuser', user.getUsers);

    app.post('/send', chat.send);
 
    app.post('/upload', chat.sendImage);
 
    app.get('/uploads/:file', chat.getImage);

    // Tests
    app.post('/uploadImageTest', function(req, res) {
        console.log("Image uploaded");
        res.json({'response':"Image Uploaded"});
    });

};