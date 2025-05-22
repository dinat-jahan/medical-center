require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const router = express.Router();
const bcrypt = require("bcrypt");

const app = express();
app.use(cookieParser());
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UniversityMember = require("../models/universityMember");
const MedicalUser = require("../models/medicalUser");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile Email:", profile.emails[0].value);

        const email = profile.emails[0].value.toLowerCase();
        // Check if the user exists in MedicalUser
        let user = await MedicalUser.findOne({
          emails: { $elemMatch: { $regex: new RegExp(`^${email}$`, "i") } },
        });
        console.log("User from Google:", user);

        if (!user) {
          // If user not found, check if the user exists in UniversityMember
          const universityUser = await UniversityMember.findOne({
            emails: { $elemMatch: { $regex: new RegExp(`^${email}$`, "i") } },
          });
          console.log("user from university user:", universityUser);
          if (universityUser) {
            // Calculate the role based on universityUser data
            const role = MedicalUser.determineRole(
              universityUser.userType,
              universityUser.designation,
              universityUser.office
            );

            // Create new MedicalUser object
            user = new MedicalUser({
              uniqueId: universityUser.uniqueId,
              name: universityUser.name,
              userType: universityUser.userType,
              sex: universityUser.sex,
              department: universityUser.department,
              office: universityUser.office,
              designation: universityUser.designation,
              designation_2: universityUser.designation_2,
              program: universityUser.program,
              hall: universityUser.hall,
              session: universityUser.session,
              bloodGroup: universityUser.bloodGroup,
              dob: universityUser.dob,
              emails: universityUser.emails,
              phone: universityUser.phone,
              photo: universityUser.photo,
              googleId: profile.id,
              role: role,
            });

            // Save new user to the database
            await user.save();
          } else {
            // If no university user found, handle accordingly (e.g., reject login)
            return done(null, false, {
              message: "User not found in university records",
            });
          }
        }

        // User found or created successfully, proceed with login
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports.auth_google = [
  (req, res, next) => {
    console.log("Cookies:", req.cookies);
    const role = req.cookies.role;
    req.session.role = role;
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
];

module.exports.auth_google_callback = (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect("/");

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Store user manually in session
      req.session.user = {
        id: user._id,
        uniqueId: user.uniqueId,
        name: user.name,
        role: user.role,
      };

      // If user has no password, set a session flag
      if (!user.password) {
        req.session.needsPassword = true;
      }

      console.log("Session user set:", req.session.user);

      req.session.save((err) => {
        if (err) return next(err);

        // Conditional redirect based on password status
        if (req.session.needsPassword) {
          return res.redirect(process.env.REDIRECT_URL_SET_PASSWORD);
        } else {
          return res.redirect(process.env.REDIRECT_URL_GOOGLE_REDIRECT);
        }
      });
    });
  })(req, res, next);
};

module.exports.logout_get = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Logout failed");
    }

    //clear the session cookie
    res.clearCookie("connect.sid");

    res.status(200).send("Logged out successfully");
  });
};

//set password for google account
module.exports.setPasswordGoogle = async (req, res) => {
  const { uniqueId, password } = req.body;
  try {
    const user = await MedicalUser.findOne({ uniqueId });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    console.log("password saved");

    return res.status(200).json({ success: true });
  } catch (e) {
    console.log("Set password error:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
