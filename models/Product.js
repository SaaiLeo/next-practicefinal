import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    name: String,
    description: String,
    price: Number,
    category: String    
});

const Product = mongoose.models.product || mongoose.model("product", productSchema)

export default Product;