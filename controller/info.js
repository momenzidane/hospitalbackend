const { dbConnection } = require("../configuration");
// const { ObjectId } = require("bson");
const {Info} = require('../models')
const createError = require("http-errors");

/*
 * add information data http://localhost:5500/donor/signup
*/
 const addData = (req, res, next) => {
    const infoData = req.body;
  
    //validation
    const validation = Info.validate(infoData);
  
    if (validation.error) {
      return next(createError(400, validation.error.message));
    }
    
    //new Object
    const info = new Info(infoData);

     //insert data
     info.save((result) => {
            if (result.status) {
                return returnJson(res,201,true,'info has been created sucss',result.data)  
              }
              return next(createError(500, result.message));
        })
 }
  
 /*
 * GET information WITH LIMET http://localhost:5500/info?page=1
 */
 const getAllInfo = (req, res, next) => {
  dbConnection("info", async (collection) => {
    try {
      const pageNum = parseInt(req.query.page);

      // console.log(req.query);

      if (isNaN(pageNum)) {
        next(createError(400,"the value of ?page='must be an integer'"));
      }
      /*
            page  limet  skip
            1      10    0
            2      10    10
            3      10    20
          */
      const limit = 4;
      const skip = (pageNum - 1) * limit;

      const info = await collection
        .find({})
        .limit(limit)
        .skip(skip)
        .toArray();
        
      return returnJson(res,200,true,'',info)
    } catch (error) {
      return next(createError(401,error.message))
    }
});
 };

  module.exports = {addData,getAllInfo}

