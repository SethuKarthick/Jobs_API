const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnAuthenticatedError  } = require('../errors');
const jwt = require('jsonwebtoken');

const register = async(req, res) => {

    const user = await User.create({...req.body})
    
    res.status(StatusCodes.CREATED).json({user: {name:user.getName()}, token: user.createJWT() })
} 

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    if (!user){
        throw new UnAuthenticatedError('Invalid Creds')
    }
    const isPasswordMatch = await user.comparePassword(password)
    if(!isPasswordMatch){
        throw new UnAuthenticatedError('Invalid Creds')
    }
    res.status(StatusCodes.OK).json({user:{name:user.name}, token:user.createJWT()})
}

module.exports = {
    register, login
}