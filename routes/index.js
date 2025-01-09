// const bookRouter = require('./book');
// const authRouter = require('./auth')

const adminRouter = require('./admin')
const doctorRouter = require('./doctor')
const patientRouter = require('./patient')


module.exports = (app)=>{
    app.get('/',(req,res,next)=>{
        res.status(200).json({
            status:true,
            message:null
        })
    })

    app.use('/admin',adminRouter)
    app.use('/doctor',doctorRouter)
    app.use('/patient',patientRouter)

}