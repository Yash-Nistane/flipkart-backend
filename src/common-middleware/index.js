const jwt = require('jsonwebtoken');
const multer = require('multer');
const shortid = require("shortid");
const path = require("path");
const multerS3 = require("multer-s3");
var aws = require('aws-sdk')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
  });

exports.upload = multer({storage});
 const s3 = new aws.S3({ 
      accessKeyId:"AKIATKRUSBMMONPARX4G",
      secretAccessKey:"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",
  })

exports.uploadS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'flipkart-clone-app-yash',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname)
    }
  })
})

exports.requireSignin = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
  } else {
    return res.status(400).json({ message: "Authorization required" });
  }
  next();
  //jwt.decode()
};


  exports.userMiddleware = (req, res, next) => {
    if (req.user.role !== "user") {
      return res.status(400).json({ message: "User access denied" });
    }
    next();
  };
  
  exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
      //  if (req.user.role !== "super-admin") {
        return res.status(400).json({ message: "Admin access denied" });
      //}
    }
    next();
  };