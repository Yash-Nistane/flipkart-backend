const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
const path = require('path');
const cors = require('cors');

app.use(cors());
//routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth'); //admin routes
const categoryRoutes = require('./routes/category'); //categoryroutes
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const initialDataRoutes = require('./routes/admin/initialData');
const pageRoutes = require('./routes/admin/page');
const addressRoutes = require('./routes/address');
const orderRoutes = require('./routes/order');
const adminOrderRoute = require('./routes/admin/order.routes');


env.config();
PORT = process.env.PORT || 5000

//mongo connection
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.lfm1n.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Database connected");
  });


  
  app.use(express.json());
  app.use('/public',express.static(path.join((__dirname),'uploads')));

  app.use('/api',authRoutes);
  app.use('/api',adminRoutes);
  app.use('/api',categoryRoutes);
  app.use('/api',productRoutes);
  app.use('/api',cartRoutes);
  app.use('/api',initialDataRoutes);
  app.use('/api',pageRoutes);
  app.use('/api',addressRoutes);
  app.use('/api',orderRoutes);
  app.use('/api',adminOrderRoute);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });