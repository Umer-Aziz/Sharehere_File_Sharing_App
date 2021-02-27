const express=require("express");
const app=express();
const path=require('path');
const PORT=process.env.PORT || 3000
const connDB=require("./config/db");
connDB();

app.set('views',path.join(__dirname,"/views"))
app.set('view engine','ejs');


//routes
app.use("/api/files", require("./routes/files"));
app.use("/files",require("./routes/show"))



app.listen(PORT,(re,res)=>{
    console.log(`the server running on port ${PORT}`)
})
