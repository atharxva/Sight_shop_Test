import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: { type: String },
    brand: { type: String },
    category: { type: String },
    description: { type: String },
    price: { type: Number },
    frametype: { type: String },
    size: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

export default productModel;
