const path = require("path");
const pool = require("../config")
const express = require('express');
const router = express.Router();
const multer = require("multer");


var admin = require("firebase-admin");
var serviceAccount = require("./mobile-image-com-firebase-adminsdk-1c6sa-d34470338f.json");


const firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://mobile-image-com.appspot.com"
  });

  const auth = firebase.auth();
  

var bucket = firebase.storage().bucket();


// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./static/uploads");
  },
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });


router.post("/register3", async (req,res,next) => {
  const conn = await pool.getConnection();
  conn.beginTransaction();


  //login
  const email = req.body.data.email;
  const phone = req.body.data.tel;
  const pass = req.body.data.pass;

  // address
  const district = req.body.data.amphur
  const tumbon = req.body.data.tambon
  const province = req.body.data.province
  const zipcode = req.body.data.code
  const address = req.body.data.address


  //information
  const name = req.body.data.name
  const juristic_id = req.body.data.num
  const bussines_type = req.body.data.type
  const descriptions = req.body.data.about




  try{

    //login
    const [row] = await conn.query("insert into Company(email,phone,user_status,password) values(?,?,0,?)", [email,phone,pass])
    const id = row.insertId;

    //address
    const [row2] = await conn.query("insert into Com_address(com_id,district,tumbon,province,zipCode,address) values(?,?,?,?,?,?)",[id,district,tumbon,province,zipcode,address])
    const id2 = row2.insertId
   
    //information
    const [row3] = await conn.query("insert into Company_infomations(com_id,companyName,juristic_id,bussines_type,address_code,descriptions,avg_score) values(?,?,?,?,?,?,0)",[id,name,juristic_id,bussines_type,id2,descriptions])
    res.json({data:id})
    await conn.commit();
  }
  catch(err){
    await conn.rollback();
    console.log(err);
  }finally{
    conn.release();
  }
})

router.post("/register",upload.array("myImage",5),async (req,res,next) => {

  const conn = await pool.getConnection();
  conn.beginTransaction();
  const id = req.body.id.data;
     try{
      console.log(id);
        bucket.upload(req.files[0].path)
        const file = req.files[0].filename;
        const options = {
            version: 'v2',
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60
        }

        const [Url] = await bucket.file(file).getSignedUrl(options);
        
        // const [max] = await conn.query("select max(com_id) as max from Company")
        // const max_x = max[0].max+1;

        const [row] = await conn.query("update Company_infomations set image_juristic = ? where com_id = ? ",[Url,id] )
        
        
      await conn.commit();

     }
     catch(err){
        await conn.rollback();
     }finally{
      await conn.release();
     }
})



router.post("/register2",upload.array("myImage2",5),async (req,res,next) => {
  const conn = await pool.getConnection();
  conn.beginTransaction();
  const id = req.body.id.data;
    try{
      console.log(id);
       bucket.upload(req.files[0].path)
       const file = req.files[0].filename;
       const options = {
           version: 'v2',
           action: 'read',
           expires: Date.now() + 1000 * 60 * 60
       }

       const [Url] = await bucket.file(file).getSignedUrl(options);


      //  const [max] = await conn.query("select max(com_id) as max from Company")
      //  const max_x = max[0].max+1;
      
       const [row] = await conn.query("update Company_infomations set image_company = ? where com_id = ? ",[Url,id] )

      await conn.commit();
    }
    catch(err){
      await conn.rollback();
    }finally{
      await conn.release()
    }
   

})



exports.router = router;