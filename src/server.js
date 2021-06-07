const express = require('express');
const axios = require('axios');


//Create express server
const app = express();


//Get the image list 
app.get('/imageList',(req,res)=>{
        res.header("Access-Control-Allow-Origin", "*");
        axios.get(`https://bigvu-interviews-assets.s3.amazonaws.com/presenters.json`)
        .then((response)=>{
            res.send(response.data)
        })

  });


//Listen to server on port 3001
app.listen(3001,()=>{
  console.log("running on port 3001")
})
