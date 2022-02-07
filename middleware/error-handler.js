const { CustomApiError } =  require('../errors');
const { StatusCodes } =  require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {

    let customError = {
        statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, Please try again later'
    }
    if (err instanceof CustomApiError){
        return res.status(err.StatusCode).json({msg: err.message})
    }
    if(err.name === 'ValidationError'){
        customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(',')
    }

    if(err.code && err.code === 11000){
        customError.msg = `Duplicate Value entered for ${Object.keys(err.keyValue)} field, please choose another value`
        customError.statusCode = 400
    }
    if(err.name === 'CastError'){
        customError.msg = `No object found with the ID: ${err.value}`
        customError.statusCode = 404
    }

    return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware