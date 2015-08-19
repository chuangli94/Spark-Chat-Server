var requests = require('../config/requests');
var request = require('request');
var fs = require('fs');
 
 
module.exports = function(app) {
 
 
 
    app.get('/', function(req, res) {
 
        res.end("Node-Android-Chat-Project");
    });
 
    app.post('/register', function(req, res) {
        var name = req.body.name;
        var reg_id = req.body.reg_id;

        requests.register(name, reg_id, function(result) {
            console.log(result);
            res.json(result);
        });
    });

    app.post('/login',function(req,res){
        var name = req.body.name;
 
        requests.login(name,function (found) {
            console.log(found);
            res.json(found);
        });
    });
 
    app.post('/send',function(req,res){
        var from = req.body.from;
        var to = req.body.to;
        var msg = req.body.msg;
 
        console.log("From: " + from + "   To: " + to + "  msg: " + msg);
 
        requests.send(from,to,msg,function (found) {
            console.log(found);
            res.json(found);
    });
    });
 
    app.post('/getuser',function(req,res){
        var name = req.body.name;
 
        requests.getuser(name,function (found) {
            console.log(found);
            res.json(found);
    });
    });
 
    app.post('/logout',function(req,res){
        var name = req.body.name;
        
        requests.logout(name,function (found) {
            console.log(found);
            res.json(found);
        });
    
    });

    app.post('/uploadImageTest', function(req, res) {
        console.log("Image uploaded");
        res.json({'response':"Image Uploaded"});
    });
 
    app.post('/upload', function(req, res) {
        requests.saveImage(req.files, function (saved) {
            console.log(saved);
            res.json(saved);
        });
    });
 
 
    app.get('/uploads/:file', function (req, res){
        file = req.params.file;
        var dirname = "C:/Users/Chuang/Projects/Spark-Chat/server/uploads/";
        var img = fs.readFileSync(dirname + file);
        res.writeHead(200, {'Content-Type': 'image/jpg' });
        res.end(img, 'binary');
    });

};