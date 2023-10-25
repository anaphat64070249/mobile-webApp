const pool = require("../config")
const express = require('express');
const router = express.Router();

router.post("/addreview", async (req,res,next) => {

    const id = req.body.id;
    const reviewer = req.body.reviewer;
    const score = req.body.score;
    const comm = req.body.comment;
    const report = req.body.report;
    const work_id = req.body.work_id;

    try{
        // const [row1] = await pool.query("ALTER TABLE Reviews DROP CONSTRAINT reviews_ibfk_1")

        // const [row2] = await pool.query("ALTER TABLE Reviews DROP CONSTRAINT reviews_ibfk_2")

        // const [row] = await pool.query("ALTER TABLE Reviews DROP primary key")
        
        const [row4,fields] = await pool.query("insert into Reviews(emp_id,job_id,reviewer_name,score,comments,report,reviewer) values (?,?,?,?,?,?,'com')",[id,work_id,reviewer,score,comm,report])

    }
    catch(err){
        console.log(err);
    }

})

router.post("/peopleName", async (req,res,next) => {


    const id = req.body.id; 
    try{

        const [row,fields] = await pool.query("select * from Personal_infomations where personal_infoID = ?",[id])
        res.json({name:row[0]})
    }

    catch(err){
        console.log(err);
    }

})


exports.router = router;