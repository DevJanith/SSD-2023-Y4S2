import axios from "axios";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import uuid from "react-uuid";
import User from "../models/user.model.js";

dotenv.config();

import validator from "validator";
export const signIn = async (req, res) => {
  const { email, password, type, code } = req.body;

  try {
    let userEmail;

    if (type === "google") {
      const googleCode = code; // Assuming you receive the "code" in the request body

      // Step 1: Exchange the Google code for an access token and ID token
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code: googleCode,
          client_id:
            "1080426972385-5993vdo0adoqlb91gr31p6rmerk4ljt6.apps.googleusercontent.com",
          client_secret: "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",
          redirect_uri: "http://localhost:3000",
          grant_type: "authorization_code",
        }
      );

      const { access_token, id_token } = tokenResponse.data;

      // Step 2: Retrieve user information from Google using the access token
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const { email: googleEmail } = userInfoResponse.data;

      userEmail = googleEmail;
    } else {
      if (email === null || typeof email == "undefined")
        return res
          .status(400)
          .json({ code: "02", message: "Email Field Required" });

      // Validate the password using the validatePassword function
      if (!validatePassword(password)) {
        return res
          .status(400)
          .json({ code: "02", message: "Invalid Password Format" });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid email address" });
      }
      let existingUser = await User.findOne({ email: email });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordCorrect)
        return res
          .status(400)
          .json({ code: "02", message: "Invalid Credentials" });

      userEmail = email;
    }

    let existingUser = await User.findOne({ email: userEmail });

    if (!existingUser)
      return res
        .status(404)
        .json({ code: "02", message: "User doesn't exist" });

    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ code: "01", result: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "00", message: "Something went wrong" });
  }
};

// Function to validate the password
function validatePassword(password) {
  // Regular expressions to check for special characters and numeric characters
  const specialCharacterRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;
  const numericCharacterRegex = /[0-9]/;

  // Check if the password is at least 8 characters long and contains the required characters
  return (
    password.length >= 5 &&
    specialCharacterRegex.test(password) &&
    numericCharacterRegex.test(password)
  );
}

export const signUp = async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    type,
    userFirstName,
    userLastName,
    userContactNumber,
    userAddressLine1,
    userAddressLine2,
    userAddressLine3,
  } = req.body;

  try {
    if (type === null || typeof type == "undefined")
      return res
        .status(400)
        .json({ code: "02", message: "Type Field Required" });
    if (email === null || typeof email == "undefined")
      return res
        .status(400)
        .json({ code: "02", message: "Email Field Required" });
    if (userFirstName === null || typeof userFirstName == "undefined")
      return res
        .status(400)
        .json({ code: "02", message: "User First Name Field Required" });
    if (userLastName === null || typeof userLastName == "undefined")
      return res
        .status(400)
        .json({ code: "02", message: "User Last Name Field Required" });
    if (userContactNumber === null || typeof userContactNumber == "undefined")
      return res
        .status(400)
        .json({ code: "02", message: "User Contact Number Field Required" });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Invalid email address" });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ code: "02", message: "User already exist" });

    if (type == "buyer") {
      if (password === null || typeof password == "undefined")
        return res
          .status(400)
          .json({ code: "02", message: "Password Field Required" });
      if (password !== confirmPassword)
        return res
          .status(400)
          .json({ code: "02", message: "Password doesn't match" });

      const hashPassword = await bcrypt.hash(password, 12);

      const userDetails = new User({
        email: email,
        password: hashPassword,
        type: type,
        userDetails: {
          userQNumber: uuid(),
          userEmail: email,
          userName: `${userFirstName} ${userLastName}`,
          userContactNumber: userContactNumber,
          userAddress: `${userAddressLine1}, ${userAddressLine2}, ${userAddressLine3}`,
          userType: type,
        },
      });

      const userResult = await userDetails.save();

      const token = jwt.sign(
        { email: userResult.email, id: userResult._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ code: "01", result: userResult, token });
    } else if (type == "trader") {
      const userDetails = new User({
        email: email,
        type: type,
        userDetails: {
          userQNumber: uuid(),
          userEmail: email,
          userName: `${userFirstName} ${userLastName}`,
          userContactNumber: userContactNumber,
          userAddress: `${userAddressLine1}, ${userAddressLine2}, ${userAddressLine3}`,
          userType: type,
        },
        states: 2,
      });

      const userResult = await userDetails.save();

      const token = jwt.sign(
        { email: userResult.email, id: userResult._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ code: "01", result: userResult, token });
    }
  } catch (error) {
    res.status(500).json({ code: "00", message: "Something went wrong" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200);
    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(404);
    res.json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    res.status(200);
    res.json({
      code: "01",
      result: user,
    });
  } catch (error) {
    res.status(404);
    res.json({ message: error.message });
  }
};

export const getUserAccordingToType = async (req, res) => {
  const { userType } = req.params;
  try {
    const users = await User.find({ type: userType });

    res.status(200);
    res.json(users);
  } catch (error) {
    res.status(404);
    res.json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ code: "02", message: `Invalid Id` });
    }

    if (data.type == "buyer" || data.type == "admin") {
      const updateUser = { ...data, _id: id };
      await User.findByIdAndUpdate(id, updateUser, { new: true });

      res.status(200);
      res.json({ code: "01", result: updateUser });
    } else if (data.type == "trader") {
      var password = Math.random().toString(36).slice(-8);
      const hashPassword = await bcrypt.hash(password, 12);
      const updateUser = { ...data, password: hashPassword, _id: id };

      await User.findByIdAndUpdate(id, updateUser, { new: true });

      //call email service

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
          clientId: process.env.OAUTH_CLIENTID,
          clientSecret: process.env.OAUTH_CLIENT_SECRET,
          refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
      });

      let mailOptions = {
        from: "janithgamage1.ed@gmail.com",
        to: updateUser.email,
        subject: "Shop House Project",
        text: `You are Successfully Approved, you're username: ${updateUser.email} , you're password : ${password}`,
      };

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.log("Error " + err);
        } else {
          console.log("Email sent successfully");
        }
      });

      res.status(200);
      res.json({ code: "01", result: updateUser });
    }
  } catch (error) {
    res.status(404);
    res.json({ code: "00", message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ code: "02", message: `Invalid Id` });
    }

    await User.findByIdAndDelete(id);

    res.status(200);
    res.json({ code: "01", message: "User Deleted Successfully" });
  } catch (error) {
    res.status(404);
    res.json({ code: "00", message: error.message });
  }
};
