
const mongoose  = require('mongoose');
const postSchema= new mongoose.Schema({
   u:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'usermodel'
   },
   image:String,
   title:String,
   description:String
})
module.exports=mongoose.model("postmodel",postSchema);
