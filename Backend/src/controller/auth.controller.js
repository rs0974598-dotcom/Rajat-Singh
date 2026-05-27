import User from "../model/auth.model.js";
import jwt from "jsonwebtoken"
import { config } from "../config/config.js";
import userModel from "../model/auth.model.js";


export const sendTokenResponse = (user, res) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    config.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    token,
    user: {
      fullname: user.fullname,
      email: user.email,
      contactNumber: user.contactNumber,
      role: user.role,
    },
  });
};

export const registerUser = async (req, res) => {
    try {
        const { fullname, email, password, contactNumber,isSeller } = req.body;

        // check user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // create user
        const user = await User.create({
            fullname,
            email,
            password,
            contactNumber,
            role:isSeller ? "seller":"buyer",
        });
        sendTokenResponse(user, res);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }

    const user = await userModel
      .findOne({ email })
      .select("+password");


    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }


    sendTokenResponse(user, res);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const googlecallback = async (req, res) => {
  try {
    const { id, displayName, emails } = req.user;

    const email = emails?.[0]?.value;

    if (!email) {
      return res.status(400).json({
        message: "Google email not found",
      });
    }

    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        fullname: displayName,
        email,
        googleId: id,
        role: "buyer",
      });
    }

    // token + cookie send
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // redirect frontend
    res.redirect("http://localhost:5173/");

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Google auth failed",
    });
  }
};

export const getMe = async (req,res)=>
{
  const user = req.user

  res.status(200).json({
    message:"user fetched successfully",
    success:true,
    user:{
      id:user._id,
      fullname:user.fullname,
      email:user.email,
      contactNumber:user.contactNumber,
      role: user.role,
    }
  })
}