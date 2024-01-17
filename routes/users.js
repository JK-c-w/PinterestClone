var express =require('express');
var router=express.Router();
const mongoose=require('mongoose');
const plm =require('passport-local-mongoose');
const postModel = require('./postModel');
mongoose.connect("mongodb://127.0.0.1:27017/pinDB");
const userSchema= new mongoose.Schema({
   username:String,
   email:String ,
   Password:String,
   DOB:String,
   profileImage:String,
   postdata:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'postmodel'
   }]
})
userSchema.plugin(plm);
module.exports=mongoose.model("usermodel",userSchema);
