const express = require('express');
const router = express.Router();
const rp=require('request-promise-native');

const config = require('../config/index');
const sha1 = require('sha1');
const WeChat = require('../utils/access-token');
const WeChatMenu=require('../utils/menu');
const WeChatJsSDK=require('../utils/jssdk-ticket');
const {getUserDataAsync, formatXmlData, parserXMLDataAsync} = require('../utils/tool');
const reply=require('../utils/reply');
const menuList=require('../config/menu-list');

/*
{ signature: '0d1962496fe92e76bd49143d95320377aa15dfd2',
  echostr: '8244657894879360715',
  timestamp: '1587884609',
  nonce: '136563151' }
* */
router.get('/wechat-validate', (req, res) => {
        console.log(req.query);
        let {signature, timestamp, nonce, echostr} = req.query;
        let {Token} = config;

        let arr = [timestamp, nonce, Token];
        //按微信要求的规则排序加密
        let sha1Str = sha1(arr.sort().join(''));

        console.log(sha1Str);
        //对比加密后结果与signature
        if (sha1Str === signature) {
            res.send(echostr);
        } else {
            res.end('error');
        }
        res.end('1111')
    }
);
//处理公众号用户发过来的消息
router.post('/wechat-validate', async (req, res) => {
        console.log('post 请求来了');
        console.log(req.query);
        let {signature, timestamp, nonce, echostr} = req.query;
        let {Token} = config;

        let arr = [timestamp, nonce, Token];
        //按微信要求的规则排序加密
        let sha1Str = sha1(arr.sort().join(''));

        console.log(sha1Str);
        //对比加密后结果与signature
        if (sha1Str !== signature) {
            res.end('error');
        } else {
            let xmlData=await getUserDataAsync(req);
            let parserData=await parserXMLDataAsync(xmlData);
            let formatData=await formatXmlData(parserData);

            console.log('------------');
            console.log(formatData);

            let replyMsg=reply(formatData);
            res.send(replyMsg);
        }

    }
);
router.get('/get-token', (req, res) => {
    //检查有无文件
        //有文件 检查内容是否过期
            //过期 请求
            //没过期 使用
    //没有文件 请求access_token并保存文件然后使用
    let weChat = new WeChat();
    weChat.fetchAccessToken()
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

});
//创建菜单
router.get('/creat-menu',async (req,res)=>{
    try {
        let weChat = new WeChat();
        let token=await weChat.fetchAccessToken();
        let weChatMenu = new WeChatMenu();
        let result=await weChatMenu.addMenu(token.access_token,menuList);
        res.send(result);
    }catch (e) {
        res.send('创建菜单时错误：'+e);
    }
});
//删除菜单
router.get('/del-menu',async (req,res)=>{
    try {
        let weChat = new WeChat();
        let token=await weChat.fetchAccessToken();
        let weChatMenu=new WeChatMenu();
        let result=await weChatMenu.deleteMenu(token.access_token);
        res.send(result);
    }catch (e) {
        res.send('删除菜单时错误：'+e);
    }
});

router.get('/index',async (req,res)=>{
    let url='http://30m1853v49.wicp.vip/wx/index';

    let weChatJsSDK = new WeChatJsSDK();
    let result= await weChatJsSDK.getWxJsSDKSignature(url);

    console.log('-----------');
    console.log('result:',result);

    res.render('index.ejs',result);
});

module.exports = router;