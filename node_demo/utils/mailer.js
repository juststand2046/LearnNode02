const nodemailer = require('nodemailer');

//创建发送对象
let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: '1099359300@qq.com', // generated ethereal user
        pass: 'ujxvogfbgyzbjdhf' // generated ethereal password
    }
});

function sendMail(mailCode, userMail) {
    //邮件信息
    let info = {
        from: '"Alice" <1099359300@qq.com>', // sender address
        to: userMail, // list of receivers
        subject: "主题", // Subject line
        //text: "Hello world?", // plain text body
        html: `您的验证码是：<b>${mailCode}</b>，有效期5分钟` // html body
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(info, (err, data) => {
            if (err) {
                console.error(err);
                reject();
            } else {
                console.log('发送成功！');
                resolve();
            }
        });
    });
}

module.exports = {sendMail};