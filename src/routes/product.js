const express = require('express');
const { requireSignin, adminMiddleware, userMiddleware, uploadS3 } = require('../common-middleware');
const { createProduct, getProductsBySlug, getProductDetailsById,  getProducts,deleteProductById, addReview, getSearchByCatSlug, getProductsByProductName,  } = require('../controller/product');
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
 router.post('/product/search',getSearchByCatSlug);
 router.post('/products/searchProduct',getProductsByProductName);
 
 router.post('/product/create',requireSignin,adminMiddleware,uploadS3.array('productPicture'),createProduct);
 router.get('/products/:slug',getProductsBySlug);
//  router.get('/category/getCategory',getCategories);
 router.get('/product/:productId', getProductDetailsById);

 router.delete(
  "/product/deleteProductById",
  requireSignin,
  adminMiddleware,
  deleteProductById
);

 router.post(
  "/product/getProducts",
  requireSignin,
  adminMiddleware,
  getProducts
);

router.post(
  "/product/addReview",
  requireSignin,
  userMiddleware,
  addReview
);


 module.exports = router;