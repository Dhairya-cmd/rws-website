const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const fs=require('fs');
const Service=require('../models/services');
const Gallery=require('../models/gallery');

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{const dir='./uploads/';if(!fs.existsSync(dir))fs.mkdirSync(dir);cb(null,dir)},
  filename:(req,file,cb)=>cb(null,Date.now()+'-'+file.originalname.replace(/\s/g,'_'))
});
const upload=multer({storage});

router.post('/login',(req,res)=>{
  const{username,password}=req.body;
  if(username===process.env.ADMIN_USER&&password===process.env.ADMIN_PASS)
    res.json({success:true,token:'rws-auth-token'});
  else res.status(401).json({success:false,message:'Invalid credentials'});
});

router.get('/all-content',async(req,res)=>{
  const services=await Service.find().sort('order');
  const gallery=await Gallery.find().sort('-createdAt');
  res.json({services,gallery});
});

router.post('/services',async(req,res)=>{
  const{id,title,icon,desc}=req.body;
  if(id)await Service.findByIdAndUpdate(id,{title,icon,desc});
  else await new Service({title,icon,desc,order:0}).save();
  res.json({success:true});
});

router.post('/gallery',upload.array('files',15),async(req,res)=>{
  const{category,mediaType}=req.body;
  const promises=req.files.map(f=>{
    const mediaUrl=`/uploads/${f.filename}`;
    return new Gallery({category,type:mediaType,mediaUrl,title:''}).save();
  });
  await Promise.all(promises);
  res.json({success:true});
});

router.delete('/services/:id',async(req,res)=>{await Service.findByIdAndDelete(req.params.id);res.json({success:true})});
router.delete('/gallery/:id',async(req,res)=>{await Gallery.findByIdAndDelete(req.params.id);res.json({success:true})});

module.exports=router;
