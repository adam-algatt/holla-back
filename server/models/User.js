const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
    
    },
    {
        timestamps: true,
    }
)

userSchema.methods.matchPassword = async function (pass) {
return await bcrypt.compare(pass, this.password)
}


// hook to encrypt password before saving to DB
// non arrow function in order to use keyword this
userSchema.pre("save", async function (next) {
    const user = this; 
    if (!user.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash; 
});

const User = mongoose.model('User', userSchema);
module.exports = User;