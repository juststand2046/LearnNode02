//ts空值检测
/*let div=document.querySelector('div');
if(div){
    div.style.color='red';
}*/

//变量接收fun
let foo:(x:string,y:number)=>string=function (x:string, y:number) {

    return x+y;
};
foo('1',2);

//空返回值
function foo1(x:number,y:number):void{

}
foo1(1,2);
//返回值为Sting类型
function foo2(x:number,y:number):string {

    return '123';
}
foo2(1,2);

//参数可选
function foo3(x:number,y?:number):void {

}
foo3(1);

//参数默认值
function foo4(x:number=0,y:string):number {

    return x+Number(y);
}
foo4(undefined,'1');
console.log(foo4(undefined,'1'));

function foo5(x=0,y?:number):void{

}

//参数作为数组传入
function foo6(x:number,...args:[]):void {

}

//函数重载（类型系统）
function foo7(x:number,y:number):number;
function foo7(x:string,y:string):string;
function foo7(x:any,y:any):any{

    return 1;
}
foo7(1,1);
foo7('1','1');

//同一参数可选多种类型
function foo8(x:number|string):number {

    return 0;
}
foo8(1);
foo8('1');