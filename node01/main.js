/*var fs=require('fs');
//阻塞
var data=fs.readFileSync('./src/assets/mytxt.txt');
console.log(data.toString());
//非阻塞
fs.readFile('./src/assets/mytxt.txt',function (err,data) {
   if(err){
       return console.error(err);
   }
   console.log(data.toString());
});

console.log('文件读取结束！');*/

/*var EventEmitter=require('events').EventEmitter;
var event=new EventEmitter();
event.on('eventName',function () {
    console.log('这里是触发事件的回调!')
});
setTimeout(function () {
    event.emit('eventName');
},1000);*/
/*var util=require("util");
function Person(name) {
    this.name=name;
    this.toString=function(){
        return this.name;
    }
}
var person = new Person('myname');
console.log(util.inspect(person));
console.log(util.inspect(person,true));
console.log(util.isArray([]));

console.error(util.isArray({}));

console.log(util.isRegExp(/web soket/));
console.log(util.isRegExp(/^1\/\.0$/));

console.log('校验时间',util.isDate(new Date()));
console.log('2019年12月27日16:04:06',util.isDate(Date()));*/

/*
var fs=require('fs');
fs.readFile('./input.txt',function (err,data) {
    if(err){
        return err;
    }
    console.log(data.toString());
});
console.log('异步读取TXT');

var dataSync = fs.readFileSync('./input.txt');
console.log(dataSync.toString());
console.log('同步读取TXT');
console.log(process);*/
/*
process.on('exit',function (code) {
    setTimeout(function () {
        console.log('该代码不执行！')
    },0);
    console.log('退出码:',code);
});
console.log('end');*/
/*var fs=require('fs');
var buf=new Buffer.alloc(1024);*/
/*
fs.open('./input.txt','r+',function (err,fd) {
   if(err){
       console.log(err)
   }
   console.log('file is opened!');

});*/
/*
fs.stat('./input.txt', function (err, stat) {
    if (err) {
        console.log(err);
    }
    console.log(stat);
    console.log('file is read！');
    console.log('file:', stat.isFile());
    console.log('directory:', stat.isDirectory());
});*/
/*fs.open('./input.txt',function (err,fd) {
    if(err){
        console.error(err);
    }
    console.log('文件打开成功！');
    console.log('准备读取文件!');
    fs.read(fd,buf,0,buf.length,0,function (err,bytes) {
        if(err){
            console.error(err);
        }
        console.log(bytes,'字节被读取！');
        if(bytes>0){
            console.log(buf.slice(0,bytes).toString());
        }
    })
});*/
/*fs.rmdir('./src/123',function (err) {
    if(err){
        console.log(err)
    }
    console.log('读取src目录');
    fs.readdir('./src',function (err,files) {
        if(err){
            console.error(err);
        }
        files.forEach(function (file) {
            console.log(file)
        });
    });

});*/
/*var http=require('http');
var url=require('url');
var util=require('util');
var querystring=require('querystring');

var postHtml='<html><head><meta charset="utf-8"><title>菜鸟教程 Node.js 实例</title></head>' +
    '<body>' +
    '<form method="post">' +
    'name： <input name="name"><br>' +
    'age： <input name="age"><br>' +
    '<input type="submit">' +
    '</form>' +
    '</body></html>';

http.createServer(
    function (request,response) {
        var body='';
        request.on('data',function (chunk) {
           body+=chunk;
        });
        request.on('end',function () {
            body=querystring.parse(body);
            response.writeHead(200,{'Content-Type':'text/html;utf-8'});
            if(body.name && body.age){
                response.write('name:'+body.name);
                response.write('<br>');
                response.write('age:'+body.age);
            }else {
                response.write(postHtml);
            }
            response.end();
        })
    }
).listen('3000');*/
/*
var fs=require('fs');
var http=require('http');
var url=require('url');

http.createServer(function (req,res) {
    var pathname=url.parse(req.url).pathname;
    fs.readFile(pathname.substr(1),function (err,data) {
        if(err){
            console.error(err);
            res.writeHead(404,{'Content-Type': 'text/html'});
        }else {
            res.writeHead(200,{'Content-Type': 'text/html'});
            //响应内容
            res.write(data.toString());
        }
        //  发送响应数据
        res.end();
    })
}).listen(3000);*/

var express=require('express');
var app=express();

app.get('/hello',function (req,res) {
    res.send('hello world')
});

var server=app.listen(3000,function () {
    console.log('address:',server.address().address);
    console.log('port:',server.address().port);
});