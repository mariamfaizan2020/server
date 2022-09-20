const express=require("express");
const app=express();
// const port =process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cors=require("cors");
const mysql=require("./connection")
// const mysql=require("mysql2")
// const pool=mysql.createPool({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"react sql",
//     port:3306
// })

app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
   

app.get("/api/get",(req,res)=>{
    const getUser="SELECT * FROM contact_db"
    mysql.pool.query(getUser,(err,result)=>{
        res.send(result)
    })
})

app.post("/api/post",(req,res)=>{
    const {name,email,contact} =req.body
    const insertUser="INSERT INTO contact_db (name,email,contact) VALUES (?,?,?)";
    mysql.pool.query(insertUser,[name,email,contact],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })
})

app.delete("/api/remove/:id",(req,res)=>{
const {id}=req.params;

    const deleteUser="DELETE FROM contact_db WHERE id=?";
    mysql.pool.query(deleteUser,id,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })
})

app.get("/api/get/:id",(req,res)=>{
    const {id}=req.params
    const getAUserData=`SELECT * FROM contact_db WHERE id=?`

    mysql.pool.query(getAUserData,id,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
  
    })
})



app.put("/api/update/:id",(req,res)=>{
    const {id}=req.params
    const {name,email,contact}=req.body
    const updateData=`UPDATE contact_db SET name=?, email=?, contact=? WHERE id =?`

    mysql.pool.query(updateData,[name,email,contact,id],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
  
    })
})

app.get("/",(req,res)=>{
//     let qry="INSERT INTO contact_db (name,email,contact) VALUES ('test3','test3@gmail.com','039344559')"
// // res.send("hello world")
// mysql.pool.query(qry,(err,results)=>{
//     console.log("error",err)
//     console.log("result",results)
//     res.send("added")
// })
})

app.listen(5000,()=>{
    console.log(`server is runnig on port 5000`)
})