/**With Chatgpt*/
const express = require('express');
const middleware = require('./middleware');


const routes = require('./routes');
const createError  = require('http-errors');
const app = express();

const {returnJson} = require('./my_module/json_respons')
global.returnJson = returnJson

process.on('unhandledRejection', (reason) => {
    console.log("global handling :" + reason);
    process.exit(1);
});

/**
 * Middleware check
 */
middleware.global(app);

/**
 * Routers
 */
routes(app);
console.log('left rout');

/**
 * Error Handling 404 (Not Found)
 */
app.use((req, res, next) => {
    const error = createError(404, "Page not found");
    next(error);
});

/**
 * General Error Handling
 */
app.use((error, req, res, next) => {
    // Ensure headers haven't already been sent
    if (!res.headersSent) {
        // res.status(error.status || 500).json({
        //     status: false,
        //     message: error.message || "Internal Server Error"
        // });

        return returnJson(res,error.status || 500,false, error.message || "Internal Server Error",null)
    }
});

module.exports = app;
