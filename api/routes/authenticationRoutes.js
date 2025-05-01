const express = require("express");
const router = express.Router();
const authIdController = require("../controllers/authIdController");
const authGoogleController = require("../controllers/authGoogleController");

router.get("/fetch-member/:uniqueId", authIdController.fetchMember);
router.post("/send-otp", authIdController.sendOtp);
router.post("/verify-otp", authIdController.verifyOtp);
router.post("/save-user-password", authIdController.saveUserPassword);
router.post("/login", authIdController.login);
router.post("/set-password", authIdController.setPassword);

router.get("/auth/google", authGoogleController.auth_google);
router.get("/auth/google/callback", authGoogleController.auth_google_callback);
router.get("/logout", authGoogleController.logout_get);

module.exports = router;
