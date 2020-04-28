/*创建和删除菜单*/

const rp = require('request-promise-native');


class WeChatMenu {
    constructor() {

    }

    addMenu(token, menu) {
        return new Promise((resolve, reject) => {
            //添加之前先删除之前的
            this.deleteMenu(token)
                .then(() => {
                    let addUrl = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${token}`;
                    rp({method: 'POST', uri: addUrl, json: true, body: menu})
                        .then((data) => {
                            resolve(data);
                        })
                        .catch((error) => {
                            reject(error);
                        })
                })
                .catch((error) => {
                    reject(error);
                });

        });

    }

    deleteMenu(token) {
        return new Promise((resolve, reject) => {
            let url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${token}`;
            rp({method: 'GET', url, json: true})
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                })
        });

    }
}

module.exports=WeChatMenu;