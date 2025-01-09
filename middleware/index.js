const express = require('express')


module.exports = {
  global:(app) => {
    app.use((req,res,next)=>{
      next();
    })
    app.use(express.json())
  },
  auth:require('./auth')
}









// module.exports = (app) => {
//   //Middelware
//   //using to chiking the request condtion
//   app.use((req, res, next) => {
//     const lang = req.query.lang;
//     if (lang && (lang == "ar" || lang == "en")) {
//       next();
//     }
//       res.status(400).json({
//         message: "lang is required ❤❤ : you must be ar or en",
//       });
//   });
//   app.use((req,res,next)=>{
//     //some chek
//     next()
//   })
// };
