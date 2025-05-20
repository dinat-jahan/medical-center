const express = require("express");
const router = express.Router();
const authIdController = require("../controllers/authIdController");
const authGoogleController = require("../controllers/authGoogleController");
const ctrl = require("../controllers/authPasswordController");

router.get("/fetch-member/:uniqueId", authIdController.fetchMember);
router.post("/send-otp", authIdController.sendOtp);
router.post("/verify-otp", authIdController.verifyOtp);
router.post("/save-user-password", authIdController.saveUserPassword);
router.post("/login", authIdController.login);

router.post("/set-password-google", authGoogleController.setPasswordGoogle);
router.get("/google", authGoogleController.auth_google);
router.get("/google/callback", authGoogleController.auth_google_callback);
router.get("/logout", authGoogleController.logout_get);

// Forgot password flow
router.post("/forgot-password/send-otp", ctrl.sendResetOtp);
router.post("/forgot-password/verify-otp", ctrl.verifyResetOtp);
router.post("/forgot-password/reset-password", ctrl.resetPassword);
router.get("/forgot-password/fetch-member/:uniqueId", ctrl.fetchUserForReset);
module.exports = router;
