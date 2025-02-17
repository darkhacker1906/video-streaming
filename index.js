import express from "express";
import cors from "cors";
import multer from "multer";
import {v4 as uuid} from "uuid";
import path from "path";
import fs from "fs";
import { exec } from "child_process"; //watch out
import { stderr, stdout } from "process";

const app=express();
app.use(cors({origin: ["http://localhost:3000","http://localhost:5173"]}))
const PORT=8000;
app.use((req,res,next)=>{
    res.header("Access-control-Allow-Origin","*")
    res.header(
        "Access-control-Allow-Headers",
        "Origin, X-Requested With, Content-Type, Accept");
        next();
})
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//multer middleware-------------------

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname+ "-" +uuid()+ path.extname(file.originalname));
    }
  });
  //multer configuration---------
  const upload = multer({
    storage: storage,
  });
  app.post("/upload",upload.single('file'),function(req,res){
    console.log("Video uploaded");
    const lessionId=uuid();
    const videoPath=req.file.path;
    const outputPath=`./uploads/courses/${lessionId}`;
    const hlsPath=`${outputPath}/index.m3u8`;
    console.log(hlsPath,'hlsPathhlsPath');
   if(fs.existsSync(outputPath)){
      fs.mkdirSync(outputPath);
   }
   //ffmpeg command
   const ffmpegCommand = `ffmpeg -i ${videoPath} 
   -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type
    vod -hls_segment_filename "${outputPath}/segment%03d.
    ts" -start_number 0 ${hlsPath}`;

    //no queue because of POC , not to b used in production
    exec(ffmpegCommand,(error,stdout,stderr)=>{
       if(error){
        console.log(`execution error: ${error}`);
       }
    })
    console.log(`stdout error: ${stdout}`);
    console.log(`stderr error: ${stderr}`);
    const videoUrl=`http://localhost:8000/uploads/courses/${lessionId}/index.m3u8`;
    res.json({
      message:"Video converted to HLS format",
      videoUrl:videoUrl,
      lessionId:lessionId,
    });
  })

app.get('/',function(req,res){
    res.json({message:"First video stream"});
})
app.listen(PORT,function(){
    console.log(`Server started at ${PORT}`);
})
