const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const multer=require('multer');
const path=require('path');
require('dotenv').config();

const app=express();
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect(process.env.MONGO_URI||'mongodb://localhost:27017/rws_database')
  .then(()=>console.log('✅ MongoDB Connected'))
  .catch(err=>console.error('❌ MongoDB Error:',err.message));

app.use('/api/admin',require('./routes/adminRoutes'));

// Contact form
const upload=multer({dest:'./uploads/'});
const Contact=require('./models/Contact');
app.post('/api/contact',upload.array('quoteFiles',5),async(req,res)=>{
  try{
    const{name,email,company,service,message}=req.body;
    await new Contact({name,email,company,service,message,files:req.files?.map(f=>f.filename)||[]}).save();
    res.json({success:true});
  }catch(err){res.status(500).json({success:false,error:err.message});}
});

app.get('/',(req,res)=>res.send('RWS API running'));

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`🚀 Server on http://localhost:${PORT}`));
