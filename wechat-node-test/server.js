//express框架
const express=require('express');
const app=express();

//路径模块
const path=require('path');
//post解析请求体
const bodyParser=require('body-parser');
const cors=require('cors');

//路由
const wechatRouter=require('./router/wechatRouter');

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

//配置静态资源目录
app.use('/public',express.static(path.join(__dirname,'./public')));

app.use('/wx',wechatRouter);

app.listen(port,hostName,()=>{
    console.log(`服务器运行在${hostName}:${port}`)
});