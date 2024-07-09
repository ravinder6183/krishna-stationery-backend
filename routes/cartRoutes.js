const express = require('express');
const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).send('Cart not found');
  }
}));

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404).send('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(item => item.product.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity
    });
  }

  await cart.save();
  res.status(201).json(cart);
}));

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId
// @access  Private
router.put('/:itemId', protect, asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  // console.log(cart)

  if (!cart) {
    res.status(404).send('Cart not found');
  }

  const item = cart.items.find(item => item.product._id.toString() === req.params.itemId);

  if (item) {
    console.log(item)
    item.quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } else {
    res.status(404).send('Item not found');
  }
}));

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
router.delete('/:itemId', protect, asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  // console.log(cart)

  if (!cart) {
    res.status(404).send('Cart not found');
  }
  console.log(req.params.itemId)
  // console.log(cart.items)
  
  // console.log(cart.items[0]._id)
  cart.items = cart.items.filter((item)=> {
    // console.log(item.product._id)
    return(item.product._id.toString() !== req.params.itemId)});
  // console.log(cart.items)
  await cart.save();
  res.json(cart);
}));

module.exports = router;
