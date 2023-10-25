const pool = require("../config")
const express = require('express');
const router = express.Router();

router.post("/applicans", async (req,res,next) => {

    const id = req.body.work_id;
    try{

        const [row,fields] = await pool.query("select * from Personal_infomations join Job_registor using (emp_id) where job_id = ?",[id])
        // console.log(row);
        const [row1,field1] = await pool.query("select *,DATE_FORMAT(day_start,'%d-%m-%Y') as day_start from Jobs join Company_infomations using (com_id) where job_id = ?",[id]);
        res.json({appli:row,work:row1})

    }catch(err){
        console.log(err);
    }
})


router.put("/confirm", async (req,res,next) => {

    const emp_id = req.body.a;
    const job_id  =req.body.b;
    try{
        const [row,field] = await pool.query("update Job_registor set com_confirm = 1,date_com_confirm = CURRENT_TIMESTAMP where emp_id =? and job_id = ?",[emp_id,job_id] )
     

    }catch(err){
        console.log(err);
    }
})

router.put("/cancel", async (req,res,next) => {


    const emp_id = req.body.a;
    const job_id  =req.body.b;
    try{
        const [row,field] = await pool.query("update Job_registor set cancel_status = 1 where emp_id =? and job_id = ?",[emp_id,job_id] )
     

    }catch(err){
        console.log(err);
    }
})

router.put("/end", async (req,res,nect)  => {

    const id = req.body.work;
    try{
        const [row,fields] = await pool.query("update Jobs set status = 0 where job_id = ?" ,[id])
    }
    catch(err){
        console.log(err);
    }
})


exports.router = router;