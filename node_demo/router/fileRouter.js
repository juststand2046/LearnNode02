const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

function multerOption(files, fileSize) {
    let upload = multer({
        storage: multer.diskStorage({
            //设置文件存储位置
            destination: function (req, file, cb) {
                let dir = "./public/uploads";
                //判断目录是否存在，没有则创建
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, {recursive: true});
                }
                //dir就是上传文件存放的目录
                cb(null, dir);
            },
            //设置文件名称
            filename: function (req, file, cb) {
                let fileName = file.fieldname + '-' + Date.now() + file.originalname;
                //fileName就是上传文件的文件名
                cb(null, fileName);
            }
        }),
        //用于过滤文件的函数
        fileFilter: function (req, file, cb) {
            let tempext = file.originalname.split('.');
            console.log('file:', file);
            let ext = tempext[tempext.length - 1];
            let extArr = ['jpg', 'jpeg', 'gif', 'png'];
            if (!extArr.includes(ext)) {
                console.log('扩展名不正确');
                //拒绝这个文件
                cb(null, false);
            } else {
                //接受这个文件
                cb(null, true);
            }

        },
        limits: {
            //最多能上传多少个文件
            files: files,
            //文件大小(MB)
            fileSize: fileSize * 1024 * 1024
        }
    });
    return upload;
}

//单文件上传
router.post('/upload', multerOption(1, 5).single('img'), (req, res, next) => {
    console.log('req.file:', req.file);
    if (req.file === undefined) {
        return res.send({statusCode: -1, msg: '上传失败', data: []});
    }
    res.send({statusCode: 0, msg: '上传成功', data: [req.file]});
});
//多文件上传
//限制10个大小限制5MB
router.post('/uploads', multerOption(10, 5).array('img', 10), (req, res, next) => {
    console.log('req.files:', req.files);
    if (req.files === undefined) {
        return res.send({statusCode: -1, msg: '上传失败', data: []});
    }
    res.send({statusCode: 0, msg: '上传成功', data: [req.files]});
});
//文件下载
router.get('/download', function (req, res) {
    console.log("---------访问下载路径-------------");
    let {fileName} = req.query;
    let realPath = './public/uploads/' + fileName;

    if (!fs.existsSync(realPath)) {
        console.log("文件不存在");
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        res.write("This request URL /" + fileName + " was not found on this server.");
        res.end();
    } else {
        console.log("文件存在");
        fs.readFile(realPath, "binary", function (err, file) {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                console.log("读取文件错误");
                res.end(err);
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                console.log("读取文件完毕，正在发送......");

                res.write(file, "binary");

                res.end();
                console.log("文件发送完毕");
            }
        });
    }
});

module.exports = router;