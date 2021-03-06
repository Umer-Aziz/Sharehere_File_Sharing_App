const express=require("express");
const app=express();
const path=require('path');
const PORT=process.env.PORT || 3000
const connDB=require("./config/db");
connDB();

app.set('views',path.join(__dirname,"/views"));
const publicpath=path.join(__dirname,"/public");
app.set('view engine','ejs');

app.use(express.static(publicpath))
app.use(express.json());
//routes
app.use("/api/files", require("./routes/files"));
app.use("/files",require("./routes/show"))
app.use('/files/downloads',require('./routes/download'))




app.get("/",(req,res)=>{
    res.render('index')
})

app.listen(PORT,(re,res)=>{
    console.log(`the server running on port ${PORT}`)
})
