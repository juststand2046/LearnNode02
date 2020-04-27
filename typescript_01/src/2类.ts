//类
class Person {
    private _username: string;
    private _pwd: string;

    constructor(username: string = 'admin', pwd: string = 'pwd') {
        this._username = username;
        this._pwd = pwd;
    }

    login() {
        console.log('success')
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get pwd(): string {
        return this._pwd;
    }

    set pwd(value: string) {
        this._pwd = value;
    }
}

let p = new Person('admin', 'password');
console.log(p.username);

//类的继承
class Student extends Person {
    private _stuId: string;

    constructor(username: string = 'admin', pwd: string = 'pwd', stuId: string = '001') {
        super(username, pwd);
        this._stuId = stuId;
    }

    get stuId(): string {
        return this._stuId;
    }

    set stuId(value: string) {
        this._stuId = value;
    }
}

let stu1 = new Student();
console.log(stu1);
console.log(stu1.stuId);

//单例
class Mysql {
    public static mysqlInstance: any;

    private ip: string;
    private port: number;
    private uaccount: string;
    private pwd: string;

    private constructor(ip: string = '127.0.0.1', port: number = 3306, uaccount: string = 'root', pwd: string = '') {
        this.ip = ip;
        this.port = port;
        this.uaccount = uaccount;
        this.pwd = pwd;
    }

    query() {
    }

    insert() {
    }

    update() {
    }

    delete() {
    }

    public static getMysqlInstance() {
        if (!this.mysqlInstance) {
            this.mysqlInstance = new Mysql();
        } else {
            console.log('mysql实例已存在')
        }
        return this.mysqlInstance;
    }
}

console.log(Mysql.getMysqlInstance());
console.log(Mysql.getMysqlInstance());


//抽象类
abstract class Human {
    name: string;
    gender: number;

    constructor(name: string = 'name', gender: number = 18) {
        this.name = name;
        this.gender = gender;
    }

    abstract say(): void;
}

class Man extends Human {
    say(): void {
        console.log('具体实现')
    }
}

//接口
interface Optoins {
    name: string,
    pwd: string,
}

function foo2_2(x: Optoins): void {
    console.log('foo2', x);
}

foo2_2({name: 'a', pwd: '2'});

interface Optoins2 {
    name: string,
    pwd: string,

    login(flag: boolean): void;
}

function foo3_2(x: Optoins2): void {
    console.log('foo3', x);
}

foo3_2({
    name: 'a', pwd: '2', login: function (flag) {

    }
});
