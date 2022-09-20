const mysql=require("mysql2")
const pool=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"react sql",
    port:3306
})

// con.connect((err)=>{
//     if(err) throw err;
//     console.log("connection created..!!")
// })

module.exports={pool};