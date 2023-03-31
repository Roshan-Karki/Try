const connectData = require ("mysql")
const con = connectData.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"",
        database:"customer",
         port:3306
    }
);

con.connect((err)=>{
    if(err)
     throw err;
    
    console.log("Connection created.");
    
});

module.exports.con = con;