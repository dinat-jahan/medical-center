require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const router = express.Router();
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
      callbackURL: "http://localhost:2000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google Profile Email:", profile.emails[0].value);

        const email = profile.emails[0].value.toLowerCase();
        // Check if the user exists in MedicalUser
        let user = await MedicalUser.findOne({
          emails: { $in: [email] },
        });
        console.log("User from Google:", user);

        if (!user) {
          // If user not found, check if the user exists in UniversityMember
          const universityUser = await UniversityMember.findOne({
            emails: { $in: [email] },
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
              department: universityUser.department,
              office: universityUser.office,
              designation: universityUser.designation,
              designation_2: universityUser.designation_2,
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

      console.log("Session user set:", req.session.user);

      // Force session to save before redirect
      req.session.save((err) => {
        if (err) return next(err);
        return res.redirect("/patient/dashboard");
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
