const {MongoClient} = require('mongodb');
const _url =process.env.MONGODB_URI
const _dbname = process.env.MONGODB_DB

//NOT : the coolection is the name of the table.
//NOT : the cb his jobe is controll
const dbConnection =(collection,cb)=>{
    //because the mongclient is using promis.
    MongoClient.connect(_url)
    .then(async (client)=>{
        const db = client.db(_dbname).collection(collection);
        await cb(db)
        client.close();
    })
    .catch();
}
module.exports = dbConnection;