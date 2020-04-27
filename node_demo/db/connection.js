const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test01', {useNewUrlParser: true, useUnifiedTopology: true});
//数据库连接对象
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',  function () {
    console.log('数据库连接成功')
});