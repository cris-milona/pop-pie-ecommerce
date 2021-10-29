const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Product = require('../models/product');
const { authAdmin } = require('../middlewares/auth');

const router = new express.Router();
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith('.jpg')) {
      return cb(new Error('File must end in jpg'));
    }
    cb(undefined, true);
  },
});

//admin panel page
router.get('/admin/panel', authAdmin, (req, res) => {
  res.render('adminPanel', {
    user: req.user,
    products: [],
    message: null,
  });
});

//add someone as admin
router.get('/admin/add', authAdmin, (req, res) => {});

//create product by admin
router.post(
  '/admin/product/new',
  authAdmin,
  upload.single('image'),
  async (req, res) => {
    const product = new Product(req.body);
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({
          width: 250,
          height: 250,
        })
        .jpeg()
        .toBuffer();
      product.image = buffer;
      await product.save();
      const message = `${product.title} succesfully added to cart`;
      req.session.message = message;
      // res.redirect('/admin/panel');
      res.render('adminPanel', { user: req.user, products: [], message });
    } catch (e) {
      res.status(404).send(e);
    }
  }
);

//remove a product from the db
router.delete('/admin/product/remove', authAdmin, async (req, res) => {
  try {
    const prodToRemove = await Product.findByIdAndDelete(req.body.id);
    const message = `${prodToRemove.title} is succesfully deleted from the db`;
    req.session.message = message;
    res.send('ok');
  } catch (e) {
    res.status(404).send(e);
  }
});

//search a product by name
router.post('/admin/product/search', authAdmin, async (req, res) => {
  try {
    if (req.body.search.trim() === '' || !req.body.search) {
      const message =
        'There is no product matching your query. Please try again';
      req.session.message = message;
      // return res.redirect('/admin/panel');
      return res.render('adminPanel', {
        user: req.user,
        products: [],
        message,
      });
    } else {
      //create a regex espression to search all the titles
      const regex = new RegExp(req.body.search, 'i');
      // search for the products that contain the name typed on the search bar
      const products = await Product.find({
        title: { $regex: regex },
      });
      if (products.length === 0) {
        const message = 'The product name does not exist';
        req.session.message = message;
        // return res.redirect('/admin/panel');
        return res.render('adminPanel', {
          user: req.user,
          products: [],
          message,
        });
      } else {
        req.session.products = products;
        // return res.redirect('/admin/panel');
        res.render('adminPanel', { user: req.user, products, message: null });
      }
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

//get edit page with product
router.get('/admin/edit/:id', authAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('edit', { product, user: req.user });
  } catch (e) {
    res.status(404).send(e);
  }
});

//update product
router.put('/admin/edit/:id', authAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    product.title = req.body.title;
    product.description = req.body.description;
    product.priceS = parseInt(req.body.priceS);
    product.priceL = parseInt(req.body.priceL);
    product.category = req.body.category;
    await product.save();
    res.render('card', { product, user: req.user });
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
