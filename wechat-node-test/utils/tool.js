//工具函数
const {parseString} = require('xml2js');

module.exports = {
    getUserDataAsync(req) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            req.on('data', data => {
                //数据传递时 触发事件注入到回调函数中
                // console.log(data)
                //将 bufer 转换为字符串
                xmlData += data.toString()
            })
                .on('end', () => {
                    //数据接收完毕出发close 事件
                    resolve(xmlData)
                })
        })
    },

    parserXMLDataAsync(xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, {trim: true}, function (err, result) {
                if (!err) {
                    resolve(result);
                } else {
                    reject("parserXMLData方法出错了" + err);
                }
            });
        })
    },

    formatXmlData(newData) {
        const jsData = newData.xml;
        for (let item in jsData) {
            let value = jsData[item];
            //过滤非法数据
            if (Array.isArray(value) && value.length) {
                jsData[item] = value[0];
            }
        }
        return jsData;
    }
};