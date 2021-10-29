const express = require('express');
const Product = require('../models/product');
const { authUser } = require('../middlewares/auth');

const router = new express.Router();

//add a product to the cart
router.post('/products/cart', authUser, async (req, res) => {
  try {
    const product = await Product.findById(req.body.id);
    const cartProduct = product.toObject();

    cartProduct.price = req.body.price || product.priceS;
    cartProduct.quantity = req.body.quantity || 1;

    if (!req.session.cartArray) {
      req.session.cartArray = [];
    }
    req.session.cartArray.push(cartProduct);
    res.send('The product has been added to the cart');
  } catch (e) {
    res.status(404).send(e);
  }
});

//delete a product from the cart
router.delete('/products/cart', authUser, async (req, res) => {
  try {
    const product = await Product.findById(req.body.id);
    const index = req.session.cartArray.indexOf(product);
    req.session.cartArray.splice(index, 1);
    res.send('deleted');
  } catch (e) {
    res.status(404).send(e);
  }
});

//get all products
router.get('/products', authUser, async (req, res) => {
  let allProducts;
  try {
    if (!req.query.category) {
      allProducts = await Product.find({});
    } else {
      allProducts = await Product.find({ category: req.query.category });
    }
    //server side pagination
    const productsPerPage = 12;
    const numberOfPages = Math.ceil(allProducts.length / productsPerPage);
    //handle pages before the first one and after the last
    let page = req.query.page ? parseInt(req.query.page) : 1;
    if (page > numberOfPages) {
      res.redirect('/products?page=' + encodeURIComponent(numberOfPages));
    } else if (page < 1) {
      res.redirect('/products?page=' + encodeURIComponent('1'));
    }
    //determine the starting product number
    let skip = (page - 1) * productsPerPage;
    let limit = productsPerPage;

    //ask for the products of the specific query
    if (req.query.category) {
      const products = await Product.find({
        category: req.query.category,
      })
        .limit(limit)
        .skip(skip);
      res.status(200).render('products', {
        products,
        user: req.user,
        page,
        numberOfPages,
        category: req.query.category,
      });
    } else {
      const products = await Product.find({}).limit(limit).skip(skip);
      res.status(200).render('products', {
        products,
        user: req.user,
        page,
        numberOfPages,
        category: null,
      });
    }
  } catch (e) {
    res.status(404).send(e);
  }
});

//get product by id
router.get('/products/:id', authUser, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('card', { product, user: req.user });
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = router;
