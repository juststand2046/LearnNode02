const express = require('express');
const router = express.Router();
const user = require('../db/model/userModel');
//邮箱验证模块
const malier = require('../utils/mailer');

let myCodes = {};

/**
 * @api {post} /user/reg 注册用户
 * @apiName reg
 * @apiGroup User
 *
 * @apiParam {String} uaccount 用户名
 * @apiParam {String} pwd 用户密码
 * @apiParam {String} mail 用户邮箱
 * @apiParam {String} mailCode 验证码
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "uaccount": admin,
 *       "pwd": 123,
 *       "mail": 123@qq.com,
 *       "mailCode": 4711
 *     }
 *
 * @apiSuccess {Number} statusCode 状态码 0正常 其他异常
 * @apiSuccess {String} msg  返回的信息
 * @apiSuccess {Array} data  返回的数据
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "statusCode": 0,
 *       "msg": "操作成功",
 *       "data": [{"a":1,"b":2}]
 *     }
 */
router.post('/reg', (req, res) => {
    let {uaccount, pwd, mail, mailCode} = req.body;
    if (uaccount && pwd && mail && mailCode) {
        //检查验证码和邮箱
        if (myCodes.mail == mail && myCodes.mailCode == mailCode) {
            //检查验证码有效期
            if (new Date().getTime() - myCodes.sTime > 5 * 60 * 1000) {
                return res.send({statusCode: -2, msg: '验证码已过期', data: []});
            } else {
                console.log('验证通过！')
            }
        } else {
            return res.send({statusCode: -2, msg: '验证码错误', data: []});
        }
        //查询用户名是否重复
        user.find({uaccount})
            .then((data) => {
                if (data.length > 0) {
                    console.log('用户名重复');
                    throw new Error('用户名重复');
                } else {
                    return user.insertMany({uaccount, pwd});
                }
            })
            .then((data) => {
                console.log(data);
                console.log('user表插入数据成功！');
                res.send({statusCode: 0, msg: '注册成功', data: []});
            })
            .catch((err) => {
                console.error('user表插入数据失败！');
                return res.send({statusCode: -2, msg: '注册失败', data: []});
            });
    } else {
        return res.send({statusCode: -1, msg: '参数错误', data: []});
    }
});

/**
 * @api {post} /user/login 用户登录
 * @apiName userLogin
 * @apiGroup User
 *
 * @apiParam {String} uaccount 用户名
 * @apiParam {String} pwd 用户密码
 *
 * @apiSuccess {Number} statusCode 状态码 0正常 其他异常
 * @apiSuccess {String} msg  返回的信息
 * @apiSuccess {Array} data  返回的数据
 */
router.post('/login', (req, res) => {
    let {uaccount, pwd} = req.body;
    if (uaccount && pwd) {
        user.find({uaccount, pwd})
            .then((data) => {
                if (data.length > 0) {
                    res.send({statusCode: 0, msg: '登录成功', data: []});
                } else {
                    console.log('账号或密码错误');
                    res.send({statusCode: -2, msg: '账号或密码错误', data: []});
                }
            })
            .catch((err) => {
            });
    } else {
        console.log('参数错误');
        return res.send({statusCode: -1, msg: '参数错误', data: []});
    }
});

/**
 * @api {post} /user/mail_code 验证码
 * @apiName userMailCode
 * @apiGroup User
 *
 * @apiParam {String} mail 用户邮箱
 *
 * @apiSuccess {Number} statusCode 状态码 0正常 其他异常
 * @apiSuccess {String} msg  返回的信息
 * @apiSuccess {Array} data  返回的数据
 */
router.post('/mail_code', (req, res) => {
    let {mail} = req.body;
    if (mail) {
        let tempMailCode = parseInt(Math.random() * 10000);
        //0开头的补0
        if(tempMailCode.toString().length===3){
            tempMailCode='0'+tempMailCode;
        }
        console.log('tempMailCode:', tempMailCode);
        if (myCodes.sTime) {
            if (new Date().getTime() - myCodes.sTime > 5 * 60 * 1000) {

            } else {
                return res.send({statusCode: -2, msg: '发送验证码太频繁', data: []});
            }
        }
        malier.sendMail(tempMailCode, mail)
            .then((data) => {
                myCodes.mail = mail;
                myCodes.mailCode = tempMailCode;
                myCodes.sTime = new Date().getTime();
                res.send({statusCode: 0, msg: '发送成功', data: []});
                console.log('myCodes:', myCodes);
            })
            .catch((err) => {
                console.log('发送失败');
                res.send({statusCode: -1, msg: '发送失败', data: []});
            });

    } else {
        console.log('参数错误');
        res.send({statusCode: -1, msg: '参数错误', data: []});
    }
});

module.exports = router;