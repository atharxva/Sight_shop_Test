// Description: It has the function to display all the products in the database.
import productModel from "../database/datamodels/products.js";

async function displayProduct(req, res) {
  const { id } = req.params;

  try {
    const products = await productModel.find(id ? { _id: id } : {});
    const plainProducts = products.map((product) => product.toObject());
    res.status(200).json(plainProducts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Couldnt fetch Data" });
  }
}

export default displayProduct;
