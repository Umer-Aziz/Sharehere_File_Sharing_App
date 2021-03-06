const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");

let storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "uploads/"),
  filename: (req, file, callback) => {
    const Uname = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    callback(null, Uname);
  },
});

let upload = multer({
  storage,
  limit: { fileSize: 100000 * 100 },
}).single("myfile");

router.post("/", (req, res) => {
  //validate req
  

  //store files

  upload(req, res, async (err) => {

    if (!req.file) {
        return res.json({ error: "All fileds are required." });
      }


    if (err) {
      return res.status(500).send({ error: err.message });
    }

    //store in database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({file:`${process.env.APP_BASE_URL}files/${response.uuid}`})
  });

  
});

router.post('/send',async(req,res)=>{
  
 
  const {uuid, emailTo ,emailFrom }=req.body;
 //validating req
 if(!uuid || !emailTo ||!emailFrom){
   return res.status(422).send({error:"All fields are required."})
 }
//get data from database
const file=await File.findOne({uuid: uuid});
if(file.sender){
  return res.status(422).send({error:"Email already sent."})

}
file.sender=emailFrom;
file.receiver=emailTo;

const response=await file.save();

//send email
const sendMail=require("../services/EmailService")
sendMail({
  from:emailFrom,
  to:emailTo,
  subject:'ShareHere File Sharing',
  text:`${emailFrom} shared a file with you .`,
  html:require("../services/EmailTemplate")({
    emailFrom:emailFrom,
    downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
    size:parseInt(file.size/1000) + 'KB',
    expires:'48 Hours'
  })

});
return res.send({success:true})

})

module.exports = router;
