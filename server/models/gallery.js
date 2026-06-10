const mongoose=require('mongoose');
const gallerySchema=new mongoose.Schema({
  title:String,
  category:{type:String,required:true},
  type:{type:String,enum:['image','video'],default:'image'},
  mediaType:{type:String,enum:['image','video'],default:'image'},
  mediaUrl:{type:String,required:true},
  createdAt:{type:Date,default:Date.now}
});
module.exports=mongoose.model('Gallery',gallerySchema);
