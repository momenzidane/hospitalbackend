const { infoValidator } = require("../validation");
const { dbConnection } = require("../configuration");
class Info {
  constructor(infoData) {
    this.infoData = infoData;
  }
  //funcition (save) insert data to database by collection admin
  save(cb) {
    dbConnection("info", async (collection) => {
      try {
        const info = await collection.insertOne(this.infoData);
        if (info) {
          cb({
            status: true,
            data: this.infoData,
          });
        }
        cb({
          status: false,
        });
      } catch (error) {
        cb({
          status: false,
          message: error.message,
        });
      }
    });
  }

  //funcition (validate) validate data
  static validate(infoData) {
    try {
      const validationResult = infoValidator.validate(infoData);
      return validationResult;
    } catch (error) {
      return {
        status: false,
        message: error.message,
      };
    }
  }
}
module.exports = Info;
