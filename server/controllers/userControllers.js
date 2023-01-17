const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateJWT = require('../config/generateJWT');

const registerUser = asyncHandler(async (req, res) => {

    // destructure user req.body
    const { name, email, password, avatar } = req.body; 

if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please ensure all required data fields are populated!')
}

const existingUser = await User.findOne({ email });

if(existingUser) {
    res.status(400);
    throw new Error('Submitted Email is already in use')
}

const user = await User.create({
    name,
    email,
    password,
    avatar
});

if (user) {
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        avatar: user.avatar,
        token: generateJWT(user._id)
    })
} else {
    res.status(400);
    throw new Error('User creation failed!')
}
})

const authUser = asyncHandler(async function (req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
       console.log('passwords match bro');
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token: generateJWT(user._id)
        })
    }  else {
        res.status(400);
        throw new Error('Incorrect username or password entered!')
    }
})

// /api/user?search=tim
const allUsers = asyncHandler(async (req, res) => {
//    if name or email below matches in DB \
// user will be returned
// modify search so it's only as deep as chars entered
//ex: query: 'ti' would only search for ti in the first 
//2 chars of a name and email
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ],
    } 
    : {};  
//  find user excluding user making the query
    const user = await User.findOne(keyword).find({ _id: { $ne: req.user._id }}); 

res.send(user);
})


module.exports = { registerUser, authUser, allUsers };