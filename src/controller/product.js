const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  //res.status(200).json( { file: req.files, body: req.body } );

  const { name, price, description, category, quantity, createdBy } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product });
    }
  });
};

// exports.getProductsBySlug = (req,res) =>{

//   const {slug} = req.params;

//   Category.findOne({slug:slug})
//   .select('_id')
//   .exec((error,category) => {
//     if(error){
//       return res.status(400).json({error});
//     }

//     if(category){

//       Product.find({category:category._id})
//       .exec((error,products) => {

//         if(error){
//           res.status(400).json({error});
//         }

//           if(products.length >0){

//             res.status(200).json({
//               products,
//               productsByPrice: {
//                 under5k: products.filter((product) => product.price <= 5000),
//                 under10k: products.filter(
//                   (product) => product.price > 5000 && product.price <= 10000
//                 ),
//                 under15k: products.filter(
//                   (product) => product.price > 10000 && product.price <= 15000
//                 ),
//                 under20k: products.filter(
//                   (product) => product.price > 15000 && product.price <= 20000
//                 ),
//                 under30k: products.filter(
//                   (product) => product.price > 20000 && product.price <= 30000
//                 ),
//               }

//             });
//           }

//       })
//     }

//   });

// }

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type slug name")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5k: 5000,
                  under10k: 10000,
                  under15k: 15000,
                  under20k: 20000,
                  under30k: 30000,
                },
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.getSearchByCatSlug = (req, res) => {
  
  const { name } = req.body;
  const $regex = name;

  console.log(name);

  Category.findOne({ slug: { $regex, $options: "i" } })
    .select("_id slug type ")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

       if (category) {
         Product.find({ category: category._id })
           .populate({ path: "category", select: "_id name type" })
           .exec((error, products) => {
             if (error) {
               return res.status(400).json({ error });
             }

             if (category.type) {
               res.status(200).json({ category });
             }
           });
       }

       
    });
};

exports.getProductsByProductName = (req, res) => {
  const { name } = req.body;
  const $regex = name;

  console.log(name);

  Product.findOne({ name: { $regex, $options: "i" } })
    .populate({ path: "category", select: "_id name slug" })
    .exec((error, product) => {

      Category.findOne({ slug:product.category.slug })
        .select("_id type slug")
        .exec((error, category) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (category) {
            Product.find({ category: category._id, name:{ $regex, $options: "i"} }).exec((error, products) => {
              if (error) {
                return res.status(400).json({ error });
              }

              if (category.type) {
                if (products.length > 0) {
                  res.status(200).json({
                    products,
                    priceRange: {
                      under5k: 5000,
                      under10k: 10000,
                      under15k: 15000,
                      under20k: 20000,
                      under30k: 30000,
                    },
                    productsByPrice: {
                      under5k: products.filter(
                        (product) => product.price <= 5000
                      ),
                      under10k: products.filter(
                        (product) =>
                          product.price > 5000 && product.price <= 10000
                      ),
                      under15k: products.filter(
                        (product) =>
                          product.price > 10000 && product.price <= 15000
                      ),
                      under20k: products.filter(
                        (product) =>
                          product.price > 15000 && product.price <= 20000
                      ),
                      under30k: products.filter(
                        (product) =>
                          product.price > 20000 && product.price <= 30000
                      ),
                    },
                    category,
                  });
                }
              } else {
                res.status(200).json({ products });
              }
            });
          }
        });
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId })
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "reviews.userId", select: "_id firstName lastName" })
      .exec((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
          //console.log(product);
          res.status(200).json({ product });
        }
      });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category") //changed to get category in breed
    .populate({ path: "category", select: "_id name " })
    .exec();

  res.status(200).json({ products });
};

exports.addReview = async (req, res) => {
  const { productId, review, rating } = req.body;
  userId = req.user._id;

  Product.findOneAndUpdate(
    { _id: productId },
    {
      $push: {
        reviews: {
          userId,
          review,
          rating,
        },
      },
    },
    {
      upsert: true,
    }
  ).exec((error, result) => {
    if (error) {
      return res.status(400).json({ error });
    }

    if (result) {
      return res.status(200).json({ result });
    }
  });
};
