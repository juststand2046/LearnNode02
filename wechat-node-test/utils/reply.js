/*根据用户发送的内容回复信息*/
module.exports = (message) => {

    let content = '';
    if (message.MsgType === 'text') {
        content = `<xml>
                      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                      <CreateTime>${Date.now()}</CreateTime>
                      <MsgType><![CDATA[text]]></MsgType>
                      <Content><![CDATA[我是一个复读机：${message.Content}]]></Content>
                   </xml>`
    } else if (message.MsgType === 'voice') {
        content = `<xml>
                      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                      <CreateTime>${Date.now()}</CreateTime>
                      <MsgType><![CDATA[voice]]></MsgType>
                      <Voice>
                        <MediaId><![CDATA[${message.MediaId}]]></MediaId>
                      </Voice>
                   </xml>`
    } else if (message.MsgType === 'image') {
        content = `<xml>
                      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                      <CreateTime>${Date.now()}</CreateTime>
                      <MsgType><![CDATA[image]]></MsgType>
                      <Image>
                        <MediaId><![CDATA[${message.MediaId}]]></MediaId>
                      </Image>
                   </xml>`
    } else {
        content = `<xml>
                      <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                      <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                      <CreateTime>${Date.now()}</CreateTime>
                      <MsgType><![CDATA[text]]></MsgType>
                      <Content><![CDATA[收到了语音、文字和图片之外的消息]]></Content>
                   </xml>`
    }
    console.log(content);
    return content;
};