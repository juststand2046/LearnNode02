//express框架
const express=require('express');
const app=express();
//连接数据库
const connect=require('./db/connection');
//路径模块
const path=require('path');
//post解析请求体
const bodyParser=require('body-parser');
const cors=require('cors');

//路由
const userRouter=require('./router/userRouter');
const fileRouter=require('./router/fileRouter');

app.use('/user',userRouter);
app.use('/file',fileRouter);


//解析 x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//解析json
app.use(bodyParser.json());
//ip
let hostName = '127.0.0.1';
//端口
let port = 3000;

//设置允许跨域请求
app.use(cors());
/*app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*'); //访问控制允许来源：所有
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //访问控制允许报头 X-Requested-With: xhr请求
    res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS'); //访问控制允许方法
    res.header('X-Powered-By', 'nodejs'); //自定义头信息，表示服务端用nodejs
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});*/

//配置静态资源目录
app.use('/public',express.static(path.join(__dirname,'./public')));


app.listen(port,hostName,()=>{
    console.log(`服务器运行在${hostName}:${port}`)
});