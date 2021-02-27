require("dotenv").config();
const mongoose=require("mongoose");

function connDB(){
    //database connection
    mongoose.connect(process.env.MONGO_CONN_URL,{
        useCreateIndex:true,
        useNewUrlParser:true,
        useFindAndModify:true,
        useUnifiedTopology:true
    });
    const connection=mongoose.connection;

    connection.once('open',()=>{
        console.log("database connection successfully");
    }).catch(err =>{
        console.log(err);
    })

}

module.exports=connDB;

