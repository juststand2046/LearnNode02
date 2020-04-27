"use strict";
const nodemailer = require("nodemailer");
//express框架模块
var express = require('express');
//系统路径模块
var path = require('path');
//文件模块
var fs = require('fs');
//对post请求的请求体进行解析模块
var bodyParser = require('body-parser');
var app = express();
//bodyParser.urlencoded 用来解析request中body的 urlencoded字符，
// 只支持utf-8的编码的字符，也支持自动的解析gzip和 zlib。返回的对象是一个键值对，
// 当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({extended: false}));
//ip
var hostName = '127.0.0.1';
//端口
var port = 3000;

//设置允许跨域请求
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

//创建发送对象
let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: '1099359300@qq.com', // generated ethereal user
        pass: 'vumkohiylehzhadc' // generated ethereal password
    }
});

//邮件信息
let info = {
    from: '"Alice" <1099359300@qq.com>', // sender address
    to: "1099359300@qq.com", // list of receivers
    subject: "主题", // Subject line
    //text: "Hello world?", // plain text body
    html: "您的验证码是：<b>23333</b>" // html body
};
/*transporter.sendMail(info,(err,data)=> {
    if(err){
        console.error(err);
    }
    console.log(data);
});*/

//创建get接口
app.get('/api', function (req, res) {

    //console.log(req.body); //获取请求参数
    //文件路径，__dirname为当前运行js文件的目录
    var file = path.join(__dirname, './node_modules/nodemailer/lib/well-known/services.json');
    //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

    //读取json文件
    fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
            res.send('文件读取失败');
        } else {
            res.send(data);
            console.log(data);
        }
    });
});

app.listen(port, hostName, function () {
    console.log(`服务器运行在http://${hostName}:${port}`);
});
