const jwt = require('jsonwebtoken')
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if ( req.headers.authorization  &&  req.headers.authorization.startsWith('Bearer'))
{
    try {
        token = req.headers.authorization.split(' ')[1];
// decrypt jwt using .env secret
        const decrypted = jwt.verify(token, process.env.JWT_SECRET);
// find user with id excluding password
        req.user = await User.findById(decrypted.id).select('-password');

        next();
    }
    catch (error){
        res.status(401);
        throw new Error("Token authorization failure!")
    }
    if (!token) {
        res.status(401); 
        throw new Error('Token not found')    
    }
}})

module.exports =  { protect };