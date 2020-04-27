const https = require('https');
const http = require('http');
const fs = require('fs');
//使字符串实现类dom操作
const cheerio = require('cheerio');

let url = 'https://www.iqiyi.com/';
let json = '';
let rawData = '';

https.get(url, (res) => {
    //安全判断
    const {statusCode} = res;
    const contentType = res.headers['content-type'];
    console.log(statusCode, contentType);
    let err = null;
    if (statusCode != 200) {
        err = new Error('请求状态错误！');
    } else if (!/^text\/html/.test(contentType)) {
        err = new Error('请求资源不是HTML！')
    }

    //请求发生错误
    if (err) {
        console.error(err);
        //清除缓存
        res.resume();
        return false;
    }

    //数据操作
    res.on('data', (chunk) => {
        console.log('数据传输中。。。');
        rawData += chunk;
    });
    //传输完毕写入
    res.on('end', () => {
        console.log('数据传输完毕');
        //fs.writeFileSync('./bilibili.html', rawData);
        let $ = cheerio.load(rawData);
        $('img').each((index, item) => {
            let src=$(item).attr('src');
            console.log($(item).attr('src'));
            if (src != '' && src != null) {
                let imgData = [];
                let imgSize = 0;
                //请求图片，写入本地http://pic3.iqiyipic.com/common/20171106/ad/1b/vip_100003_v_601_0_21.png
                http.get('http:' + src, (res) => {
                    res.on('data', (chunk) => {
                        imgData.push(chunk);
                        imgSize += chunk.length;
                    });
                    res.on('end', () => {
                        //合并buffer
                        let buffer = Buffer.concat(imgData, imgSize);
                        fs.writeFileSync('./src/assets/imgs/' + new Date().getTime() + '.png', buffer, (err) => {
                                if (err) {
                                return console.error(err);
                                }
                                console.log('抓取图片成功！')
                            }
                        );
                    });
                }).on('error', (err) => {
                    console.log(err);
                })
            }
        });
    })

}).on('error', (err) => {
    console.log(err);
});