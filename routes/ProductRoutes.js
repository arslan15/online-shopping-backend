const express = require('express');
const Product = require('../model/Product');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/authMiddleware');
router.get('/', (req, res) => {
  res.send('Product route working');
});
router.post('/addProduct', verifyToken,
  authorize(['Admin']), async(req,res)=>{
  try {
    
    const {productName, ProductDescription, productCategoryType,ProductQty,ImageUrl,price} = req.body;
    const newProduct = new Product({productName, ProductDescription, productCategoryType,ProductQty,ImageUrl,price });
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully!' });
  } catch (error) {
    console.error('ADD PRODUCT CATCH ERROR:', error.message);
  
    res.status(500).json({ message: 'Server error during adding product.' });

  }
})
router.get('/Products', verifyToken,
  authorize(['User','Admin']),async (req, res) => {
  try {
    const Products = await Product.find({});
    res.status(200).json(Products);
  } catch (error) {
    console.error('GET Product ERROR:', error.message);
    res.status(500).json({ message: 'Server error fetching Products.' });
  }
});


module.exports = router;