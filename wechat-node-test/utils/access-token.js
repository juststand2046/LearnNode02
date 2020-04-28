const {writeFile, readFile} = require('fs');
const {appID, appsecret} = require('../config/index');
const rp = require('request-promise-native');

class WeChat {
    constructor() {

    }

    // 获取access_token
    getAccessToken() {
        //https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
        const url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appID + '&secret=' + appsecret;

        //发送请求  返回promise
        return new Promise((resolve, reject) => {
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
                    reject('getAccessToken请求失败' + err)
                    //更改promise状态  改为失败
                })
        })
    }

    //保存saveAccessToken
    saveAccessToken(accessToken) {
        //将对象转换为字符串
        accessToken = JSON.stringify(accessToken);
        //将access_token保存文件
        return new Promise((resolve, reject) => {
            writeFile('./AccessToken.txt', accessToken, err => {
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

    //读取access_token文件
    readAccessToken() {
        return new Promise((resolve, reject) => {
            readFile('./AccessToken.txt', (err, data) => {
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

    //判断access_token是否过期
    isValidAccessToken(data) {
        //验证传入的参数是否是有效的
        if (!data && !data.access_token && !data.expires_in) {
            //acess_token无效
            return false
        }
        //检测access_token是否在有效期内
        return data.expires_in > Date.now();
    }

    //获取未过期的access_token
    fetchAccessToken() {
        return new Promise((resolve, reject) => {
            //读access_token文件
            this.readAccessToken()
                //读取成功
                .then((res) => {
                    console.log('读取成功');
                    //判断是否过期
                    if (this.isValidAccessToken(res)) {
                        console.log('没过期');
                        //没过期，直接用
                        resolve(res);
                    } else {
                        console.log('过期了');
                        //过期，重新获取
                        this.getAccessToken()
                            //获取成功
                            .then((res) => {
                                //保存
                                this.saveAccessToken(res)
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
                    this.getAccessToken()
                        //获取成功
                        .then((res) => {
                            //保存
                            this.saveAccessToken(res)
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
}

module.exports = WeChat;