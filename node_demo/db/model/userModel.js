const mongoose=require('mongoose');

let userSchema=mongoose.Schema({
    uaccount:{type:String,required:true},
    pwd:{type:String,required:true},
    age:Number,
    gender:{type:Number,default:2}
});
let User=mongoose.model('users',userSchema);

module.exports=User;