// backend/models/productModel.js
const mongoose = require('mongoose');
// const fs = require('fs');

const productSchema = mongoose.Schema({
    id:{type:Number, required:true},
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

// const imageBuffer = fs.readFileSync('path/to/image.png');
// const base64Image = imageBuffer.toString('base64');
// const jsonObject = {
//   name: 'John Doe',
//   image: base64Image,
// };
// db.collection.insertOne(jsonObject);
