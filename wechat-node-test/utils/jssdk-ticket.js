const {writeFile, readFile} = require('fs');
const AccessToken = require('../utils/access-token');
const rp = require('request-promise-native');
const sha1=require('sha1');

class WeChatJsSDK {
    constructor() {

    }

    // 获取jsapi_ticket
    getJsapiTicket() {
        //发送请求  返回promise
        return new Promise(async (resolve, reject) => {
            //获取accessToken
            let accessToken = new AccessToken();
            let token = await accessToken.fetchAccessToken();
            console.log(token);
            //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
            const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token.access_token}&type=jsapi`;

            rp({method: 'GET', url, json: true})
                .then(res => {
                    console.log(res);
                    //设置过期时间-5分钟
                    res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                    //更改promise状态  改为成功
                    resolve(res)
                })
                .catch(err => {
                    console.log(err);
                    reject('getJsapiTicket请求失败' + err)
                    //更改promise状态  改为失败
                })
        })
    }

    //保存saveJsapiTicket
    saveJsapiTicket(jsapiTicket) {
        //将对象转换为字符串
        jsapiTicket = JSON.stringify(jsapiTicket);
        //将jsapi_ticket保存文件
        return new Promise((resolve, reject) => {
            writeFile('./JsapiTicket.txt', jsapiTicket, err => {
                if (!err) {
                    console.log("文件保存成功");
                    resolve()
                } else {
                    console.log("文件保存异常");
                    reject(err)
                }
            })
        })

    }

    //读取jsapi_ticket文件
    readJsapiTicket() {
        return new Promise((resolve, reject) => {
            readFile('./JsapiTicket.txt', (err, data) => {
                if (!err) {
                    //将json字符串转换成js对象
                    data = JSON.parse(data);
                    console.log("文件读取成功");
                    resolve(data);
                } else {
                    console.log("文件读取异常");
                    reject(err)
                }
            })
        })
    }

    //判断jsapi_ticket是否过期
    isValidJsapiTicket(data) {
        //验证传入的参数是否是有效的
        if (!data && !data.ticket && !data.expires_in) {
            //acess_token无效
            return false
        }
        //检测jsapi_ticket是否在有效期内
        return data.expires_in > Date.now();
    }

    //获取未过期的jsapi_ticket
    fetchJsapiTicket() {
        return new Promise((resolve, reject) => {
            //读jsapi_ticket文件
            this.readJsapiTicket()
                //读取成功
                .then((res) => {
                    console.log('读取成功');
                    //判断是否过期
                    if (this.isValidJsapiTicket(res)) {
                        console.log('没过期');
                        //没过期，直接用
                        resolve(res);
                    } else {
                        console.log('过期了');
                        //过期，重新获取
                        this.getJsapiTicket()
                            //获取成功
                            .then((res) => {
                                //保存
                                this.saveJsapiTicket(res)
                                    .then(() => {
                                        //保存成功
                                        resolve(res);
                                    })
                                    .catch((err) => {
                                        reject(err);
                                    })

                            })
                            //获取失败
                            .catch((err) => {
                                //返回失败
                                reject(err);
                            })
                    }
                })
                //读取失败
                .catch((err) => {
                    console.log('读取失败');
                    //重新获取
                    this.getJsapiTicket()
                        //获取成功
                        .then((res) => {
                            //保存
                            this.saveJsapiTicket(res)
                                .then(() => {
                                    //保存成功
                                    resolve(res);
                                })
                                //保存失败
                                .catch((err) => {
                                    reject(err);
                                })

                        })
                        //获取失败
                        .catch((err) => {
                            //返回失败
                            reject(err);
                        })
                })
        });
    }

    //获取wx-js-sdk签名
    getWxJsSDKSignature(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let ticket = await this.fetchJsapiTicket();
                let jsapi_ticket = ticket.ticket;

                let params = {
                    'noncestr': Math.random().toString().split('.')[1],
                    'jsapi_ticket': jsapi_ticket,
                    'timestamp': Date.now(),
                    'url': url
                };
                let tempArr=[];
                for (let key in params){
                    tempArr.push(key+'='+params[key]);
                }
                console.log('tempArr:',tempArr);
                //字典序排序并拼接‘&’
                let sginStr=tempArr.sort().join('&');

                params.signature=sha1(sginStr);

                resolve(params);
            }catch (e) {
                reject(e);
            }




        })

    }
}

module.exports = WeChatJsSDK;