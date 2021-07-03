const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-middleware');
const { createProduct, getProductBySlug, getProductDetailsById } = require('../controller/product');
const router = express.Router();
const multer = require('multer');

const shortid = require("shortid");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), "uploads"));
    },
    filename: function (req, file, cb) {
      cb(null, shortid.generate() + "-" + file.originalname);
    },
  });

//const { addCategory, getCategories } = require('../controller/category');

const upload = multer({storage});
 router.post('/product/create',requireSignin,adminMiddleware,upload.array('productPicture'),createProduct);
 router.get('/products/:slug',getProductBySlug);
//  router.get('/category/getCategory',getCategories);
 router.get('/product/:productId', getProductDetailsById);

 module.exports = router;