import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = mongoose.Schema({

    fullname: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    contactNumber: {
        type: String,
        required: false,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: function()
        {
            return !this.googleId
        },
        minlength: 6
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    },
    googleId:{
        type:String,
    }
}, { timestamps: true }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    // hash password before saving
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash
    

});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)
export default userModel