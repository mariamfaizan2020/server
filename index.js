const express=require("express");
const app=express();
const bodyParser = require("body-parser");
const cors=require("cors");
const mysql=require("./connection")
app.use(cors());
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}));
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


   

// app.get("/api/get",(req,res)=>{
//     const getUser="SELECT * FROM contact_db "
//     mysql.pool.query(getUser,(err,result)=>{
//         res.send(result)
//     })
// })
const comparePassword=(password,hashPassword)=>{
    console.log(bcrypt.compareSync(password,hashPassword))
    const checkPassword=bcrypt.compareSync(password,hashPassword)
    return checkPassword
  
}

const createToken = (userId) => {
    const token = jwt.sign({ id: userId }, `655595mokkmkmmkkokomkomokmo`, {
      expiresIn: "1d",
    });
    return token;
}

app.post("/api/login",(req,res)=>{
    const {email,password}=req.body
    console.log("req..body",req.body.password)
    const checkEmail=`SELECT id,email,password FROM users WHERE email="${email}"` //string values should be in ""
    console.log("check",checkEmail)
    mysql.pool.query(checkEmail,(err,checkEmailResult)=>{
        console.log("res",checkEmailResult)
        if(checkEmailResult.length>0){
        //     // res.status(200).send({msg:"email exists"})  we can only give single res.
          let checkPassStatus=comparePassword(password,checkEmailResult[0].password)
        if(checkPassStatus){
                let generatedToken= createToken(checkEmailResult.id) 
              return res.status(200).send(
                  {
                      msg:"user Login successfully" ,
                     status:200,
                token:generatedToken,
                auth:true
                 })
         }else{
              res.status(400).send({msg:"password is incorrect"})
             }

        }else{
           res.status(400).send({msg:"email doesnt exist"})
       }
    })
})

app.post("/api/register",(req,res)=>{
    const {name,email,password,image}=req.body
    console.log('req.body',req.body)
    const check=`SELECT email FROM users WHERE email="${email}"`
   console.log("check",check)
   mysql.pool.query(check,[email],async(err,result)=>{
       console.log("res",result)
       if(result.length>0){
        res.status(400).send({msg:"Email already exists"})
       }else{
        const hashpass=await bcrypt.hash(password,10)
           const registerUser=`INSERT INTO users (name,email,password,image) VALUES ('${name}','${email}','${hashpass}','${image}')`;
           console.log(registerUser)
          
    mysql.pool.query(registerUser,(err,result)=>{
        console.log("result",result)
        if(result){
            res.status(200).send({msg:"user created successfully",status:200})
        }else{
            res.status(400).send({msg:"something went wrong",status:400})
        }
    })
       }
   })
    
})

app.post("/api/getPost",(req,res)=>{
    const {start,limit}=req.body
    console.log("s",start,limit)
    const getUser=`SELECT * FROM contact_db LIMIT ${start},${limit}`
    // console.log("getUSer",getUser)
    mysql.pool.query(getUser,(err,result)=>{
        res.send(result)
        // console.log("res",result)
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


app.listen(5000,()=>{
    console.log(`server is runnig on port 5000`)
})