const express = require("express");
const { UniversityDBAdmin } = require("../models/admin");

const router = express.Router();

const UniversityMember = require("../models/universityMember");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const {
  GetObjectAclCommand,
  GetObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const s3Client = require("../config/awsConfig");
const { generateFileName } = require("../helper/utils");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const isUniversityAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "university-admin") {
    return next();
  }
  return res.status(403).send("Access denied");
};

router.post(
  "/add-member",
  isUniversityAdmin,
  upload.single("photo"),
  async (req, res) => {
    try {
      const data = req.body;
      data.emails = data.emails.split(",").map((email) => email.trim());
      data.uniqueId = data.uniqueId.toLowerCase();
      const photoFile = req.file;
      data.photo = generateFileName();
      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: data.photo,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      await s3Client.send(new PutObjectCommand(uploadParams));

      const newMember = new UniversityMember(data);
      console.log(newMember);
      res.status(200).send({ message: "Member added successfully!" });
      await newMember.save();
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ message: "An error occurred while adding the member." });
    }
  }
);

module.exports = router;
